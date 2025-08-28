const sequelize = require('../config/db');
const Role = require('./role.model')(sequelize);
const Customer = require('./customer.model')(sequelize);
const User = require('./user.model')(sequelize);

// Associations
Role.hasMany(User, { foreignKey: 'role_id' });
User.belongsTo(Role, { foreignKey: 'role_id' });

Customer.hasMany(Customer, { as: 'children', foreignKey: 'parent_id' });
Customer.belongsTo(Customer, { as: 'parent', foreignKey: 'parent_id' });

Customer.hasMany(User, { foreignKey: 'customer_id' });
User.belongsTo(Customer, { foreignKey: 'customer_id' });

module.exports = { sequelize, Role, Customer, User };
