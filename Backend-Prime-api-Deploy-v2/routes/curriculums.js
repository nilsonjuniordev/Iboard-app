// routes/curriculums.js
import express from 'express';
import { Curriculum, FormacaoAcademica, ExperienciaProfissional, Idioma } from '../models/Curriculums.js'
const router = express.Router();



// Criação de Currículo
router.post('/', async (req, res) => {
  try {
    const {
       nome, fone, email, cpf, data_nascimento, rua, civil, genero, resumoProfissional,  userId,
      FormacaoAcademicas, ExperienciasProfissionais, Idiomas
    } = req.body;

    const novoCurriculo = await Curriculum.create({
      nome,
      fone,
      email,
      cpf,
      data_nascimento,
      rua,
      civil,
      genero,
      resumoProfissional,
      userId
    });

    if (FormacaoAcademicas && FormacaoAcademicas.length > 0) {
      await Promise.all(FormacaoAcademicas.map(async (formacao) => {
        await FormacaoAcademica.create({ ...formacao, curriculumId: novoCurriculo.id });
      }));
    }

    if (ExperienciasProfissionais && ExperienciasProfissionais.length > 0) {
      await Promise.all(ExperienciasProfissionais.map(async (experiencia) => {
        await ExperienciaProfissional.create({ ...experiencia, curriculumId: novoCurriculo.id });
      }));
    }

    if (Idiomas && Idiomas.length > 0) { // Certifique-se de que `Idiomas` está correto
      await Promise.all(Idiomas.map(async (idioma) => {
        await Idioma.create({ ...idioma, curriculumId: novoCurriculo.id });
      }));
    }

    res.status(201).json({ message: 'Currículo criado com sucesso!', curriculum: novoCurriculo });
  } catch (error) {
    console.error('Erro ao criar o currículo:', error);
    res.status(500).json({ message: 'Erro ao criar o currículo', error });
  }
});
  

// Listar todos os currículos
router.get('/', async (req, res) => {
  try {
    const curriculums = await Curriculum.findAll({
      include: [
        { model: FormacaoAcademica, as: 'FormacaoAcademicas' },
        { model: ExperienciaProfissional, as: 'ExperienciasProfissionais' },
        { model: Idioma, as: 'Idiomas' }
      ]
    });
    res.status(200).json(curriculums);
  } catch (error) {
    console.error('Erro ao listar currículos:', error);
    res.status(500).json({ message: 'Erro ao listar currículos', error });
  }
});

// Listar currículo específico por userId
router.get('/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const curriculum = await Curriculum.findOne({
      where: { userId: userId },
      include: [
        { model: FormacaoAcademica, as: 'FormacaoAcademicas' },
        { model: ExperienciaProfissional, as: 'ExperienciasProfissionais' },
        { model: Idioma, as: 'Idiomas' }
      ]
    });

    if (curriculum) {
      res.status(200).json(curriculum);
    } else {
      res.status(404).json({ message: 'Currículo não encontrado' });
    }
  } catch (error) {
    console.error('Erro ao buscar currículo:', error);
    res.status(500).json({ message: 'Erro ao buscar currículo', error });
  }
});



// Exemplo de busca de currículo com associações
router.get('/id/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const curriculo = await Curriculum.findOne({
      where: { id },
      include: [
        { model: FormacaoAcademica, as: 'FormacaoAcademicas' },
        { model: ExperienciaProfissional, as: 'ExperienciasProfissionais' },
        { model: Idioma, as: 'Idiomas' }
      ]
    });

    if (!curriculo) {
      return res.status(404).json({ message: 'Currículo não encontrado' });
    }

    res.status(200).json(curriculo);
  } catch (error) {
    console.error('Erro ao buscar o currículo:', error);
    res.status(500).json({ message: 'Erro ao buscar o currículo', error });
  }
});

router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const curriculo = await Curriculum.findOne({
      where: { userId },
      include: [
        { model: FormacaoAcademica, as: 'FormacaoAcademicas' },
        { model: ExperienciaProfissional, as: 'ExperienciasProfissionais' },
        { model: Idioma, as: 'Idiomas' }
      ]
    });

    if (!curriculo) {
      return res.status(404).json({ message: 'Currículo não encontrado' });
    }

    res.status(200).json(curriculo);
  } catch (error) {
    console.error('Erro ao buscar o currículo:', error);
    res.status(500).json({ message: 'Erro ao buscar o currículo', error });
  }
});




// Atualizar um currículo
router.put('/id/:id', async (req, res) => {
  const { id } = req.params;
  const {
    nome, fone, email, cpf, data_nascimento, rua, civil, genero, resumoProfissional,
    formacaoAcademica = [], experienciasProfissionais = [], idiomas = []
  } = req.body;

  try {
    console.log('Updating curriculum with ID:', id);
    console.log('Request Body:', req.body);

    // Encontra o currículo existente
    const curriculum = await Curriculum.findByPk(id);
    if (!curriculum) {
      console.error('Currículo não encontrado');
      return res.status(404).json({ error: 'Currículo não encontrado' });
    }

    // Atualiza o currículo
    await curriculum.update({
      nome, fone, email, cpf, data_nascimento, rua, civil, genero, resumoProfissional,
    });

    // Atualiza formacaoAcademica, experienciasProfissionais e idiomas
    await Promise.all([
      Promise.all(formacaoAcademica.map(async (formacao) => {
        console.log('Updating academic background:', { ...formacao, curriculumId: id });
        await FormacaoAcademica.upsert({ ...formacao, curriculumId: id });
      })),
      Promise.all(experienciasProfissionais.map(async (experiencia) => {
        console.log('Updating professional experience:', { ...experiencia, curriculumId: id });
        await ExperienciasProfissionais.upsert({ ...experiencia, curriculumId: id });
      })),
      Promise.all(idiomas.map(async (idioma) => {
        console.log('Updating language:', { ...idioma, curriculumId: id });
        await Idiomas.upsert({ ...idioma, curriculumId: id });
      })),
    ]);

    res.status(200).json(curriculum);
  } catch (error) {
    console.error('Erro ao atualizar o currículo:', error);
    res.status(500).json({ error: 'Erro ao atualizar o currículo' });
  }
});



// Deletar um currículo
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // Encontra o currículo existente
    const curriculum = await Curriculum.findByPk(id);
    if (!curriculum) {
      return res.status(404).json({ error: 'Currículo não encontrado' });
    }

    // Remove o currículo e suas associações
    await Promise.all([
      FormacaoAcademica.destroy({ where: { curriculumId: id } }),
      ExperienciasProfissionais.destroy({ where: { curriculumId: id } }),
      Idiomas.destroy({ where: { curriculumId: id } }),
    ]);

    await curriculum.destroy();

    res.status(204).send(); // No content
  } catch (error) {
    console.error('Erro ao deletar o currículo', error);
    res.status(500).json({ error: 'Erro ao deletar o currículo' });
  }
});


export default router;
