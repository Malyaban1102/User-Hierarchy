const { DataTypes } = require('sequelize');
module.exports = (sequelize) => sequelize.define('User', {
  id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
  email: { type: DataTypes.STRING(255), unique: true, allowNull: false },
  password_hash: { type: DataTypes.STRING(255), allowNull: false },
  role_id: { type: DataTypes.INTEGER, allowNull: false },
  customer_id: { type: DataTypes.BIGINT, allowNull: true }
}, { tableName: 'users', timestamps: false });
