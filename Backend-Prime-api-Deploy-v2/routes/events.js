import Event from '../models/event.js';
import express from 'express';
import { Op } from 'sequelize';

const router = express.Router();

// Criar um novo evento
router.post('/events', async (req, res) => {
  try {
    const { note, eventTime, dateKey, idCnpj } = req.body;

    console.log('Payload recebido:', { note, eventTime, dateKey, idCnpj });

    // Verificar se todos os campos obrigatórios estão presentes
    if (!note || !eventTime || !dateKey || !idCnpj) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }

    // Criar o evento
    const event = await Event.create({ note, eventTime, dateKey, idCnpj });
    res.status(201).json(event);
  } catch (error) {
    console.error('Erro ao salvar evento:', error);  // Log detalhado do erro
    res.status(500).json({ error: 'Erro interno no servidor' });
  }
});

  

// Obter eventos por mês
router.get('/events/:year/:month', async (req, res) => {
  try {
    const { year, month } = req.params;

    // Validar parâmetros
    if (isNaN(year) || isNaN(month)) {
      return res.status(400).json({ error: 'Ano e mês devem ser números válidos' });
    }

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    // Buscar eventos no intervalo de datas
    const events = await Event.findAll({
      where: {
        eventTime: {
          [Op.between]: [startDate, endDate],
        },
      },
    });
    res.status(200).json(events);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Registrar visualização de evento
router.post('/events/:id/view', async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    // Verificar se o userId está presente
    if (!userId) {
      return res.status(400).json({ error: 'userId é obrigatório' });
    }

    const event = await Event.findByPk(id);
    if (!event) {
      return res.status(404).json({ error: 'Evento não encontrado' });
    }

    const viewedBy = event.viewedBy || [];
    if (!viewedBy.includes(userId)) {
      viewedBy.push(userId);
      event.viewedBy = viewedBy;
      await event.save();
    }

    res.status(200).json(event);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Verificar se o evento foi visualizado por um usuário específico
router.get('/events/:id/viewed/:userId', async (req, res) => {
  try {
    const { id, userId } = req.params;

    // Verificar se userId está presente
    if (!userId) {
      return res.status(400).json({ error: 'userId é obrigatório' });
    }

    const event = await Event.findByPk(id);

    if (!event) {
      return res.status(404).json({ error: 'Evento não encontrado' });
    }

    const viewed = event.viewedBy.includes(userId);
    res.status(200).json({ viewed });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
