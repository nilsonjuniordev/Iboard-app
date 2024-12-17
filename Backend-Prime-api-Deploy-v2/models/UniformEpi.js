// models/UniformEpi.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const UniformEpi = sequelize.define('UniformEpi', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  availableSizes: {
    type: DataTypes.JSON,
    allowNull: false,
  },

  id_cnpj: {
    type: DataTypes.STRING,
    allowNull: false,
  },

});

export default UniformEpi;
