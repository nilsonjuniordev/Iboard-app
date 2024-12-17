// models/Idioma.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Idioma = sequelize.define('Idioma', {
  idioma: { type: DataTypes.STRING, allowNull: false },
  nivel: { type: DataTypes.STRING, allowNull: false },
  curriculumId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Curriculums', // Nome da tabela no banco de dados
      key: 'id'
    }
  }
}, {});

export default Idioma;
