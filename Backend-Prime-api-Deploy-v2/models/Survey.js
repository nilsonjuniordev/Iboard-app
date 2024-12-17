// models/Survey.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import Question from './Question.js';

const Survey = sequelize.define('Survey', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  id_cnpj: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

Survey.hasMany(Question, { as: 'questions', onDelete: 'CASCADE' });
Question.belongsTo(Survey);

export default Survey;
