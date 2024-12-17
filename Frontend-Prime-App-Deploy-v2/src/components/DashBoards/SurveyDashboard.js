import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Container,
  Typography,
  Box,
  Paper,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,                                                                                            
  FormLabel,
  CircularProgress,
  Modal,
  Button,
} from '@mui/material';

const SurveyDashboard = () => {
  const [surveys, setSurveys] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSurvey, setSelectedSurvey] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    // Carregar o ID do usuário do localStorage
    const userIdFromStorage = localStorage.getItem('userId');

    setUserId(userIdFromStorage);

    const fetchData = async () => {
      try {
        // Buscar dados do usuário
        const userResponse = await axios.get(`/api/${userIdFromStorage}`);

     
           // Buscar pesquisas
        const surveyResponse = await axios.get('/api/surveys');
        console.log('Dados brutos da API:', surveyResponse.data);

        // Filtrar pesquisas pelo id_cnpj correspondente ao usuário atual
        const filteredSurveys = surveyResponse.data.filter(
          survey => survey.id_cnpj === userResponse.data.id_cnpj
        );
        console.log('Pesquisas filtradas:', filteredSurveys);

        setSurveys(filteredSurveys);
      } catch (error) {
        console.error('Erro ao buscar dados ou pesquisas:', error);
        setError('Erro ao carregar dados ou pesquisas. Por favor, tente novamente mais tarde.');
      } finally {
        setIsLoading(false);
      }
    };

    if (userIdFromStorage) {
      fetchData();
    } else {
      setIsLoading(false);
      setError('Usuário não encontrado. Verifique se está logado corretamente.');
    }
  }, [userId]); // Adicionar userId como dependência

  const handleAnswerChange = async (surveyId, qIndex, answer) => {
    try {
      if (!userId || !userId) {
        throw new Error('ID do usuário não está disponível.');
      }
  
    
  
      await axios.post('/api/surveys/response', {
        surveyId,
        userId: userId,
        questionIndex: qIndex,
        answer,
      });
      alert('Resposta enviada com sucesso!');
    } catch (error) {
      console.error('Erro ao enviar resposta:', error);
      alert('Erro ao enviar resposta. Por favor, tente novamente.');
    }
  };
  

  const handleSurveyClick = (survey) => {
    setSelectedSurvey(survey);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedSurvey(null);
  };

  if (isLoading) {
    return (
      <Container component="main" maxWidth="md">
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container component="main" maxWidth="md">
        <Typography variant="h6" color="error">{error}</Typography>
      </Container>
    );
  }

  return (
    <Container component="main" maxWidth="md">
      {surveys.length === 0 ? (
        <Typography variant="body" >Nenhuma pesquisa disponível.</Typography>
      ) : (
        surveys.map((survey, sIndex, questionIndex) => (
          <Paper key={sIndex} sx={{ p: 1, marginBottom: 2, bgcolor: '#6a438b', boxShadow: 0, color: '#fff' }}>
            <Typography
              variant="h6"
              gutterBottom
              style={{ cursor: 'pointer' }}
              onClick={() => handleSurveyClick(survey)}
            >
              {survey.title}
            </Typography>
          </Paper>
        ))
      )}

      {/* Modal para responder a pesquisa */}
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="survey-modal-title"
        aria-describedby="survey-modal-description"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            minWidth: '70%',
            maxWidth: '80vh',
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            maxHeight: '90vh',
            overflowY: 'auto',
          }}
        >
          <Typography variant="h6" id="survey-modal-title" gutterBottom>
            {selectedSurvey ? selectedSurvey.title : ''}
          </Typography>
          {selectedSurvey &&
            selectedSurvey.questions.map((question, qIndex) => (
              <Box key={qIndex} mb={2}>
                <FormControl component="fieldset">
                  <FormLabel component="legend">{question.questionText}</FormLabel>
                  <RadioGroup
                    onChange={(e) =>
                      handleAnswerChange(selectedSurvey.id, qIndex, e.target.value)
                    }
                  >
                    {question.answers.map((answer, aIndex) => (
                      <FormControlLabel
                        key={aIndex}
                        value={answer}
                        control={<Radio />}
                        label={answer}
                      />
                    ))}
                  </RadioGroup>
                </FormControl>
              </Box>
            ))}
          <Box display="flex" justifyContent="flex-end">
            <Button onClick={handleCloseModal} variant="contained" color="secondary">
              Fechar
            </Button>
          </Box>
        </Box>
      </Modal>
    </Container>
  );
};

export default SurveyDashboard;
