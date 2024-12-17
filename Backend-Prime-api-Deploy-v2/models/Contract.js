// models/Contract.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Contract = sequelize.define('Contract', {
  title: DataTypes.STRING,
  status: DataTypes.STRING,
  documentPath: DataTypes.STRING,
  userId: DataTypes.STRING, 
});

export default Contract;