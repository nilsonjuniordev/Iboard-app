import multer from 'multer';
import fs from 'fs';
import path from 'path';
import moment from 'moment';

// Configuração do multer para upload de arquivos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const userId = req.headers.userid; // Use req.headers para obter o userId

    if (!userId) {
      return cb(new Error('UserId não fornecido'));
    }

    const userUploadContract = `uploads/contratos${userId}`;

    // Cria o diretório se não existir
    if (!fs.existsSync(userUploadContract)) {
      fs.mkdirSync(userUploadContract, { recursive: true });
    }

    cb(null, userUploadContract);
  },
  filename: function (req, file, cb) {
    const userId = req.headers.userid; // Use req.headers para obter o userId

    if (!userId) {
      return cb(new Error('UserId não fornecido'));
    }

    // Formata a data e hora com moment.js
    const formattedTimestamp = moment().format('YYYYMMDD_HHmmss');

    // Obtém a extensão do arquivo
    const extension = path.extname(file.originalname);

    // Cria um identificador único
    const uniqueIdentifier = Math.random().toString(36).substring(2, 7); // Gerador de identificador único

    // Cria o novo nome do arquivo com o identificador único
    const newFilename = `${userId}_${formattedTimestamp}_${uniqueIdentifier}${extension}`;

    cb(null, newFilename);
  }
});

// Configure o middleware de upload do multer
const UploadContract = multer({ storage: storage });

export default UploadContract;