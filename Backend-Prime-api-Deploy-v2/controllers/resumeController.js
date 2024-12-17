const db = require('../models');
const Resume = db.Resume;
const AcademicFormation = db.AcademicFormation;
const ProfessionalExperience = db.ProfessionalExperience;
const Language = db.Language;

exports.createResume = async (req, res) => {
    try {
        const newResume = await Resume.create(req.body, {
            include: [
                { model: AcademicFormation, as: 'formacaoAcademica' },
                { model: ProfessionalExperience, as: 'experienciasProfissionais' },
                { model: Language, as: 'idiomas' }
            ]
        });
        res.status(201).send(newResume);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

exports.getResume = async (req, res) => {
    try {
        const userId = req.params.userId;
        const resume = await Resume.findByPk(userId, {
            include: [
                { model: AcademicFormation, as: 'formacaoAcademica' },
                { model: ProfessionalExperience, as: 'experienciasProfissionais' },
                { model: Language, as: 'idiomas' }
            ]
        });
        if (resume) {
            res.status(200).send(resume);
        } else {
            res.status(404).send({ message: "Currículo não encontrado" });
        }
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};
