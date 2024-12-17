import React, { useState, useEffect } from "react";
import {
  useTheme,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  TextField,
  Grid,
  Button,
  Box,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

const FormCadastroCurriculo = () => {
  const [curriculum, setCurriculum] = useState({
    nome: "",
    fone: "",
    email: "",
    cpf: "",
    data_nascimento: "",
    rua: "",
    civil: "",
    genero: "",
    resumoProfissional: "",
    FormacaoAcademicas: [],
    ExperienciasProfissionais: [],
    Idiomas: [],
  });
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const userId = localStorage.getItem("userId");
  const theme = useTheme();

  useEffect(() => {
    const fetchCurriculum = async () => {
      try {
        if (!userId) {
          console.error("userId não encontrado no localStorage");
          return;
        }

        // Buscar o currículo associado ao userId
        const response = await axios.get(`/api/curriculums/user/${userId}`);
        if (response.data && response.data.id) {
          // Buscar os detalhes completos do currículo pelo ID
          const curriculumResponse = await axios.get(
            `/api/curriculums/id/${response.data.id}`
          );
          setCurriculum(curriculumResponse.data); // Preenche os dados do currículo
        } else {
          // Criar um novo currículo se não existir
          setCurriculum({
            nome: "",
            fone: "",
            email: "",
            cpf: "",
            data_nascimento: "",
            rua: "",
            civil: "",
            genero: "",
            resumoProfissional: "",
            FormacaoAcademicas: [],
            ExperienciasProfissionais: [],
            Idiomas: [],
          });
        }
      } catch (error) {
        console.error("Erro ao buscar o currículo:", error);
        setCurriculum({
          nome: "",
          fone: "",
          email: "",
          cpf: "",
          data_nascimento: "",
          rua: "",
          civil: "",
          genero: "",
          resumoProfissional: "",
          FormacaoAcademicas: [],
          ExperienciasProfissionais: [],
          Idiomas: [],
        });
      } finally {
        setLoading(false);
      }
    };
    fetchCurriculum();
  }, [userId]);

  const validate = () => {
    let tempErrors = {};
    let isValid = true;

    if (!curriculum.nome) {
      tempErrors.nome = "Nome é obrigatório";
      isValid = false;
    }
    if (!curriculum.email) {
      tempErrors.email = "Email é obrigatório";
      isValid = false;
    }
    if (!curriculum.cpf) {
      tempErrors.cpf = "CPF é obrigatório";
      isValid = false;
    }
    // Adicione mais validações conforme necessário

    setErrors(tempErrors);
    return isValid;
  };

  const handleChange = (e, category, index) => {
    const { name, value } = e.target;
    setCurriculum((prevCurriculum) => {
      const updatedCategory = [...prevCurriculum[category]];
      updatedCategory[index] = { ...updatedCategory[index], [name]: value };
      return { ...prevCurriculum, [category]: updatedCategory };
    });
  };

  const handleAdd = (category) => {
    setCurriculum((prevCurriculum) => ({
      ...prevCurriculum,
      [category]: [...prevCurriculum[category], {}],
    }));
  };

  const handleRemove = (category, index) => {
    setCurriculum((prevCurriculum) => {
      const updatedCategory = prevCurriculum[category].filter(
        (_, i) => i !== index
      );
      return { ...prevCurriculum, [category]: updatedCategory };
    });
  };

  const handleSave = async () => {
    if (!userId) {
      toast.error("ID do usuário não encontrado no armazenamento local.");
      return;
    }

    // Adiciona o userId ao objeto curriculum
    const curriculumWithUserId = { ...curriculum, userId };

    if (validate()) {
      try {
        if (curriculum.id) {
          // Atualiza o currículo existente
          const response = await axios.put(
            `/api/curriculums/id/${curriculum.id}`,
            curriculumWithUserId
          );
          console.log("Currículo atualizado com sucesso:", response.data);
          toast.success("Currículo atualizado com sucesso!");
        } else {
          // Cria um novo currículo
          const response = await axios.post(
            "/api/curriculums",
            curriculumWithUserId
          );
          console.log("Currículo criado com sucesso:", response.data);
          toast.success("Currículo criado com sucesso!");
          setCurriculum((prevCurriculum) => ({
            ...prevCurriculum,
            id: response.data.id, // Atualiza o ID do currículo
          }));
        }
      } catch (error) {
        console.error("Erro ao salvar o currículo:", error);
        toast.error("Erro ao salvar o currículo.");
      }
    } else {
      toast.error("Por favor, corrija os erros de validação.");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <Grid
      container
      spacing={2}
      justifyContent="center" // Centraliza horizontalmente
      alignItems="top" // Centraliza verticalmente
      sx={{
        minHeight: "80vh", // Faz com que o grid ocupe toda a altura da tela
      }}
    >
      <Grid item xs={12} sm={10} md={9}>
        <Box>
          <Box sx={{ pb: 2 }}>
            <Typography variant="h4" gutterBottom>
              Meu currículo
            </Typography>
            <Typography variant="body" gutterBottom>
              Mantenha seu currículo atualizado para receber vagas e
              oportunidades que se encaixam no seu perfil. Não perca chances de
              avançar na sua carreira!
            </Typography>
          </Box>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              Informações pessoais
            </AccordionSummary>
            <AccordionDetails>
              <TextField
                fullWidth
                label="Nome"
                name="nome"
                value={curriculum.nome}
                onChange={(e) =>
                  setCurriculum({ ...curriculum, nome: e.target.value })
                }
                sx={{ mt: 2 }}
                error={!!errors.nome}
                helperText={errors.nome}
              />
              <TextField
                fullWidth
                label="Telefone"
                name="fone"
                value={curriculum.fone}
                onChange={(e) =>
                  setCurriculum({ ...curriculum, fone: e.target.value })
                }
                sx={{ mt: 2 }}
              />
              <TextField
                fullWidth
                label="Email"
                name="email"
                value={curriculum.email}
                onChange={(e) =>
                  setCurriculum({ ...curriculum, email: e.target.value })
                }
                sx={{ mt: 2 }}
                error={!!errors.email}
                helperText={errors.email}
              />
              <TextField
                fullWidth
                label="CPF"
                name="cpf"
                value={curriculum.cpf}
                onChange={(e) =>
                  setCurriculum({ ...curriculum, cpf: e.target.value })
                }
                sx={{ mt: 2 }}
                error={!!errors.cpf}
                helperText={errors.cpf}
              />
              <TextField
                fullWidth
                label="Data de Nascimento"
                name="data_nascimento"
                type="date"
                value={
                  curriculum.data_nascimento
                    ? curriculum.data_nascimento.split("T")[0]
                    : ""
                }
                onChange={(e) =>
                  setCurriculum({
                    ...curriculum,
                    data_nascimento: e.target.value,
                  })
                }
                sx={{ mt: 2 }}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                fullWidth
                label="Rua"
                name="rua"
                value={curriculum.rua}
                onChange={(e) =>
                  setCurriculum({ ...curriculum, rua: e.target.value })
                }
                sx={{ mt: 2 }}
              />
              <TextField
                fullWidth
                label="Estado Civil"
                name="civil"
                value={curriculum.civil}
                onChange={(e) =>
                  setCurriculum({ ...curriculum, civil: e.target.value })
                }
                sx={{ mt: 2 }}
              />
              <TextField
                fullWidth
                label="Gênero"
                name="genero"
                value={curriculum.genero}
                onChange={(e) =>
                  setCurriculum({ ...curriculum, genero: e.target.value })
                }
                sx={{ mt: 2 }}
              />
              <TextField
                fullWidth
                label="Resumo Profissional"
                name="resumoProfissional"
                value={curriculum.resumoProfissional}
                onChange={(e) =>
                  setCurriculum({
                    ...curriculum,
                    resumoProfissional: e.target.value,
                  })
                }
                sx={{ mt: 2 }}
                multiline
                rows={4}
              />
            </AccordionDetails>
          </Accordion>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              Formação Acadêmica
            </AccordionSummary>
            <AccordionDetails>
              {curriculum.FormacaoAcademicas.map((item, index) => (
                <Box key={index} sx={{ mt: 2 }}>
                  <TextField
                    fullWidth
                    label="Instituição"
                    name="instituicao"
                    value={item.instituicao || ""}
                    onChange={(e) =>
                      handleChange(e, "FormacaoAcademicas", index)
                    }
                    sx={{ mt: 1 }}
                  />
                  <TextField
                    fullWidth
                    label="Localidade"
                    name="localidade"
                    value={item.localidade || ""}
                    onChange={(e) =>
                      handleChange(e, "FormacaoAcademicas", index)
                    }
                    sx={{ mt: 1 }}
                  />
                  <TextField
                    fullWidth
                    label="Curso"
                    name="curso"
                    value={item.curso || ""}
                    onChange={(e) =>
                      handleChange(e, "FormacaoAcademicas", index)
                    }
                    sx={{ mt: 1 }}
                  />
                  <TextField
                    fullWidth
                    label="Nível"
                    name="nivel"
                    value={item.nivel || ""}
                    onChange={(e) =>
                      handleChange(e, "FormacaoAcademicas", index)
                    }
                    sx={{ mt: 1 }}
                  />
                  <TextField
                    fullWidth
                    label="Data de Início"
                    name="dataInicio"
                    type="date"
                    value={item.dataInicio || ""}
                    onChange={(e) =>
                      handleChange(e, "FormacaoAcademicas", index)
                    }
                    sx={{ mt: 1 }}
                    InputLabelProps={{ shrink: true }}
                  />
                  <TextField
                    fullWidth
                    label="Data de Conclusão"
                    name="dataFim"
                    type="date"
                    value={item.dataFim || ""}
                    onChange={(e) =>
                      handleChange(e, "FormacaoAcademicas", index)
                    }
                    sx={{ mt: 1 }}
                    InputLabelProps={{ shrink: true }}
                  />

                  <Grid container>
                    <Grid
                      xs={12}
                      sm={6}
                      md={3}
                      justifyContent="center"
                      alignItems="center"
                      sx={{ m: 1 }}
                    >
                      <Button
                        variant="outlined"
                        color="secondary"
                        onClick={() =>
                          handleRemove("FormacaoAcademicas", index)
                        }
                        startIcon={<RemoveIcon />}
                        sx={{
                          p: 1,
                          border: "2px solid",
                          borderColor: (theme) => theme.palette.secondary.main,
                          backgroundColor: "transparent", // Garante que o fundo seja transparente
                          color: (theme) => theme.palette.secondary.main, // Cor do texto e ícone
                          "&:hover": {
                            backgroundColor: "transparent", // Garante que o fundo não muda ao passar o mouse
                            borderColor: (theme) =>
                              theme.palette.secondary.dark, // Opcional: cor do contorno ao passar o mouse
                          },
                        }}
                      >
                        Remover Formação
                      </Button>
                    </Grid>{" "}
                  </Grid>
                </Box>
              ))}
              <Button
                onClick={() => handleAdd("FormacaoAcademicas")}
                startIcon={<AddIcon />}
              >
                Adicionar Formação
              </Button>
            </AccordionDetails>
          </Accordion>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              Experiência Profissional
            </AccordionSummary>
            <AccordionDetails>
              {curriculum.ExperienciasProfissionais.map((item, index) => (
                <Box key={index} sx={{ mt: 2 }}>
                  <TextField
                    fullWidth
                    label="Cargo"
                    name="cargo"
                    value={item.cargo || ""}
                    onChange={(e) =>
                      handleChange(e, "ExperienciasProfissionais", index)
                    }
                    sx={{ mt: 1 }}
                  />
                  <TextField
                    fullWidth
                    label="Área"
                    name="area"
                    value={item.area || ""}
                    onChange={(e) =>
                      handleChange(e, "ExperienciasProfissionais", index)
                    }
                    sx={{ mt: 1 }}
                  />
                  <TextField
                    fullWidth
                    label="Especialização"
                    name="especializacao"
                    value={item.especializacao || ""}
                    onChange={(e) =>
                      handleChange(e, "ExperienciasProfissionais", index)
                    }
                    sx={{ mt: 1 }}
                  />
                  <TextField
                    fullWidth
                    label="Descrição da Atividade"
                    name="descricao"
                    value={item.descricao || ""}
                    onChange={(e) =>
                      handleChange(e, "ExperienciasProfissionais", index)
                    }
                    sx={{ mt: 1 }}
                    multiline
                    rows={4}
                  />

                  <Grid container>
                    <Grid
                      xs={12}
                      sm={6}
                      md={3}
                      justifyContent="center"
                      alignItems="center"
                      sx={{ m: 1 }}
                    >
                      <Button
                        variant="outlined"
                        color="secondary"
                        onClick={() =>
                          handleRemove("ExperienciasProfissionais", index)
                        }
                        startIcon={<RemoveIcon />}
                        sx={{
                          p: 1,
                          border: "2px solid",
                          borderColor: (theme) => theme.palette.secondary.main,
                          backgroundColor: "transparent", // Garante que o fundo seja transparente
                          color: (theme) => theme.palette.secondary.main, // Cor do texto e ícone
                          "&:hover": {
                            backgroundColor: "transparent", // Garante que o fundo não muda ao passar o mouse
                            borderColor: (theme) =>
                              theme.palette.secondary.dark, // Opcional: cor do contorno ao passar o mouse
                          },
                        }}
                      >
                        Remover Experiência
                      </Button>
                    </Grid>{" "}
                  </Grid>
                </Box>
              ))}
              <Button
                onClick={() => handleAdd("ExperienciasProfissionais")}
                startIcon={<AddIcon />}
              >
                Adicionar Experiência
              </Button>
            </AccordionDetails>
          </Accordion>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              Idiomas
            </AccordionSummary>
            <AccordionDetails>
              {curriculum.Idiomas.map((item, index) => (
                <Box key={index} sx={{ mt: 2 }}>
                  <TextField
                    fullWidth
                    label="Idioma"
                    name="idioma"
                    value={item.idioma || ""}
                    onChange={(e) => handleChange(e, "Idiomas", index)}
                    sx={{ mt: 1 }}
                  />
                  <TextField
                    fullWidth
                    label="Nível"
                    name="nivel"
                    value={item.nivel || ""}
                    onChange={(e) => handleChange(e, "Idiomas", index)}
                    sx={{ mt: 1 }}
                  />

                  <Grid container>
                    <Grid
                      xs={12}
                      sm={6}
                      md={3}
                      justifyContent="center"
                      alignItems="center"
                      sx={{ m: 1 }}
                    >
                      <Button
                        variant="outlined"
                        color="secondary"
                        onClick={() => handleRemove("Idiomas", index)}
                        startIcon={<RemoveIcon />}
                        sx={{
                          p: 1,
                          border: "2px solid",
                          borderColor: (theme) => theme.palette.secondary.main,
                          backgroundColor: "transparent", // Garante que o fundo seja transparente
                          color: (theme) => theme.palette.secondary.main, // Cor do texto e ícone
                          "&:hover": {
                            backgroundColor: "transparent", // Garante que o fundo não muda ao passar o mouse
                            borderColor: (theme) =>
                              theme.palette.secondary.dark, // Opcional: cor do contorno ao passar o mouse
                          },
                        }}
                      >
                        Remover Idioma
                      </Button>
                    </Grid>{" "}
                  </Grid>
                </Box>
              ))}

              <Grid container>
                <Grid
                  xs={12}
                  sm={6}
                  md={3}
                  justifyContent="center"
                  alignItems="center"
                  sx={{ m: 1 }}
                >
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => handleAdd("Idiomas")}
                    startIcon={<AddIcon />}
                  >
                    Adicionar Idioma
                  </Button>
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
          <Box sx={{ mt: 2 }}>
            <Button variant="outlined" color="secondary" onClick={handleSave}>
              Salvar
            </Button>
          </Box>
          <ToastContainer />
        </Box>
      </Grid>

      <Grid xs={12} sm={6} md={3} justifyContent="center" alignItems="center">
        <Box
          component="img"
          src="/assets/curriculouser.png"
          alt="Clima Avatar"
          sx={{
            width: "100%",
            height: "auto",
            mt: 5,
            [theme.breakpoints.down("sm")]: {
              width: "100%",
              height: "auto",
              mt: 0,
            },
          }}
        />
      </Grid>
    </Grid>
  );
};

export default FormCadastroCurriculo;