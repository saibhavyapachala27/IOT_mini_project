import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM('Admin', 'Member'),
    defaultValue: 'Member',
  },
  department: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  profilePicture: {
    type: DataTypes.STRING,
    defaultValue: '',
  },
  isVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  verificationToken: {
    type: DataTypes.STRING,
    allowNull: true
  },
  verificationTokenExpiry: {
    type: DataTypes.DATE,
    allowNull: true
  },
  verificationCode: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  resetCode: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  resetCodeExpires: {
    type: DataTypes.DATE,
    allowNull: true,
  }
}, {
  timestamps: true,
});

export default User;
