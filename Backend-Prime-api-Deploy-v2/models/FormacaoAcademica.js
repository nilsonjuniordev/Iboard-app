// models/FormacaoAcademica.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const FormacaoAcademica = sequelize.define('FormacaoAcademica', {
  instituicao: { type: DataTypes.STRING, allowNull: false },
  localidade: { type: DataTypes.STRING, allowNull: false },
  curso: { type: DataTypes.STRING, allowNull: false },
  nivel: { type: DataTypes.STRING, allowNull: false },
  dataInicio: { type: DataTypes.STRING, allowNull: false },
  dataFim: { type: DataTypes.STRING, allowNull: false },
  curriculumId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Curriculums', // Nome da tabela no banco de dados
      key: 'id'
    }
  }
}, {});

export default FormacaoAcademica;
