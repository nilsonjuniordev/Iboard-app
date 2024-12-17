import express from 'express';
import Contract from '../models/Contract.js';
import Signer from '../models/Signer.js';
import nodemailer from 'nodemailer';
import UploadContract from '../middleware/uploadContract.js';
const router = express.Router();

router.post('/', (req, res, next) => {
  console.log('Campos recebidos:', req.body);
  console.log('Arquivos recebidos:', req.files);
  next();
}, UploadContract.single('file'), async (req, res) => {
  console.log('Headers da Requisição:', req.headers);
  console.log('Corpo da Requisição:', req.body);
  console.log('Arquivo da Requisição:', req.file);

  const { title, userId } = req.body;
  const signers = JSON.parse(req.body.signers);
  
  // Verifique se o arquivo foi recebido
  if (!req.file) {
    return res.status(400).json({ error: 'Arquivo não Recebido.' });
  }

  const documentPath = req.file.path;

  try {
    const contract = await Contract.create({ title, status: 'Pendente', documentPath, userId  });
    const signerInstances = await Signer.bulkCreate(signers.map(signer => ({
      name: signer.name,
      email: signer.email,
      cpf: signer.cpf, // Inclua o CPF ao criar o signer
      ContractId: contract.id
    })));

    // Enviar e-mails de notificação
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'primetxtrh@gmail.com',
        pass: 'gilp mkgs cmwe umzf',
      },
    });

    contract, signerInstances.forEach(signer => {
      const mailOptions = {
        from: 'Iboard-sistema@gmail.com',
        to: signer.email,
        subject:  `Novo contrato "${contract.title}" para assinar `,
        text: `Olá ${signer.name}, você tem um novo contrato para assinar.`,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
    });

    res.status(201).json({ message: 'Contrato criado com sucesso' });
  } catch (error) {
    console.error('Erro ao criar contrato:', error);
    res.status(500).json({ error: error.message });
  }
});

// Rota para listar todos os contratos
router.get('/', async (req, res) => {
  try {
    const contracts = await Contract.findAll({
      include: [{ model: Signer, as: 'signers' }],
    });
    res.status(200).json(contracts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.get('/:id', async (req, res) => {
  const { id } = req.params; // Obtém o ID do contrato da URL

  try {
    const contract = await Contract.findOne({
      where: { id },
      include: [{ model: Signer, as: 'signers' }], // Inclui os signers associados ao contrato
    });

    if (!contract) {
      return res.status(404).json({ error: 'Contrato não encontrado.' });
    }

    res.status(200).json(contract);
  } catch (error) {
    console.error('Erro ao buscar contrato:', error);
    res.status(500).json({ error: error.message });
  }
});


router.post('/:id/sign', async (req, res) => {
  const { name, email, cpf, ip } = req.body;
  const { id } = req.params;

  try {
    // Atualiza o status do contrato e registra o assinante
    await Signer.create({ name, email, cpf, ip, signed: true, ContractId: id });

    // Atualiza o status do contrato
    await Contract.update({ status: 'Assinado' }, { where: { id } });

    res.status(200).json({ message: 'Contrato assinado com sucesso' });
  } catch (error) {
    console.error('Erro ao assinar contrato:', error);
    res.status(500).json({ error: error.message });
  }
});



export default router;