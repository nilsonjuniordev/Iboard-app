// models/SurveyResponse.js

import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js'; 

const SurveyResponse = sequelize.define('SurveyResponse', {
  surveyId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  questionIndex: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  answer: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
});

export default SurveyResponse;
