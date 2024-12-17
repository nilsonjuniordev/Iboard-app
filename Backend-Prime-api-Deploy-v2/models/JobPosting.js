import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js'; // Ajuste o caminho conforme necessário

const JobPosting = sequelize.define('JobPosting', {
  cargo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  empresa: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  tipoLocal: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  localidade: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  tipoVaga: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  descricao: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  responsabilidades: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  qualificacoes: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  id_cnpj: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  likes: { // Alinhando com a nomenclatura usada nas rotas
    type: DataTypes.JSON,
    defaultValue: [],
  },
  dislikes: { // Alinhando com a nomenclatura usada nas rotas
    type: DataTypes.JSON,
    defaultValue: [],
  },
});

export default JobPosting;
