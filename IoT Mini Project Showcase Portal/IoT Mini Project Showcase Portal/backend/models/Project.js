import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Project = sequelize.define('Project', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  studentId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  studentName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  teamMembers: {
    type: DataTypes.STRING,
  },
  department: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  tags: {
    type: DataTypes.JSON, // MySQL supports JSON
    defaultValue: [],
  },
  components: {
    type: DataTypes.JSON,
    defaultValue: [],
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  photoUrl: {
    type: DataTypes.STRING,
  },
  videoUrl: {
    type: DataTypes.STRING,
  },
  githubUrl: {
    type: DataTypes.STRING,
  },
  pdfUrl: {
    type: DataTypes.STRING,
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('Pending', 'Under Review', 'Approved', 'Rejected'),
    defaultValue: 'Pending',
  },
  rejectionReason: {
    type: DataTypes.TEXT,
  },
  rejectedAt: {
    type: DataTypes.DATE,
  },
  includeFile: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  fileUrl: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  includeCode: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  codeFileUrl: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  codeContent: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  includeSimulation: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  simulationUrl: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  includeVideo: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  includeDrive: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  driveUrl: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  includeComputing: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  computingLine: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  computingPicUrl: {
    type: DataTypes.STRING,
    allowNull: true,
  }
}, {
  timestamps: true,
});

export default Project;
