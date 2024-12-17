import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  Modal,
  TextField,
  CircularProgress,
} from '@mui/material';

const SurveyManagement = () => {
  const [surveys, setSurveys] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [selectedSurvey, setSelectedSurvey] = useState(null);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const userIdFromStorage = localStorage.getItem('userId');
      try {
        const response = await axios.get(`/api/${userIdFromStorage}`);
        setUserData(response.data);
      } catch (error) {
        console.error('Erro ao buscar dados do usuário', error);
        setError('Erro ao buscar dados do usuário. Por favor, tente novamente mais tarde.');
      }
    };

    const userIdFromStorage = localStorage.getItem('userId');
    if (userIdFromStorage) {
      fetchUserData();
    }
  }, []);

  useEffect(() => {
    const fetchSurveys = async () => {
      try {
        const response = await axios.get('/api/surveys');
        const filteredSurveys = response.data.filter(
          survey => survey.id_cnpj === userData?.id_cnpj
        );
        setSurveys(filteredSurveys);
      } catch (error) {
        console.error('Erro ao buscar pesquisas', error);
        setError('Erro ao buscar pesquisas. Por favor, tente novamente mais tarde.');
      } finally {
        setIsLoading(false);
      }
    };

    if (userData) {
      fetchSurveys();
    }
  }, [userData]);

  const handleDeleteSurvey = async (surveyId) => {
    try {
      await axios.delete(`/api/surveys/${surveyId}`);
      setSurveys(surveys.filter(survey => survey.id !== surveyId));
    } catch (error) {
      console.error('Erro ao deletar a pesquisa', error);
      alert('Erro ao deletar a pesquisa. Por favor, tente novamente.');
    }
  };

  const handleEditSurvey = (survey) => {
    setSelectedSurvey(survey);
    setOpenModal(true);
  };

  const handleSaveSurvey = async () => {
    try {
      await axios.put(`/api/surveys/${selectedSurvey.id}`, selectedSurvey);
      setSurveys(surveys.map(survey => (survey.id === selectedSurvey.id ? selectedSurvey : survey)));
      setOpenModal(false);
    } catch (error) {
      console.error('Erro ao atualizar a pesquisa', error);
      alert('Erro ao atualizar a pesquisa. Por favor, tente novamente.');
    }
  };

  const handleChange = (e) => {
    setSelectedSurvey({ ...selectedSurvey, [e.target.name]: e.target.value });
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
        <Typography variant="h6">Nenhuma pesquisa disponível.</Typography>
      ) : (
        surveys.map((survey, sIndex) => (
          <Paper key={sIndex} sx={{ p: 2, marginBottom: 3, bgcolor: '#6a438b', boxShadow: 3, color: '#fff' }}>
            <Typography variant="h6" gutterBottom>{survey.title}</Typography>
            <Button variant="contained" color="primary" onClick={() => handleEditSurvey(survey)}>
              Editar
            </Button>
            <Button variant="contained" color="secondary" onClick={() => handleDeleteSurvey(survey.id)}>
              Excluir
            </Button>
          </Paper>
        ))
      )}

      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
        aria-labelledby="edit-survey-modal-title"
        aria-describedby="edit-survey-modal-description"
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
          <Typography variant="h6" id="edit-survey-modal-title" gutterBottom>
            Editar Pesquisa
          </Typography>
          {selectedSurvey && (
            <Box>
              <TextField
                name="title"
                label="Título"
                value={selectedSurvey.title}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
              {/* Adicione mais campos conforme necessário para editar as perguntas */}
              <Box display="flex" justifyContent="flex-end" mt={2}>
                <Button onClick={handleSaveSurvey} variant="contained" color="primary">
                  Salvar
                </Button>
              </Box>
            </Box>
          )}
        </Box>
      </Modal>
    </Container>
  );
};

export default SurveyManagement;
