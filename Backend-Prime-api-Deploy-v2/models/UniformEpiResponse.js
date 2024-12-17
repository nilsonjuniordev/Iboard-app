// models/UniformEpiResponse.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const UniformEpiResponse = sequelize.define('UniformEpiResponse', {
  uniformEpiId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  size: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

export default UniformEpiResponse;
