import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cron from 'node-cron';
import { Op, DataTypes } from 'sequelize';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { sequelize, Project } from './models/index.js';
import authRoutes from './routes/auth.js';
import projectRoutes from './routes/projects.js';
import adminRoutes from './routes/admin.js';
import helpRoutes from './routes/help.js';
import reviewRoutes from './routes/reviews.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use('/uploads', express.static(uploadsDir));

// Database/Sequelize Connection
sequelize.authenticate()
  .then(async () => {
    console.log('Connected to Database via Sequelize');
    // Sync models (alter only if mysql, SQLite fails alter with FK constraints)
    await sequelize.sync({ alter: process.env.DB_DIALECT === 'mysql' });
    
    // For SQLite, dynamically add missing columns to avoid failing on FKs
    if (process.env.DB_DIALECT !== 'mysql') {
      const queryInterface = sequelize.getQueryInterface();
      try {
        const userTable = await queryInterface.describeTable('Users');
        if (!userTable.isVerified) {
          await queryInterface.addColumn('Users', 'isVerified', { type: DataTypes.BOOLEAN, defaultValue: false });
        }
        if (!userTable.verificationCode) {
          await queryInterface.addColumn('Users', 'verificationCode', { type: DataTypes.STRING, allowNull: true });
        }
        if (!userTable.resetCode) {
          await queryInterface.addColumn('Users', 'resetCode', { type: DataTypes.STRING, allowNull: true });
        }
        if (!userTable.resetCodeExpires) {
          await queryInterface.addColumn('Users', 'resetCodeExpires', { type: DataTypes.DATE, allowNull: true });
        }
        if (!userTable.verificationToken) {
          await queryInterface.addColumn('Users', 'verificationToken', { type: DataTypes.STRING, allowNull: true });
        }
        if (!userTable.verificationTokenExpiry) {
          await queryInterface.addColumn('Users', 'verificationTokenExpiry', { type: DataTypes.DATE, allowNull: true });
        }
      } catch (err) {
        console.log('Users table check/migration skipped or user table not initialized yet:', err.message);
      }

      try {
        const projectTable = await queryInterface.describeTable('Projects');
        if (!projectTable.includeFile) {
          await queryInterface.addColumn('Projects', 'includeFile', { type: DataTypes.BOOLEAN, defaultValue: false });
        }
        if (!projectTable.fileUrl) {
          await queryInterface.addColumn('Projects', 'fileUrl', { type: DataTypes.STRING, allowNull: true });
        }
        if (!projectTable.includeCode) {
          await queryInterface.addColumn('Projects', 'includeCode', { type: DataTypes.BOOLEAN, defaultValue: false });
        }
        if (!projectTable.codeFileUrl) {
          await queryInterface.addColumn('Projects', 'codeFileUrl', { type: DataTypes.STRING, allowNull: true });
        }
        if (!projectTable.codeContent) {
          await queryInterface.addColumn('Projects', 'codeContent', { type: DataTypes.TEXT, allowNull: true });
        }
        if (!projectTable.includeSimulation) {
          await queryInterface.addColumn('Projects', 'includeSimulation', { type: DataTypes.BOOLEAN, defaultValue: false });
        }
        if (!projectTable.simulationUrl) {
          await queryInterface.addColumn('Projects', 'simulationUrl', { type: DataTypes.STRING, allowNull: true });
        }
        if (!projectTable.includeVideo) {
          await queryInterface.addColumn('Projects', 'includeVideo', { type: DataTypes.BOOLEAN, defaultValue: false });
        }
        if (!projectTable.includeDrive) {
          await queryInterface.addColumn('Projects', 'includeDrive', { type: DataTypes.BOOLEAN, defaultValue: false });
        }
        if (!projectTable.driveUrl) {
          await queryInterface.addColumn('Projects', 'driveUrl', { type: DataTypes.STRING, allowNull: true });
        }
        if (!projectTable.includeComputing) {
          await queryInterface.addColumn('Projects', 'includeComputing', { type: DataTypes.BOOLEAN, defaultValue: false });
        }
        if (!projectTable.computingLine) {
          await queryInterface.addColumn('Projects', 'computingLine', { type: DataTypes.STRING, allowNull: true });
        }
        if (!projectTable.computingPicUrl) {
          await queryInterface.addColumn('Projects', 'computingPicUrl', { type: DataTypes.STRING, allowNull: true });
        }
      } catch (err) {
        console.log('Projects table check/migration skipped or projects table not initialized yet:', err.message);
      }
    }
  })
  .then(() => console.log('All models synchronized successfully.'))
  .catch(err => console.error('Database connection error:', err));

// Cron job to automatically delete rejected projects older than 30 days
// Runs every day at midnight
cron.schedule('0 0 * * *', async () => {
  console.log('Running cron job to delete old rejected projects...');
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  try {
    const deletedCount = await Project.destroy({
      where: {
        status: 'Rejected',
        rejectedAt: { [Op.lt]: thirtyDaysAgo }
      }
    });
    console.log(`Deleted ${deletedCount} old rejected projects.`);
  } catch (error) {
    console.error('Error running cron job:', error);
  }
});

// Mount endpoints
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/projects/:projectId/reviews', reviewRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/help', helpRoutes);

app.post('/api/upload', async (req, res) => {
  try {
    const { filename, fileData } = req.body;
    if (!filename || !fileData) {
      return res.status(400).json({ error: 'Missing filename or fileData' });
    }

    const matches = fileData.match(/^data:(.+);base64,(.+)$/);
    if (!matches) {
      return res.status(400).json({ error: 'Invalid base64 data format' });
    }

    const ext = filename.split('.').pop();
    const uniqueFilename = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;
    const buffer = Buffer.from(matches[2], 'base64');

    const filePath = path.join(uploadsDir, uniqueFilename);
    fs.writeFileSync(filePath, buffer);

    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${uniqueFilename}`;
    res.json({ url: fileUrl });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/', (req, res) => {
  res.json({ message: "Welcome to Sansah Innovations IoT Portal API" });
}); // Revert email verification comment

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
