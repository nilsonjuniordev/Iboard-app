// models/Question.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Question = sequelize.define('Question', {
  questionText: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  answers: {
    type: DataTypes.JSON, // Store answers as JSON array
    allowNull: false,
  },
});

export default Question;
