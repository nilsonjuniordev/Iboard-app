import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Container,
  Typography,
  Box,
  Paper,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
  CircularProgress,
  Modal,
  Backdrop,
  Fade,
} from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UniformsEpiDashboard = () => {
  const [uniforms, setUniforms] = useState([]);
  const [responses, setResponses] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [selectedUniform, setSelectedUniform] = useState(null);
  const [userId, setUserId] = useState(null);
  const [respondedUniforms, setRespondedUniforms] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userIdFromStorage = localStorage.getItem('userId');
        if (userIdFromStorage) {
          setUserId(userIdFromStorage);
        } else {
          console.error('UserId não encontrado no localStorage');
        }
      } catch (error) {
        console.error('Erro ao buscar userId do localStorage', error);
      }
    };

    const fetchUniforms = async () => {
      try {
        const userIdFromStorage = localStorage.getItem('userId');
        const userResponse = await axios.get(`/api/${userIdFromStorage}`);
        const response = await axios.get('/api/uniforms-epi');
        const filteredUniforms = response.data.filter(uniform => uniform.id_cnpj === userResponse.data.id_cnpj);
        setUniforms(filteredUniforms);

        // Fetch responded uniforms based on userId
        const respondedUniformsResponse = await axios.get(`/api/uniforms-epi/responses?userId=${userIdFromStorage}`);
        const respondedUniformIds = respondedUniformsResponse.data.map(response => response.uniformEpiId);
        setRespondedUniforms(respondedUniformIds);
      } catch (error) {
        console.error('Erro ao buscar uniformes/EPIs', error);
        toast.error('Erro ao buscar uniformes/EPIs');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
    fetchUniforms();
  }, []);

  const handleResponseChange = (uniformId, size) => {
    setResponses({
      ...responses,
      [uniformId]: size,
    });
  };

  const handleSubmit = async () => {
    try {
      await Promise.all(
        Object.entries(responses).map(([uniformId, size]) =>
          axios.post('/api/uniforms-epi/responses', {
            uniformEpiId: uniformId,
            size,
            userId,
          })
        )
      );
      toast.success('Respostas enviadas com sucesso!');
      
      // Fetch responded uniforms based on userId
      const respondedUniformsResponse = await axios.get(`/api/uniforms-epi/responses?userId=${userId}`);
      const respondedUniformIds = respondedUniformsResponse.data.map(response => response.uniformEpiId);
      setRespondedUniforms(respondedUniformIds);

      handleCloseModal(); // Close modal after successful submission
    } catch (error) {
      console.error('Erro ao enviar respostas', error);
      toast.error('Erro ao enviar respostas');
    }
  };

  const handleOpenModal = (uniform) => {
    setSelectedUniform(uniform);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedUniform(null);
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

  return (
    <Container component="main" maxWidth="md">
      {uniforms.length === 0 ? (
        <Typography variant="h6">Nenhum uniforme/EPI disponível.</Typography>
      ) : (
        uniforms.map((item, index) => (
          <Paper key={index} style={{ padding: 16, marginBottom: 16, backgroundColor: respondedUniforms.includes(item.id) ? '#7FFF7F' : '#FF7F7F' }}>
            <Typography
              variant="h6"
              gutterBottom
              onClick={() => handleOpenModal(item)}
              style={{ cursor: 'pointer' }}
            >
              {item.name} - {item.type}
            </Typography>
          </Paper>
        ))
      )}
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={openModal}>
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 400,
              bgcolor: 'background.paper',
              border: '2px solid #000',
              boxShadow: 24,
              p: 4,
            }}
          >
            <Typography
              id="modal-title"
              variant="h6"
              component="h2"
              gutterBottom
            >
              Responder {selectedUniform && `${selectedUniform.name} - ${selectedUniform.type}`}
            </Typography>
            <FormControl component="fieldset">
              <FormLabel component="legend">Selecione o tamanho</FormLabel>
              <RadioGroup
                value={responses[selectedUniform?.id] || ''}
                onChange={(e) =>
                  handleResponseChange(selectedUniform?.id, e.target.value)
                }
              >
                {selectedUniform?.availableSizes.map((size, sizeIndex) => (
                  <FormControlLabel
                    key={sizeIndex}
                    value={size}
                    control={<Radio />}
                    label={size}
                  />
                ))}
              </RadioGroup>
            </FormControl>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              style={{ marginTop: 16 }}
            >
              Enviar Resposta
            </Button>
          </Box>
        </Fade>
      </Modal>
      <ToastContainer />
    </Container>
  );
};

export default UniformsEpiDashboard;
