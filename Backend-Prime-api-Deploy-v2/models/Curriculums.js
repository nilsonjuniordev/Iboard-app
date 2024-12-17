import sequelize from '../config/database.js';
import Curriculum from './Curriculum.js';
import FormacaoAcademica from './FormacaoAcademica.js';
import ExperienciaProfissional from './ExperienciaProfissional.js';
import Idioma from './Idioma.js';

// Definir associações
Curriculum.hasMany(FormacaoAcademica, { as: 'FormacaoAcademicas', foreignKey: 'curriculumId' });
Curriculum.hasMany(ExperienciaProfissional, { as: 'ExperienciasProfissionais', foreignKey: 'curriculumId' });
Curriculum.hasMany(Idioma, { as: 'Idiomas', foreignKey: 'curriculumId' });

FormacaoAcademica.belongsTo(Curriculum, { as: 'Curriculum', foreignKey: 'curriculumId' });
ExperienciaProfissional.belongsTo(Curriculum, { as: 'Curriculum', foreignKey: 'curriculumId' });
Idioma.belongsTo(Curriculum, { as: 'Curriculum', foreignKey: 'curriculumId' });

export { Curriculum, FormacaoAcademica, ExperienciaProfissional, Idioma };
