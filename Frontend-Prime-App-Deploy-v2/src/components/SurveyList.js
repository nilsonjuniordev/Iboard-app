import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Button,
  Typography,
  Box,
  Paper,
  IconButton,
  Modal,
  TextField,
  Grid,
  
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SurveyList = () => {
  const [surveys, setSurveys] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSurvey, setSelectedSurvey] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [surveyTitle, setSurveyTitle] = useState("");

  useEffect(() => {
    const fetchSurveys = async () => {
      try {
        const response = await axios.get("/api/surveys");
        setSurveys(response.data);
      } catch (error) {
        console.error("Erro ao buscar pesquisas", error);
        setError("Erro ao carregar pesquisas. Por favor, tente novamente mais tarde.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSurveys();
  }, []);

  const handleDeleteSurvey = async (id) => {
    try {
      await axios.delete(`/api/surveys/${id}`);
      setSurveys(surveys.filter(survey => survey.id !== id));
      toast.success("Pesquisa deletada com sucesso!");
    } catch (error) {
      console.error("Erro ao deletar a pesquisa", error);
      toast.error("Erro ao deletar a pesquisa. Por favor, tente novamente.");
    }
  };

  const handleEditSurvey = (survey) => {
    setSelectedSurvey(survey);
    setSurveyTitle(survey.title);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedSurvey(null);
  };

  const handleSaveSurvey = async () => {
    try {
      await axios.put(`/api/surveys/${selectedSurvey.id}`, { title: surveyTitle });
      setSurveys(surveys.map(survey => 
        survey.id === selectedSurvey.id ? { ...survey, title: surveyTitle } : survey
      ));
      setOpenModal(false);
      toast.success("Pesquisa editada com sucesso!");
    } catch (error) {
      console.error("Erro ao editar a pesquisa", error);
      toast.error("Erro ao editar a pesquisa. Por favor, tente novamente.");
    }
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <Typography variant="h6">Carregando...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <Typography variant="h6" color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <ToastContainer />
      <Typography variant="h4" gutterBottom>Lista de Pesquisas de Clima</Typography>
      {surveys.length === 0 ? (
        <Typography variant="h6">Nenhuma pesquisa disponível.</Typography>
      ) : (
        surveys.map((survey) => (
          <Paper key={survey.id} style={{ padding: 16, marginBottom: 16 }}>
            <Grid container alignItems="center" justifyContent="space-between">
              <Grid item>
                <Typography variant="h6">{survey.title}</Typography>
              </Grid>
              <Grid item>
                <IconButton color="primary" onClick={() => handleEditSurvey(survey)}>
                  <Edit />
                </IconButton>
                <IconButton color="secondary" onClick={() => handleDeleteSurvey(survey.id)}>
                  <Delete />
                </IconButton>
              </Grid>
            </Grid>
          </Paper>
        ))
      )}

      <Modal
        open={openModal}
        onClose={handleCloseModal}
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
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6" id="edit-survey-modal-title" gutterBottom>
            Editar Pesquisa
          </Typography>
          <TextField
            label="Título da Pesquisa"
            value={surveyTitle}
            onChange={(e) => setSurveyTitle(e.target.value)}
            fullWidth
            margin="normal"
          />
          <Button onClick={handleSaveSurvey} variant="contained" color="primary">
            Salvar
          </Button>
          <Button onClick={handleCloseModal} variant="outlined" color="secondary" style={{ marginLeft: 16 }}>
            Cancelar
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default SurveyList;
