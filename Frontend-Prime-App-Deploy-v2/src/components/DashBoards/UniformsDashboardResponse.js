import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Container,
  Typography,
  Box,
  Paper,
  CircularProgress,
  Modal,
  Button,
  List,
  ListItem,
  ListItemText
} from '@mui/material';

const UniformsDashboard = () => {
  const [uniforms, setUniforms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUniform, setSelectedUniform] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [responses, setResponses] = useState([]);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    // Carregar o ID do usuário do localStorage
    const userIdFromStorage = localStorage.getItem('userId');
    setUserId(userIdFromStorage);

    const fetchData = async () => {
      try {
        // Buscar dados do usuário
        const userResponse = await axios.get(`/api/${userIdFromStorage}`);

        // Buscar uniformes
        const uniformResponse = await axios.get('/api/uniforms-epi');
        console.log('Dados brutos da API:', uniformResponse.data);

        // Filtrar uniformes pelo id_cnpj correspondente ao usuário atual
        const filteredUniforms = uniformResponse.data.filter(
          uniform => uniform.id_cnpj === userResponse.data.id_cnpj
        );
        console.log('Uniformes filtrados:', filteredUniforms);

        setUniforms(filteredUniforms);
      } catch (error) {
        console.error('Erro ao buscar dados ou uniformes:', error);
        setError('Erro ao carregar dados ou uniformes. Por favor, tente novamente mais tarde.');
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
  }, [userId]);

  const handleUniformClick = async (uniform) => {
    setSelectedUniform(uniform);
    setOpenModal(true);

    try {
      // Buscar respostas para o uniforme selecionado
      const response = await axios.get('/api/uniforms-epi/responses');
      console.log('Respostas brutas da API:', response.data);

      // Filtrar respostas pelo id do uniforme selecionado
      const filteredResponses = response.data.filter(
        res => res.uniformEpiId === uniform.id
      );
      console.log('Respostas filtradas:', filteredResponses);

      // Buscar nomes dos usuários para cada resposta
      const responsesWithUserNames = await Promise.all(
        filteredResponses.map(async (res) => {
          const userResponse = await axios.get(`/api/${res.userId}`);
          return {
            ...res,
            userName: userResponse.data.nome,
          };
        })
      );
      console.log('Respostas com nomes dos usuários:', responsesWithUserNames);

      setResponses(responsesWithUserNames);
    } catch (error) {
      console.error('Erro ao buscar respostas:', error);
      setError('Erro ao carregar respostas. Por favor, tente novamente mais tarde.');
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedUniform(null);
    setResponses([]);
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
      {uniforms.length === 0 ? (
        <Typography variant="text.secundary">Nenhum uniforme disponível.</Typography>
      ) : (
        uniforms.map((uniform, index) => (
          <Paper   style={{ cursor: 'pointer' }}   onClick={() => handleUniformClick(uniform)} key={index} sx={{ p: 2, marginBottom: 1, bgcolor: '#6a438b', boxShadow: 3, color: '#fff' }}>
            <Typography
              variant="text.secundary"
              gutterBottom
            >
              {uniform.name}
            </Typography>
          </Paper>
        ))
      )}

      {/* Modal para visualizar respostas */}
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="uniform-modal-title"
        aria-describedby="uniform-modal-description"
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
          <Typography variant="h6" id="uniform-modal-title" gutterBottom>
            {selectedUniform ? selectedUniform.name : ''}
          </Typography>
          {responses.length === 0 ? (
            <Typography variant="body1">Nenhuma resposta encontrada para este uniforme.</Typography>
          ) : (
            <List>
              {responses.map((response, index) => (
                <ListItem key={index}>
                  <ListItemText
                    primary={`Colaborador: ${response.userName}`}
                    secondary={`Tamanho: ${response.size}`}
                  />
                </ListItem>
              ))}
            </List>
          )}
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

export default UniformsDashboard;
