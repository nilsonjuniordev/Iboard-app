// routes/jobPostingRoutes.js
import express from 'express';
import { Op, Sequelize } from 'sequelize'; // Importe tanto Op quanto Sequelize
import JobPosting from '../models/JobPosting.js';
import sequelize from '../config/database.js'; // Corrija o caminho do seu arquivo de configuração

const router = express.Router();

// Rota para criar uma nova postagem de vaga
router.post('/job-postings', async (req, res) => {
  try {
    const {
      cargo,
      empresa,
      tipoLocal,
      localidade,
      tipoVaga,
      descricao,
      responsabilidades,
      qualificacoes,
      id_cnpj,
    } = req.body;

    const newJobPosting = await JobPosting.create({
      cargo,
      empresa,
      tipoLocal,
      localidade,
      tipoVaga,
      descricao,
      responsabilidades,
      qualificacoes,
      id_cnpj,
      likes: [], // Inicialmente vazio
      dislikes: [], // Inicialmente vazio
    });

    res.status(201).json(newJobPosting);
  } catch (error) {
    console.error('Erro ao criar postagem de vaga:', error);
    res.status(500).json({ message: 'Erro ao criar a postagem de vaga' });
  }
});

// PUT para adicionar um like e remover o dislike, se existir
router.put('/job-postings/:id/like', async (req, res) => {
  try {
    const { userId } = req.body;
    const jobPosting = await JobPosting.findByPk(req.params.id);

    if (!jobPosting) {
      return res.status(404).json({ message: 'Vaga não encontrada' });
    }

    // Verifica se o userId já existe em dislikes e o remove se existir
    const dislikesIndex = jobPosting.dislikes.indexOf(userId);
    if (dislikesIndex > -1) {
      jobPosting.dislikes.splice(dislikesIndex, 1);
      jobPosting.changed('dislikes', true); // Marcar como alterado
    }

    // Adiciona o userId ao array de likes se ainda não estiver lá
    if (!jobPosting.likes.includes(userId)) {
      jobPosting.likes.push(userId);
      jobPosting.changed('likes', true); // Marcar como alterado
      await jobPosting.save(); // Salva as alterações
    }

    res.json(jobPosting);
  } catch (error) {
    console.error('Erro ao processar like:', error);
    res.status(500).json({ message: 'Erro ao processar like' });
  }
});

// PUT para adicionar um dislike e remover o like, se existir
router.put('/job-postings/:id/dislike', async (req, res) => {
  try {
    const { userId } = req.body;
    const jobPosting = await JobPosting.findByPk(req.params.id);

    if (!jobPosting) {
      return res.status(404).json({ message: 'Vaga não encontrada' });
    }

    // Verifica se o userId já existe em likes e o remove se existir
    const likesIndex = jobPosting.likes.indexOf(userId);
    if (likesIndex > -1) {
      jobPosting.likes.splice(likesIndex, 1);
      jobPosting.changed('likes', true); // Marcar como alterado
    }

    // Adiciona o userId ao array de dislikes se ainda não estiver lá
    if (!jobPosting.dislikes.includes(userId)) {
      jobPosting.dislikes.push(userId);
      jobPosting.changed('dislikes', true); // Marcar como alterado
      await jobPosting.save(); // Salva as alterações
    }

    res.json(jobPosting);
  } catch (error) {
    console.error('Erro ao processar dislike:', error);
    res.status(500).json({ message: 'Erro ao processar dislike' });
  }
});

// Rota para buscar as vagas curtidas pelo usuário
router.get('/job-postings/liked', async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ message: 'userId é necessário' });
    }

    // Verificar se userId está no array JSON de likes
    const likedJobPostings = await JobPosting.findAll({
      where: sequelize.literal(`JSON_CONTAINS(likes, '["${userId}"]')`), // Use sequelize.literal
    });

    res.json(likedJobPostings);
  } catch (error) {
    console.error('Erro ao buscar vagas curtidas:', error);
    res.status(500).json({ message: 'Erro ao buscar vagas curtidas' });
  }
});

// Rota para buscar as vagas dispensadas pelo usuário
router.get('/job-postings/disliked', async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ message: 'userId é necessário' });
    }

    // Verificar se userId está no array JSON de dislikes
    const dislikedJobPostings = await JobPosting.findAll({
      where: sequelize.literal(`JSON_CONTAINS(dislikes, '["${userId}"]')`), // Use sequelize.literal
    });

    res.json(dislikedJobPostings);
  } catch (error) {
    console.error('Erro ao buscar vagas dispensadas:', error);
    res.status(500).json({ message: 'Erro ao buscar vagas dispensadas' });
  }
});

// Rota para obter todas as vagas
router.get('/job-postings', async (req, res) => {
  try {
    const jobPostings = await JobPosting.findAll();
    res.status(200).json(jobPostings);
  } catch (error) {
    console.error('Erro ao obter vagas:', error);
    res.status(500).json({ message: 'Erro ao obter as vagas' });
  }
});

// Rota para obter uma vaga específica pelo id
router.get('/job-postings/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const jobPosting = await JobPosting.findByPk(id);

    if (!jobPosting) {
      return res.status(404).json({ message: 'Vaga não encontrada' });
    }

    res.status(200).json(jobPosting);
  } catch (error) {
    console.error('Erro ao obter a vaga:', error);
    res.status(500).json({ message: 'Erro ao obter a vaga' });
  }
});

export default router;
