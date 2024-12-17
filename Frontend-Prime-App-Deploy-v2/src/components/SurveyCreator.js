import React, { useState, useEffect } from "react";
import SurveyManagement from '../components/SurveyManagement';
import axios from "axios";
import {
  Button,
  TextField,
  IconButton,
  Box,
  Typography,
  Grid,
  Divider,
  useTheme,
} from "@mui/material";
import { Add, Remove } from "@mui/icons-material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SurveyCreator = () => {
  const [surveyTitle, setSurveyTitle] = useState("");
  const [questions, setQuestions] = useState([
    { questionText: "", answers: [""] },
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userId, setUserId] = useState(null);
  const [idCnpj, setIdCnpj] = useState(null);
  const theme = useTheme();

  useEffect(() => {
    const userIdFromStorage = localStorage.getItem('userId');
    setUserId(userIdFromStorage);

    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(`/api/${userIdFromStorage}`);
        setIdCnpj(response.data.id_cnpj);
      } catch (error) {
        console.error("Erro ao buscar detalhes do usuário", error);
        toast.error("Erro ao carregar detalhes do usuário.");
      }
    };

    if (userIdFromStorage) {
      fetchUserDetails();
    }
  }, []);

  const handleSurveyTitleChange = (e) => {
    setSurveyTitle(e.target.value);
  };

  const handleQuestionChange = (index, value) => {
    const newQuestions = [...questions];
    newQuestions[index].questionText = value;
    setQuestions(newQuestions);
  };

  const handleAnswerChange = (qIndex, aIndex, value) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].answers[aIndex] = value;
    setQuestions(newQuestions);
  };

  const handleAddQuestion = () => {
    setQuestions([...questions, { questionText: "", answers: [""] }]);
  };

  const handleAddAnswer = (qIndex) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].answers.push("");
    setQuestions(newQuestions);
  };

  const handleRemoveQuestion = (index) => {
    const newQuestions = questions.filter((_, i) => i !== index);
    setQuestions(newQuestions);
  };

  const handleRemoveAnswer = (qIndex, aIndex) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].answers = newQuestions[qIndex].answers.filter(
      (_, i) => i !== aIndex
    );
    setQuestions(newQuestions);
  };

  const validateSurvey = () => {
    if (!surveyTitle) {
      toast.error("O título da pesquisa é obrigatório.");
      return false;
    }
    if (questions.length === 0 || questions.some(q => !q.questionText)) {
      toast.error("Cada pesquisa deve ter pelo menos uma pergunta com texto.");
      return false;
    }
    if (questions.some(q => q.answers.length === 0 || q.answers.some(a => !a))) {
      toast.error("Cada pergunta deve ter pelo menos uma resposta válida.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateSurvey()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await axios.post("/api/surveys", {
        title: surveyTitle,
        questions,
        userId,
        id_cnpj: idCnpj,
      });
      setSurveyTitle("");
      setQuestions([{ questionText: "", answers: [""] }]);
      toast.success("Pesquisa criada com sucesso!");
    } catch (error) {
      console.error("Erro ao criar a pesquisa", error);
      toast.error("Erro ao criar a pesquisa. Por favor, tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Grid container justifyContent="center">
      <ToastContainer />
      <Grid  xs={12} sm={6} md={9} sx={{ p: 3 }}>
        <Typography variant="h5">Pesquisa de Clima</Typography>
        <Divider />
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            label="Título da Pesquisa"
            value={surveyTitle}
            onChange={handleSurveyTitleChange}
            fullWidth
            margin="normal"
          />
          {questions.map((question, qIndex) => (
            <Box key={qIndex} mb={2}>
              <TextField
                label={`Pergunta ${qIndex + 1}`}
                value={question.questionText}
                onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
                fullWidth
                margin="normal"
              />
              {question.answers.map((answer, aIndex) => (
                <Grid container alignItems="center" key={aIndex}>
                  <Grid item xs>
                    <TextField
                      label={`Resposta ${aIndex + 1}`}
                      value={answer}
                      onChange={(e) =>
                        handleAnswerChange(qIndex, aIndex, e.target.value)
                      }
                      fullWidth
                      margin="normal"
                    />
                  </Grid>
                  <Grid item>
                    <IconButton
                      onClick={() => handleRemoveAnswer(qIndex, aIndex)}
                      color="secondary"
                    >
                      <Remove />
                    </IconButton>
                  </Grid>
                </Grid>
              ))}
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => handleAddAnswer(qIndex)}
                startIcon={<Add />}
                style={{ marginTop: 16, marginLeft: 16 }}
              >
                Adicionar Resposta
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => handleRemoveQuestion(qIndex)}
                startIcon={<Remove />}
                style={{ marginTop: 16, marginLeft: 16 }}
              >
                Remover Pergunta
              </Button>
            </Box>
          ))}
          <Button
            variant="contained"
            onClick={handleAddQuestion}
            startIcon={<Add />}
            style={{ marginTop: 16, marginLeft: 16 }}
          >
            Adicionar Pergunta
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="secondary"
            disabled={isSubmitting}
            style={{ marginTop: 16, marginLeft: 16 }}
          >
            {isSubmitting ? "Enviando..." : "Criar Pesquisa"}
          </Button>
        </Box>
      </Grid>

      <Grid
        xs={12}
        sm={6}
        md={3}
        display="flex"
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
        sx={{ boxShadow: 3, borderRadius: 3, p: 3 }}
      >
        <Box
          component="img"
          src="/assets/Clima_avatar.png"
          alt="Clima Avatar"
          sx={{
            width: "80%",
            height: "auto",
            [theme.breakpoints.down("sm")]: {
              width: "100%",
              height: "auto",
            },
          }}
        />
        <Divider />
        <Typography variant="text.secondary">
          Crie pesquisas de clima organizacional com perguntas e respostas
          personalizadas, facilitando a coleta de feedback valioso para melhorar
          o ambiente de trabalho.
        </Typography>
      </Grid>



      <Grid
        xs={12}
        sm={6}
        md={12}
        display="flex"
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
        sx={{ boxShadow: 3, borderRadius: 3, p: 3, mt:3 }}
      >

<Typography variant="h5">Editar pesquisa de Clima</Typography>
<Divider />

<SurveyManagement/>
        
        
      </Grid>

    </Grid>
  );
};

export default SurveyCreator;
