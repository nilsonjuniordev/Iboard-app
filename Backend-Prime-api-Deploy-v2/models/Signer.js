// models/Signer.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import Contract from './Contract.js';

const Signer = sequelize.define('Signer', {
  name: DataTypes.STRING,
  email: DataTypes.STRING,
  cpf: DataTypes.STRING, 
  ip: DataTypes.STRING,
  signed: DataTypes.BOOLEAN,
});

Contract.hasMany(Signer, { as: 'signers' });
Signer.belongsTo(Contract);

export default Signer;