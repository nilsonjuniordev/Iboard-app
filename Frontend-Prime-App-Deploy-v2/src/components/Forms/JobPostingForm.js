import React, { useState, useEffect } from 'react';
import { TextField, MenuItem, Button, FormControl, InputLabel, Select, Typography, Box } from '@mui/material';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const JobPostingForm = () => {
  const [cargo, setCargo] = useState('');
  const [empresa, setEmpresa] = useState('');
  const [tipoLocal, setTipoLocal] = useState('');
  const [localidade, setLocalidade] = useState('');
  const [tipoVaga, setTipoVaga] = useState('');
  const [descricao, setDescricao] = useState('');
  const [responsabilidades, setResponsabilidades] = useState('');
  const [qualificacoes, setQualificacoes] = useState('');
  const [idCnpj, setIdCnpj] = useState(null);

  // Recupera o iduser do localStorage e busca o id_cnpj correspondente
  useEffect(() => {
    const fetchCnpj = async () => {
      const userId = localStorage.getItem('userId');
      if (userId) {
        try {
          const response = await axios.get(`api/${userId}`);
          if (response.data && response.data.id_cnpj) {
            setIdCnpj(response.data.id_cnpj);
          } else {
            toast.error('Erro ao recuperar o id_cnpj do usuário.');
          }
        } catch (error) {
          console.error('Erro ao buscar o id_cnpj:', error);
          toast.error('Erro ao buscar o id_cnpj.');
        }
      }
    };
    fetchCnpj();
  }, []);

  const validateForm = () => {
    if (!cargo || !empresa || !tipoLocal || !localidade || !tipoVaga || !descricao || !responsabilidades || !qualificacoes) {
      toast.error('Por favor, preencha todos os campos.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;

    try {
      const response = await axios.post('api/jobs/job-postings', {
        cargo,
        empresa,
        tipoLocal,
        localidade,
        tipoVaga,
        descricao,
        responsabilidades,
        qualificacoes,
        id_cnpj: idCnpj,  // Inclui o id_cnpj
        userId: null,  // Define o iduser como null
      });

      if (response.status === 201) {
        toast.success('Vaga publicada com sucesso!');
        // Limpar o formulário
        setCargo('');
        setEmpresa('');
        setTipoLocal('');
        setLocalidade('');
        setTipoVaga('');
        setDescricao('');
        setResponsabilidades('');
        setQualificacoes('');
      } else {
        toast.error('Ocorreu um erro ao publicar a vaga.');
      }
    } catch (error) {
      console.error('Erro ao publicar a vaga:', error);
      toast.error('Erro ao publicar a vaga.');
    }
  };

  return (
    <Box sx={{ maxWidth: 800, margin: 'auto', padding: 2 }}>
      <ToastContainer />
      <Typography variant="h4" gutterBottom>
        Anuncie uma vaga agora
      </Typography>
      <Typography variant="h6" gutterBottom>
        Contrate pessoas mais qualificadas
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Cargo"
          value={cargo}
          onChange={(event) => setCargo(event.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Empresa"
          value={empresa}
          onChange={(event) => setEmpresa(event.target.value)}
          fullWidth
          margin="normal"
        />
        <FormControl fullWidth margin="normal">
          <InputLabel>Tipo de local de trabalho</InputLabel>
          <Select
            value={tipoLocal}
            onChange={(event) => setTipoLocal(event.target.value)}
            label="Tipo de local de trabalho"
          >
            <MenuItem value="Presencial">Presencial</MenuItem>
            <MenuItem value="Remoto">Remoto</MenuItem>
            <MenuItem value="Híbrido">Híbrido</MenuItem>
          </Select>
        </FormControl>
        <TextField
          label="Localidade da vaga"
          value={localidade}
          onChange={(event) => setLocalidade(event.target.value)}
          fullWidth
          margin="normal"
        />
        <FormControl fullWidth margin="normal">
          <InputLabel>Tipo de vaga</InputLabel>
          <Select
            value={tipoVaga}
            onChange={(event) => setTipoVaga(event.target.value)}
            label="Tipo de vaga"
          >
            <MenuItem value="Tempo integral">Tempo integral</MenuItem>
            <MenuItem value="Meio período">Meio período</MenuItem>
            <MenuItem value="Freelancer">Freelancer</MenuItem>
          </Select>
        </FormControl>
        <TextField
          label="Descrição da Vaga"
          value={descricao}
          onChange={(event) => setDescricao(event.target.value)}
          multiline
          rows={4}
          fullWidth
          margin="normal"
          helperText="Dicas: forneça um resumo do cargo, como teria sucesso no cargo e como este cargo se encaixa na organização em geral."
        />
        <TextField
          label="Responsabilidades"
          value={responsabilidades}
          onChange={(event) => setResponsabilidades(event.target.value)}
          multiline
          rows={4}
          fullWidth
          margin="normal"
          helperText="Entre em detalhes ao descrever cada uma das responsabilidades. Use linguagem inclusiva e com neutralidade de gênero."
        />
        <TextField
          label="Qualificações"
          value={qualificacoes}
          onChange={(event) => setQualificacoes(event.target.value)}
          multiline
          rows={4}
          fullWidth
          margin="normal"
          helperText="Algumas qualificações que seria bom incluir são competências, formação acadêmica, experiência ou certificados."
        />
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Publicar Vaga
        </Button>
      </form>
    </Box>
  );
};

export default JobPostingForm;
