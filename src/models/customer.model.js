const { DataTypes } = require('sequelize');
module.exports = (sequelize) => sequelize.define('Customer', {
  id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING(255), allowNull: false },
  parent_id: { type: DataTypes.BIGINT, allowNull: true }
}, { tableName: 'customers', timestamps: false });
