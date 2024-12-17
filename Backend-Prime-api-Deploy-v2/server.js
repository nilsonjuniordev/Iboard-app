import express from "express";
import multer from "multer";
import fs from "fs"; 
import userRoutes from "./routes/users.js";
import cors from "cors";
import nodemailer from 'nodemailer';
import jwt from "jsonwebtoken";
import { db } from "./db.js";
import path from "path";
import moment from 'moment';
import sequelize from './config/database.js';
import Survey from './models/Survey.js';
import SurveyResponse from './models/SurveyResponse.js';
import Question from './models/Question.js';
import UniformEpi from './models/UniformEpi.js';
import UniformEpiResponse from './models/UniformEpiResponse.js';
import curriculums from './routes/curriculums.js'
import jobPostingRoutes from './routes/jobPostingRoutes.js';
import events from './routes/events.js';
import contractRoutes from './routes/contracts.js';
const __filename = new URL(import.meta.url).pathname;
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Adiciona este middleware

app.use(cors());


const PORT = process.env.PORT || 8800;

// Sincronização do Sequelize para criar as tabelas no banco de dados
sequelize.sync()
  .then(() => {
    console.log('sincronizar o banco de dados');
    
    // Inicie o servidor Express após a sincronização
    app.listen(PORT, () => {
      console.log(`Servidor está escutando na porta ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Erro ao sincronizar tabelas:', err);
  });


  const syncDatabase = async () => {
    try {
      await sequelize.sync({ force: false }); // Ou use { alter: true } para ajustar a estrutura existente
      console.log('Banco de dados sincronizado com sucesso!');
    } catch (error) {
      console.error('Erro ao sincronizar o banco de dados:', error);
    }
  };
  
  syncDatabase();


// Serve arquivos estáticos da pasta 'uploads'
app.use('/ContractsUploads', express.static(path.join(__dirname, 'uploads')));

   // Usar as rotas de contratos
   app.use('/contracts', contractRoutes);

  
// rotas para eventos
  app.use('/event', events);


// rotas para vagas
  app.use('/jobs', jobPostingRoutes);

// rotas para  curriculum
app.use('/curriculums',  curriculums);


 


// Rotas de pesquisa de clima organizacional
app.post('/surveys', async (req, res) => {
  const { title, questions, id_cnpj } = req.body;
  try {
    const newSurvey = await Survey.create(
      { title, id_cnpj, questions },
      {
        include: [{ model: Question, as: 'questions' }],
      }
    );
    res.status(201).json(newSurvey);
  } catch (error) {
    console.error('Erro ao criar a pesquisa', error);
    res.status(500).json({ error: 'Erro ao criar a pesquisa' });
  }
});


app.get('/surveys', async (req, res) => {
  try {
    const surveys = await Survey.findAll({ include: [{ model: Question, as: 'questions' }] });
    res.status(200).json(surveys);
  } catch (error) {
    console.error('Erro ao buscar pesquisas', error);
    res.status(500).json({ error: 'Erro ao buscar pesquisas' });
  }
});

// Rota para salvar as respostas da pesquisa
app.post('/surveys/response', async (req, res) => {
  const { surveyId, userId, questionIndex, answer } = req.body;

  try {
    // Criar um registro de resposta da pesquisa
    const newResponse = await SurveyResponse.create({
      surveyId,
      userId,
      questionIndex,
      answer,
    });

    res.status(201).json(newResponse);
  } catch (error) {
    console.error('Erro ao salvar resposta da pesquisa', error);
    res.status(500).json({ error: 'Erro ao salvar resposta da pesquisa' });
  }
});

// Rota para buscar todas as respostas de uma pesquisa específica
app.get('/surveys/:surveyId/responses', async (req, res) => {
  const { surveyId } = req.params;

  try {
    const responses = await SurveyResponse.findAll({ where: { surveyId } });
    res.status(200).json(responses);
  } catch (error) {
    console.error('Erro ao buscar respostas da pesquisa', error);
    res.status(500).json({ error: 'Erro ao buscar respostas da pesquisa' });
  }
});


// Rota para deletar uma pesquisa
app.delete('/surveys/:surveyId', async (req, res) => {
  const { surveyId } = req.params;
  try {
    const survey = await Survey.findByPk(surveyId);
    if (survey) {
      await survey.destroy();
      res.status(200).json({ message: 'Pesquisa deletada com sucesso' });
    } else {
      res.status(404).json({ error: 'Pesquisa não encontrada' });
    }
  } catch (error) {
    console.error('Erro ao deletar a pesquisa', error);
    res.status(500).json({ error: 'Erro ao deletar a pesquisa' });
  }
});

// Rota para atualizar uma pesquisa
app.put('/surveys/:surveyId', async (req, res) => {
  const { surveyId } = req.params;
  const { title, questions } = req.body;
  try {
    const survey = await Survey.findByPk(surveyId);
    if (survey) {
      survey.title = title;
      await survey.save();
      // Atualizar questões associadas
      await Question.destroy({ where: { SurveyId: surveyId } });
      const updatedQuestions = await Question.bulkCreate(
        questions.map(q => ({ ...q, SurveyId: surveyId }))
      );
      res.status(200).json({ ...survey.toJSON(), questions: updatedQuestions });
    } else {
      res.status(404).json({ error: 'Pesquisa não encontrada' });
    }
  } catch (error) {
    console.error('Erro ao atualizar a pesquisa', error);
    res.status(500).json({ error: 'Erro ao atualizar a pesquisa' });
  }
});


// Rotas de uniformes e EPIs
app.post('/uniforms-epi', async (req, res) => {
  const { name, type, availableSizes, id_cnpj } = req.body;
  try {
    const newUniformEpi = await UniformEpi.create({ name, type, availableSizes, id_cnpj });
    res.status(201).json(newUniformEpi);
  } catch (error) {
    console.error('Erro ao cadastrar uniforme/EPI', error);
    res.status(500).json({ error: 'Erro ao cadastrar uniforme/EPI' });
  }
});

// Rotas de uniformes e EPIs
app.get('/uniforms-epi', async (req, res) => {
  try {
    const uniformsEpi = await UniformEpi.findAll();
    res.status(200).json(uniformsEpi);
  } catch (error) {
    console.error('Erro ao buscar uniformes/EPIs', error);
    res.status(500).json({ error: 'Erro ao buscar uniformes/EPIs' });
  }
});



// Rota para buscar todas as respostas
app.get('/uniforms-epi/responses', async (req, res) => {
  try {
    // Busca todas as respostas no banco de dados
    const responses = await UniformEpiResponse.findAll();

    // Retorna as respostas encontradas com status 200 (OK)
    res.status(200).json(responses);
  } catch (error) {
    // Captura e loga qualquer erro ocorrido durante o processo
    console.error('Erro ao buscar respostas', error);
    res.status(500).json({ error: 'Erro ao buscar respostas' });
  }
});

app.post('/uniforms-epi/responses', async (req, res) => {
  const { uniformEpiId, size, userId } = req.body;

  try {
    console.log('Dados recebidos:', { uniformEpiId, size, userId }); // Verifica os dados recebidos

    // Cria a nova resposta no banco de dados
    const newResponse = await UniformEpiResponse.create({ uniformEpiId, size, userId });

    // Retorna a resposta com status 201 (Created)
    res.status(201).json(newResponse);
  } catch (error) {
    // Captura e loga qualquer erro ocorrido durante o processo
    console.error('Erro ao enviar resposta', error);
    res.status(500).json({ error: 'Erro ao enviar resposta' });
  }
});




// Endpoint para deletar todos os caminhos associados ao campo uploadsPath
app.delete("/uploads/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    console.log("DELETE Rota Acessada");
    console.log("UserID:", userId);

    if (!userId) {
      return res.status(400).json({ error: "Parâmetros inválidos" });
    }

    // Atualiza o banco de dados com uploadsPath como NULL
    const updateUserUploadPath = "UPDATE user SET uploadsPath = NULL WHERE iduser = ?";
    await db.query(updateUserUploadPath, [userId]);

    // Retorne uma resposta de sucesso
    res.status(200).json({ success: "Caminhos das imagens removidos com sucesso" });
    console.log("Caminhos das imagens removidos com sucesso");
  } catch (error) {
    console.error("Erro ao remover caminhos das imagens:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});


// Endpoint para deletar todos os caminhos associados ao campo uploadsPathAso
app.delete("/uploadsAso/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    console.log("DELETE Rota Acessada");
    console.log("UserID:", userId);

    if (!userId) {
      return res.status(400).json({ error: "Parâmetros inválidos" });
    }

    // Atualiza o banco de dados com uploadsPathAso como NULL
    const updateUserUploadPathAso = "UPDATE user SET uploadsPathAso = NULL WHERE iduser = ?";
    await db.query(updateUserUploadPathAso, [userId]);

    // Retorne uma resposta de sucesso
    res.status(200).json({ success: "Exames excluídos com sucesso!" });
    console.log("Caminhos das imagens removidos com sucesso");
  } catch (error) {
    console.error("Erro ao excluir exames:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

  // endpoint visualizar upload de arquivos...
app.get('/uploads/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;

    // Consulta o banco de dados para obter o caminho do diretório
    const user = await getUserById(userId);

    if (!user || !user.uploadsPath) {
      return res.status(404).json({ error: 'Nenhuma imagem encontrada para o usuário' });
    }

    const userUploadsDir = path.join(__dirname, user.uploadsPath);

  
  } catch (error) {
    console.error('Erro ao obter imagens do usuário:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

app.use('/uploads', express.static('uploads'));


// Configuração do multer para upload de arquivos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const userId = req.headers.userid;

    if (!userId) {
      return cb(new Error('UserId não fornecido'));
    }

    const userUploadsDir = `uploads/${userId}`;

    // Cria o diretório se não existir
    if (!fs.existsSync(userUploadsDir)) {
      fs.mkdirSync(userUploadsDir, { recursive: true });
    }

    cb(null, userUploadsDir);
  },
  filename: function (req, file, cb) {
    const userId = req.headers.userid;

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
const upload = multer({ storage: storage });

// Rota de upload
app.post('/uploads', upload.array('files', 10), async (req, res) => {
  try {
    const userId = req.body.userId;
    const files = req.files;

    if (!userId) {
      return res.status(400).json({ error: 'UserId não fornecido' });
    }

    if (!files || files.length === 0) {
      return res.status(400).json({ error: 'Arquivos não enviados' });
    }

    console.log(`Arquivos recebidos para o usuário ${userId}`);

    // Verifica se files está definido antes de chamar map
    const uploadPaths = files ? files.map(file => file.path) : [];

    console.log('userId:', userId);
    console.log('uploadPaths:', uploadPaths);

    const formattedUploadPaths = uploadPaths.map(path => path.replace(/\\/g, '/')).join(', ');
    const updateUserUploadPath = `UPDATE user SET uploadsPath = IFNULL(CONCAT_WS(', ', uploadsPath, ?), ?) WHERE iduser = ?`;
    await db.query(updateUserUploadPath, [formattedUploadPaths, formattedUploadPaths, userId]);

    res.status(200).json({ success: 'Arquivos recebidos com sucesso' });
  } catch (error) {
    console.error('Erro durante o processamento dos uploads:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});





// Configure o middleware de upload do multer para o campo uploadsPathAso
const uploadAso = multer({ 
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      const userId = req.headers.userid;

      if (!userId) {
        return cb(new Error('UserId não fornecido'));
      }

      const userUploadsDir = `uploads/aso/${userId}`;

      // Cria o diretório se não existir
      if (!fs.existsSync(userUploadsDir)) {
        fs.mkdirSync(userUploadsDir, { recursive: true });
      }

      cb(null, userUploadsDir);
    },
    filename: function (req, file, cb) {
      const userId = req.headers.userid;

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
  }) 
  
});

// Rota de upload para uploadsPathAso
app.post('/uploads/aso', uploadAso.array('files', 10), async (req, res) => {
  try {
    const userId = req.body.userId;
    const files = req.files;

    if (!userId) {
      return res.status(400).json({ error: 'UserId não fornecido' });
    }

    if (!files || files.length === 0) {
      return res.status(400).json({ error: 'Arquivos não enviados' });
    }

    console.log(`Arquivos recebidos para o usuário ${userId}`);

    // Verifica se files está definido antes de chamar map
    const uploadPaths = files ? files.map(file => file.path) : [];

    console.log('userId:', userId);
    console.log('uploadPathsAso:', uploadPaths);

    const formattedUploadPaths = uploadPaths.map(path => path.replace(/\\/g, '/')).join(', ');
    const updateUserUploadPathAso = `UPDATE user SET uploadsPathAso = IFNULL(CONCAT_WS(', ', uploadsPathAso, ?), ?) WHERE iduser = ?`;
    await db.query(updateUserUploadPathAso, [formattedUploadPaths, formattedUploadPaths, userId]);

    res.status(200).json({ success: 'Arquivos recebidos com sucesso' });
  } catch (error) {
    console.error('Erro durante o processamento dos uploads:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});





// Função para obter usuário pelo nome e CPF
async function getUserByNomeAndCPF(nome, cpf) {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM user WHERE nome = ? AND cpf = ?";
    console.log("Valores da consulta:", nome, cpf);
    db.query(sql, [nome, cpf], (err, result) => {
      if (err) {
        console.error("Erro na consulta SQL:", err);
        reject(err);
      } else {
        console.log("Resultado da consulta:", result);
        resolve(result[0]);
      }
    });
  });
}

app.post("/login", async (req, res) => {
  const { nome, cpf } = req.body;

  try {
    // Verifica se o usuário existe no banco de dados
    const user = await getUserByNomeAndCPF(nome, cpf);

    if (!user) {
      console.log("Usuário não autenticado");
      return res.status(401).json({ error: "Credenciais inválidas." });
    }

    // Gera um token JWT para o usuário autenticado
    const token = jwt.sign(
      { userId: user.iduser, nome: user.nome, cpf: user.cpf },
      process.env.JWT_SECRET || "seu_segredo",
      { expiresIn: "24h" }
    );

    console.log("Token gerado com sucesso:", token);

    // Retornar o token e o userId na resposta
    res.status(200).json({ token, userId: user.iduser });
  } catch (error) {
    console.error("Erro no login:", error);98
    res.status(500).json({ error: "Erro interno do servidor." });
  }
});


// Função para obter usuário pelo nome e CNPJ
async function getUserByNomeAndCNPJ(nome, pass) {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM user WHERE nome = ? AND pass = ?";
    db.query(sql, [nome, pass], (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result[0]); // Retorna o primeiro usuário encontrado
      }
    });
  });
}

// Rota para fazer login com nome e CNPJ
app.post("/logincnpj", async (req, res) => {
  const { nome, pass } = req.body;

  try {
    // Verifica se o usuário existe no banco de dados
    const user = await getUserByNomeAndCNPJ(nome, pass);

    if (!user) {
      return res.status(401).json({ error: "Credenciais inválidas." });
    }

    // Gera um token JWT específico para o usuário autenticado
    const token = generateRhToken(user.iduser); // Utiliza o ID do usuário para gerar o token específico

    // Retorna o token na resposta
    res.status(200).json({ token, userId: user.iduser });
  } catch (error) {
    console.error("Erro no login:", error);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
});




// Cadastrado de novos usuarios + token
const createUser = async (userData) => {
  // Obtém a data atual no fuso horário local formatada como YYYY-MM-DD HH:mm:ss
  const currentDateTime = moment().local().format('YYYY-MM-DD HH:mm:ss');

  // Adiciona a data e hora formatadas ao objeto userData
  userData.data = currentDateTime;

  return new Promise((resolve, reject) => {
    const sql = "INSERT INTO user SET ?";
    db.query(sql, userData, (err, result) => {
      if (err) {
        reject(err);
      } else {
        const userId = result.insertId;
        const newUser = { iduser: userId, ...userData };
        resolve(newUser);
      }
    });
  });
};

app.post("/Register", async (req, res) => {
  const userData = req.body;

  try {
    // Inserir novo usuário no banco de dados e atualizar uploadsPath
    const newUser = await createUser(userData);

    // Gera um token JWT para o usuário cadastrado
    const token = jwt.sign(
      { userId: newUser.iduser, nome: newUser.nome },
      process.env.JWT_SECRET || "seu_segredo",
      { expiresIn: "24h" }
    );

    console.log("Token gerado com sucesso:", token);

    // Inclui o ID do usuário na resposta JSON
    res.status(201).json({ token, message: "Usuário cadastrado com sucesso!", userId: newUser.iduser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao cadastrar usuário." });
  }
});

// Função para gerar token específico para cadastro de empresas
const generateRhToken = (userId) => {
  return jwt.sign(
    { userId, registerRh: true },
    process.env.JWT_SECRET || "seu_segredo",
    { expiresIn: "24h" }
  );
};

// Rota para registrar empresas

app.post("/RegisterRh", async (req, res) => {
  const userData = req.body;

  try {
    // Insere o usuário no banco de dados e obtém o novo ID gerado automaticamente
    const newUser = await createUser(userData);
    const userId = newUser.iduser; // Obtém o ID único do usuário

    // Monta o id_cnpj usando o nome da empresa e o ID do usuário
    const idCnpj = `${userData.nome.replace(/\s/g, '')}-${userId}`;

    // Gera um token JWT específico para este cadastro de empresa
    const token = generateRhToken(userId);

    // Inclui o ID da empresa e o token na resposta JSON
    res.status(201).json({ token, message: "Empresa cadastrada com sucesso!", userId, id_cnpj: idCnpj });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao cadastrar empresa." });
  }
});




// Rota para obter detalhes de um usuário

// Função para obter usuário pelo ID
async function getUserById(userId) {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM user WHERE iduser = ?";
    db.query(sql, [userId], (err, result) => {
      if (err) {
        console.error("Erro na consulta SQL:", err);
        reject(err);
      } else {
        console.log("Resultado da consulta:", result);

        // Verifique se o usuário foi encontrado
        if (result.length === 0) {
          resolve(null); // Retorna nulo se o usuário não for encontrado
        } else {
          resolve(result[0]); // Retorna os detalhes do usuário
        }
      }
    });
  });
}

app.get('/:iduser', async (req, res) => {
  try {
    const userId = req.params.iduser;

    //lógica para obter todos os detalhes do usuário com base no ID (use o seu banco de dados)
    const user = await getUserById(userId);

    // Verifique se o usuário foi encontrado
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    // Envie a resposta ao cliente com todos os detalhes do usuário
    res.status(200).json(user);
  } catch (error) {
    console.error('Erro ao obter detalhes do usuário:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Backend (Node.js) - Exemplo de rota para contar novos cadastros com filtros de data
app.get("/newRegistrations", async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    // Consulta SQL para contar novos cadastros baseados na data com filtros
    let query = "SELECT COUNT(*) AS count FROM user WHERE 1=1";
    const params = [];

    if (startDate) {
      query += " AND data >= ?";
      params.push(startDate);
    }

    if (endDate) {
      query += " AND data <= ?";
      params.push(endDate);
    }

    const result = await db.query(query, params);

    // Retorna o número de novos cadastros
    const count = result[0].count;
    res.status(200).json({ count });
  } catch (error) {
    console.error("Erro ao contar novos cadastros:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});


// Rota atualizar dados
app.put("/", (req, res) => {
  res.status(404).send("Recurso não encontrado");
});


// Rota para outros endpoints
app.use("/", userRoutes);
app.use(express.urlencoded({ extended: true })); // Adiciona este middleware



// Rota para envio de e-mail
app.post('/mail', async (req, res) => {
  try {
    const { to, subject, text } = req.body;

    // Configurações do serviço de e-mail (substitua com suas credenciais)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'primetxtrh@gmail.com', // Seu e-mail
        pass: 'gilp mkgs cmwe umzf' // Sua senha do e-mail
      }
    }); 

    // Opções do e-mail
    const mailOptions = {
      from: 'primetxtrh@gmail.com', // Seu e-mail
      to, // Destinatário do e-mail (pode ser um array para vários destinatários)
      subject, // Assunto do e-mail
      text // Corpo do e-mail
    };

    // Envio do e-mail
    await transporter.sendMail(mailOptions);

    // Resposta ao cliente
    res.status(200).json({ message: 'E-mail enviado com sucesso!' });
  } catch (error) {
    console.error('Erro ao enviar e-mail:', error);
    res.status(500).json({ error: 'Erro ao enviar e-mail. Verifique o console para mais detalhes.' });
  }
});


