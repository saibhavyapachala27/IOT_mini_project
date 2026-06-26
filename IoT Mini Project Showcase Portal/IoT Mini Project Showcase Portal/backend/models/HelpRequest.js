import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const HelpRequest = sequelize.define('HelpRequest', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  studentId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  subject: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('Open', 'Closed'),
    defaultValue: 'Open',
  }
}, {
  timestamps: true,
});

export default HelpRequest;
