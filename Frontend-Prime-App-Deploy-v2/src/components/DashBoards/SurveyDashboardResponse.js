import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Container,
  Typography,
  Box,
  Paper,
  CircularProgress,
  Button,
  Modal,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Chart from 'react-apexcharts';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SurveyDashboardResponse = () => {
  const [surveys, setSurveys] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSurvey, setSelectedSurvey] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [userId, setUserId] = useState(null);
  const [responses, setResponses] = useState({});

  useEffect(() => {
    // Carregar o ID do usuário do localStorage
    const userIdFromStorage = localStorage.getItem('userId');
    setUserId(userIdFromStorage);

    const fetchData = async () => {
      try {
        const userResponse = await axios.get(`/api/${userIdFromStorage}`);
        const surveyResponse = await axios.get('/api/surveys');

        const filteredSurveys = surveyResponse.data.filter(
          survey => survey.id_cnpj === userResponse.data.id_cnpj
        );

        setSurveys(filteredSurveys);
      } catch (error) {
        setError('Erro ao carregar dados ou pesquisas. Por favor, tente novamente mais tarde.');
        toast.error('Erro ao carregar dados ou pesquisas. Por favor, tente novamente mais tarde.');
      } finally {
        setIsLoading(false);
      }
    };

    if (userIdFromStorage) {
      fetchData();
    } else {
      setIsLoading(false);
      setError('Usuário não encontrado. Verifique se está logado corretamente.');
      toast.error('Usuário não encontrado. Verifique se está logado corretamente.');
    }
  }, [userId]);

  const handleSurveyClick = async (survey) => {
    setSelectedSurvey(survey);
    setOpenModal(true);

    try {
      const response = await axios.get(`/api/surveys/${survey.id}/responses`);
      const responseData = response.data.reduce((acc, curr) => {
        const question = survey.questions[curr.questionIndex];
        if (!acc[question.questionText]) {
          acc[question.questionText] = {};
        }
        if (!acc[question.questionText][curr.answer]) {
          acc[question.questionText][curr.answer] = 0;
        }
        acc[question.questionText][curr.answer]++;
        return acc;
      }, {});
      setResponses(responseData);
    } catch (error) {
      toast.error('Erro ao carregar respostas da pesquisa.');
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedSurvey(null);
    setResponses({});
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
        <ToastContainer />
      </Container>
    );
  }

  return (
    <Container component="main" maxWidth="md">
      {surveys.length === 0 ? (
        <Typography variant="h6">Nenhuma pesquisa disponível.</Typography>
      ) : (
        surveys.map((survey, sIndex) => (
          <Paper  style={{ cursor: 'pointer' }}  onClick={() => handleSurveyClick(survey)} key={sIndex} sx={{ p: 2, marginBottom: 3, bgcolor: '#6a438b', boxShadow: 3, color: '#fff' }}>
            <Typography
              variant="text.secundary"
              gutterBottom              
            
            >
              {survey.title}
            </Typography>
          </Paper>
        ))
      )}

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
            minWidth: 280,
            maxWidth: '80%',
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            maxHeight: '80vh',
            overflowY: 'auto',
          }}
        >
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6" id="survey-modal-title" gutterBottom>
              {selectedSurvey ? selectedSurvey.title : ''}
            </Typography>
            <IconButton onClick={handleCloseModal}>
              <CloseIcon />
            </IconButton>
          </Box>
          {selectedSurvey &&
            selectedSurvey.questions.map((question, qIndex) => (
              <Box key={qIndex} mb={4}>
                <Typography variant="subtitle1" gutterBottom>{question.questionText}</Typography>
                <Box height={400}>
                  <Chart
                    options={{
                      labels: Object.keys(responses[question.questionText] || {}),
                      legend: {
                        position: 'bottom'
                      }
                    }}
                    series={Object.values(responses[question.questionText] || {})}
                    type="pie"
                    width="100%"
                    height="400"
                  />
                </Box>
              </Box>
            ))}
          <Box display="flex" justifyContent="flex-end">
            <Button onClick={handleCloseModal} variant="contained" color="secondary">
              Fechar
            </Button>
          </Box>
        </Box>
      </Modal>
      <ToastContainer />
    </Container>
  );
};

export default SurveyDashboardResponse;
