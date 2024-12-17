// models/Curriculum.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Curriculum = sequelize.define('Curriculum', {
  nome: { type: DataTypes.STRING, allowNull: false },
  fone: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false },
  cpf: { type: DataTypes.STRING, allowNull: false },
  data_nascimento: { type: DataTypes.STRING, allowNull: false },
  rua: { type: DataTypes.STRING, allowNull: false },
  civil: { type: DataTypes.STRING, allowNull: false },
  genero: { type: DataTypes.STRING, allowNull: false },
  resumoProfissional: { type: DataTypes.TEXT, allowNull: true },
  userId: { type: DataTypes.TEXT, allowNull: true },
}, {});

export default Curriculum;
