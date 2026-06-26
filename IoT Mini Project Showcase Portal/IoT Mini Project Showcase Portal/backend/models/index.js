import sequelize from '../config/db.js';

// Import Models
import User from './User.js';
import Project from './Project.js';
import HelpRequest from './HelpRequest.js';

import Review from './Review.js';

// Setup Associations
// User has many Projects
User.hasMany(Project, { foreignKey: 'studentId' });
Project.belongsTo(User, { foreignKey: 'studentId' });

// User has many HelpRequests
User.hasMany(HelpRequest, { foreignKey: 'studentId' });
HelpRequest.belongsTo(User, { foreignKey: 'studentId' });

// Project has many Reviews
Project.hasMany(Review, { foreignKey: 'projectId' });
Review.belongsTo(Project, { foreignKey: 'projectId' });

// User has many Reviews
User.hasMany(Review, { foreignKey: 'studentId' });
Review.belongsTo(User, { foreignKey: 'studentId' });

export { sequelize, User, Project, HelpRequest, Review };
