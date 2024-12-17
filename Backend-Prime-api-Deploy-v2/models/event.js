import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Event = sequelize.define('Event', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    note: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    eventTime: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    dateKey: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    idCnpj: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    viewedBy: {
      type: DataTypes.JSON, 
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    }
  });
  
export default Event;
