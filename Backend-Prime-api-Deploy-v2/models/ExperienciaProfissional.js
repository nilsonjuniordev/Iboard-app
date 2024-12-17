// models/ExperienciaProfissional.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const ExperienciaProfissional = sequelize.define('ExperienciaProfissional', {
  cargo: { type: DataTypes.STRING, allowNull: false },
  area: { type: DataTypes.STRING, allowNull: false },
  especializacao: { type: DataTypes.STRING, allowNull: false },
  descricao: { type: DataTypes.TEXT, allowNull: false },
  curriculumId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Curriculums', // Nome da tabela no banco de dados
      key: 'id'
    }
  }
}, {});

export default ExperienciaProfissional;
