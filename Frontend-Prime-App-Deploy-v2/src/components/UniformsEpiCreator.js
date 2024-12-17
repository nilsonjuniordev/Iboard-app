import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Button,
  TextField,
  IconButton,
  Box,
  Typography,
  Grid,
  Divider,
  useTheme
} from '@mui/material';
import { Add, Remove } from '@mui/icons-material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UniformsDashboardResponse from '../components/DashBoards/UniformsDashboardResponse' 
const UniformsEpiCreator = () => {
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [availableSizes, setAvailableSizes] = useState(['']);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userCnpj, setUserCnpj] = useState('');
  const [error, setError] = useState('');
  const theme = useTheme();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userIdFromStorage = localStorage.getItem('userId');
        if (userIdFromStorage) {
          const response = await axios.get(`/api/${userIdFromStorage}`);
          setUserCnpj(response.data.id_cnpj);
        } else {
          console.error('UserId não encontrado no localStorage');
        }
      } catch (error) {
        console.error('Erro ao buscar dados do usuário', error);
        toast.error('Erro ao carregar detalhes do usuário.');
      }
    };

    fetchUserData();
  }, []);

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleTypeChange = (e) => {
    setType(e.target.value);
  };

  const handleSizeChange = (index, value) => {
    const newSizes = [...availableSizes];
    newSizes[index] = value;
    setAvailableSizes(newSizes);
  };

  const handleAddSize = () => {
    setAvailableSizes([...availableSizes, '']);
  };

  const handleRemoveSize = (index) => {
    const newSizes = availableSizes.filter((_, i) => i !== index);
    setAvailableSizes(newSizes);
  };

  const validateEpi = () => {
    // Validar campos obrigatórios
    if (!name || !type || availableSizes.some(size => !size.trim())) {
      setError('Por favor, preencha todos os campos obrigatórios.');
      return false;
    }
    setError('');
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateEpi()) {
      toast.error('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    setIsSubmitting(true);

    try {
      await axios.post('/api/uniforms-epi', {
        name,
        type,
        availableSizes,
        id_cnpj: userCnpj,
      });
      setName('');
      setType('');
      setAvailableSizes(['']);
      toast.success('Uniforme/EPI cadastrado com sucesso');
    } catch (error) {
      console.error('Erro ao cadastrar uniforme/EPI', error);
      toast.error('Erro ao cadastrar uniforme/EPI. Por favor, tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Grid container justifyContent="center" sx={{ mt: 1 }}>
      <ToastContainer />
      <Grid
        item
        xs={12}
        sm={6}
        md={4}
        display="flex"
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
        sx={{ boxShadow: 3, borderRadius: 3, p: 3 }}
      >
        <Box
          component="img"
          src="/assets/epi_iboard.png"
          alt="Clima Avatar"
          sx={{
            width: '100%',
            height: 'auto',
            [theme.breakpoints.down('sm')]: {
              width: '100%',
              height: 'auto',
            },
          }}
        />
        <Divider />
        <Typography variant="body2" color="textSecondary">
          Cadastre uniformes e EPIs de forma fácil e rápida, incluindo informações detalhadas sobre tamanhos disponíveis e tipos de equipamentos.
        </Typography>
      </Grid>
      <Grid item xs={12} sm={6} md={8} sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Cadastrar Uniformes e EPI's
        </Typography>
        <Divider />
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            label="Nome"
            value={name}
            onChange={handleNameChange}
            fullWidth
            margin="normal"
            required
            error={Boolean(error)}
            helperText={error}
          />
          <TextField
            label="Tipo"
            value={type}
            onChange={handleTypeChange}
            fullWidth
            margin="normal"
            required
            error={Boolean(error)}
            helperText={error}
          />
          {availableSizes.map((size, index) => (
            <Grid container alignItems="center" key={index}>
              <Grid item xs>
                <TextField
                  label={`Tamanho ${index + 1}`}
                  value={size}
                  onChange={(e) => handleSizeChange(index, e.target.value)}
                  fullWidth
                  margin="normal"
                  required
                  error={Boolean(error)}
                  helperText={error}
                />
              </Grid>
              <Grid item>
                <IconButton
                  onClick={() => handleRemoveSize(index)}
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
            onClick={handleAddSize}
            startIcon={<Add />}
            sx={{ mt: 2, ml: 2 }}
          >
            Adicionar Tamanho
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="secondary"
            sx={{ mt: 2, ml: 2 }}
          >
            {isSubmitting ? 'Enviando...' : 'Cadastrar equipamento'}
          </Button>
        </Box>
      </Grid>
      <Grid container justifyContent="center" sx={{ mt: 3 }}>
      <Grid
        item
        xs={12}
        sm={6}
        md={12}
        display="flex"
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
        sx={{ boxShadow: 3, borderRadius: 3, p: 3 }}
      >
    <Typography variant="h5" gutterBottom>
          Uniformes e EPI's cadastrados
        </Typography>
<UniformsDashboardResponse />
      </Grid>
      </Grid>
    </Grid>
  );
};

export default UniformsEpiCreator;
