// src/components/ContractSigningPlatform.js
import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';
import {
  Box,
  Tabs,
  Tab,
  Typography,
  TextField,
  Button,
  InputAdornment,
  useMediaQuery,
  Stepper,
  Step,
  StepLabel,
  Input,
  TableCell,
  TableHead,
  TableRow,
  TableBody,
  TableContainer,
  Table,
  Paper,
  Menu,
  MenuItem,
  Avatar, Tooltip

} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import IconButton from '@mui/material/IconButton';
import axios from 'axios';

// Definindo o componente ContractTable
const ContractTable = ({ contracts, filters }) => {
  // Lógica do ContractTable aqui
  return (
    <div>
      {/* Renderize a tabela de contratos aqui */}
  
    </div>
  );
};

// Definindo os passos do Stepper
const steps = ['Upload do Arquivo', 'Inserir Assinantes', 'Conferir e Enviar'];

const ContractSigningPlatform = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const [contractTitle, setContractTitle] = useState('');
  const [filter, setFilter] = useState('');
  const [activeStep, setActiveStep] = useState(0);
  const [file, setfile] = useState(null);
  const [signers, setSigners] = useState([{ name: '', email: '', cpf: '' }]);
  const [contracts, setContracts] = useState([]);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const fetchContracts = async () => {
      try {
        const response = await axios.get('/api/contracts');
        setContracts(response.data);
      } catch (error) {
        console.error('Erro ao buscar contratos:', error);
      }
    };

    fetchContracts();
  }, []);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
    return new Date(dateString).toLocaleString('pt-BR', options);
  };

  const [anchorEl, setAnchorEl] = useState(null);
const handleClick = (event) => {
  setAnchorEl(event.currentTarget);
};
const handleClose = () => {
  setAnchorEl(null);
};

const getInitials = (name) => {
  const names = name.split(' ');
  return names.map(n => n.charAt(0).toUpperCase()).join('');
};

const handleDownload = (contractId) => {
  // Lógica para download do contrato
  console.log(`Download do contrato com ID: ${contractId}`);
};

const handleView = (contractId) => {
  // Lógica para visualizar o contrato
  console.log(`Visualizar contrato com ID: ${contractId}`);
};

const handleArchive = (contractId) => {
  // Lógica para arquivar o contrato
  console.log(`Arquivar contrato com ID: ${contractId}`);
};


  const handleTabChange = (event, newIndex) => {
    setTabIndex(newIndex);
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const handlefileChange = (event) => {
    setfile(event.target.files[0]);
  };

  const handleSignerChange = (index, event) => {
    const { name, value } = event.target;
    const newSigners = [...signers];
    newSigners[index][name] = value;
    setSigners(newSigners);
  };

  const handleAddSigner = () => {
    setSigners([...signers, { name: '', email: '' }]);
  };

  const handleRemoveSigner = (index) => {
    const newSigners = signers.filter((_, i) => i !== index);
    setSigners(newSigners);
  };

  const handleNextStep = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBackStep = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSubmitContract = async () => {
    if (!file || signers.some(signer => !signer.name || !signer.email || !signer.cpf)) {
      toast.error('Por favor, preencha todos os campos obrigatórios.');
      return;
    }
  
    const userId = localStorage.getItem('userId');
    if (!userId) {
      toast.error('User ID não encontrado. Por favor, faça login novamente.');
      return;
    }
  
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', contractTitle);
    formData.append('userId', userId);
    formData.append('signers', JSON.stringify(signers)); // Certifique-se de que o CPF está incluído
  
    try {
      const response = await axios.post('/api/contracts', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'userid': userId,
        },
      });
      toast.success('Contrato enviado com sucesso!');
      console.log(response.data);
      setContracts([...contracts, response.data]);
    } catch (error) {
      console.error('Erro ao enviar contrato:', error);
      toast.error('Erro ao enviar contrato.');
    }
  };

  return (
    <Box sx={{ width: '100%', typography: 'body1' }}>
          <ToastContainer />

      <Tabs
        value={tabIndex}
        onChange={handleTabChange}
        variant={isMobile ? 'scrollable' : 'fullWidth'}
        sx={{
          backgroundColor: '#6A438B',
          '& .MuiTab-root': { color: '#ededed' },
          '& .MuiTabs-indicator': { backgroundColor: '#6A438B' },
        }}
      >
        <Tab label="Contratos" />
        <Tab label="Novo Contrato" />
        <Tab label="Arquivados" />
      </Tabs>

      {tabIndex === 0 && (
  <Box sx={{ p: 2 }}>
    <Typography variant="h6" gutterBottom>
      Lista de Contratos
    </Typography>

    <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
      <TextField
        label="Filtrar (ID, Título, Status, Email, Data)"
        value={filter}
        onChange={handleFilterChange}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
        fullWidth
      />
    </Box>

    <ContractTable contracts={contracts} filter={filter} />

    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Título</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Criado em</TableCell>
            <TableCell>Atualizado em</TableCell>
            <TableCell>Ações</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
  {contracts
    .filter((contract) => {
      const matchesId = contract.id.toString().includes(filter);
      const matchesTitle = contract.title.toLowerCase().includes(filter.toLowerCase());
      const matchesStatus = contract.status.toLowerCase().includes(filter.toLowerCase());
      const matchesEmail = contract.signers.some(signer => signer.email.toLowerCase().includes(filter.toLowerCase()));
      const matchesDateCreated = contract.createdAt.includes(filter);
      const matchesDateUpdated = contract.updatedAt.includes(filter);
      return matchesId || matchesTitle || matchesStatus || matchesEmail || matchesDateCreated || matchesDateUpdated;
    })
    .map((contract) => (
      <TableRow key={contract.id}>
        <TableCell>{contract.id}</TableCell>
        <TableCell>{contract.title}</TableCell>
        <TableCell>{contract.status}</TableCell>
        <TableCell>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {contract.signers.map((signer, index) => (
              <Tooltip title={`${signer.name} (${signer.email})`} key={signer.email}>
                <Avatar
                  sx={{
                    marginLeft: index > 0 ? '-10px' : '0', // Sobreposição
                    backgroundColor: '#573771', // Cor de fundo
                    color: '#fff', // Cor do texto
                  }}
                >
                  {getInitials(signer.name)}
                </Avatar>
              </Tooltip>
            ))}
          </Box>
        </TableCell>
        <TableCell>{formatDate(contract.createdAt)}</TableCell>
        <TableCell>{formatDate(contract.updatedAt)}</TableCell>
        <TableCell>
          <IconButton aria-label="more" onClick={handleClick}>
            <MoreHorizIcon />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={() => { handleDownload(contract.id); handleClose(); }}>Download</MenuItem>
            <MenuItem onClick={() => { handleView(contract.id); handleClose(); }}>Visualizar</MenuItem>
            <MenuItem onClick={() => { handleArchive(contract.id); handleClose(); }}>Arquivar</MenuItem>
          </Menu>
        </TableCell>
      </TableRow>
    ))}
</TableBody>
      </Table>
    </TableContainer>
  </Box>
)}
      {tabIndex === 1 && (
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Novo Contrato
          </Typography>

          <Stepper activeStep={activeStep} sx={{ mb: 2 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {activeStep === 0 && (
  <Box>
    <TextField
      label="Título do Contrato"
      value={contractTitle}
      onChange={(e) => setContractTitle(e.target.value)}
      fullWidth
      required
    />
    <Typography variant="body1" gutterBottom>
      Envie o Arquivo do contrato. Aceitamos os formatos .docs, .pdf e .docx.
    </Typography>
    <Input
      type="file"
      accept=".pdf, .doc, .docx"
      onChange={handlefileChange}
      inputProps={{ name: 'file', required: true }} 
    />
    {file && <Typography variant="body2">Arquivo selecionado: {file.name}</Typography>}
    <Button variant="contained" sx={{ mt: 2 }} onClick={handleNextStep}>
      Próximo
    </Button>
  </Box>
)}

          {activeStep === 1 && (
            <Box>
              <Typography variant="body1" gutterBottom>
                Insira os assinantes do contrato.
              </Typography>
             
             

              {signers.map((signer, index) => (
  <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
    <TextField
      label="Nome"
      name="name"
      value={signer.name}
      onChange={(event) => handleSignerChange(index, event)}
      sx={{ mr: 1 }}
      required
    />
    <TextField
      label="E-mail"
      name="email"
      value={signer.email}
      onChange={(event) => handleSignerChange(index, event)}
      sx={{ mr: 1 }}
      required
    />
    <TextField
      label="CPF"
      name="cpf"
      value={signer.cpf}
      onChange={(event) => handleSignerChange(index, event)}
      required
    />
    <Box sx={{ display: 'flex', alignItems: 'center', ml: 1 }}>
      <Button
        variant="contained"
        color="primary"
        onClick={() => handleAddSigner()}
        sx={{ minWidth: '40px', marginRight: 1 }}
      >
        <AddIcon />
      </Button>
      <Button
        variant="outlined"
        color="error"
        onClick={() => handleRemoveSigner(index)}
        sx={{ minWidth: '40px' }}
      >
        <RemoveIcon />
      </Button>
    </Box>
  </Box>
))}



              <Box sx={{ display: 'flex', alignItems: 'center', ml: 1 }}>
                <Button variant="outlined" onClick={handleBackStep}>
                  Voltar
                </Button>
                <Button variant="contained" onClick={handleNextStep} sx={{ mr: 1 }}>
                  Próximo
                </Button>
              </Box>
            </Box>
          )}

          {activeStep === 2 && (
            <Box>
              <Typography variant="body1" gutterBottom>
                Confira as informações do contrato antes de enviar.
              </Typography>
              <Typography variant="body2" gutterBottom>
                Arquivo: {file ? file.name : 'Nenhum Arquivo enviado.'}
              </Typography>
              <Typography variant="body2" gutterBottom>
                Assinantes:
              </Typography>
              {signers.map((signer, index) => (
                <Typography key={index} variant="body2">
                  {signer.name} - {signer.cpf} - {signer.email}
                </Typography>
              ))}
              <Button variant="contained" sx={{ mt: 2 }} onClick={handleSubmitContract}>
                Enviar Contrato
              </Button>
              <Button variant="outlined" onClick={handleBackStep} sx={{ mt: 2, ml: 2 }}>
                Voltar
              </Button>
            </Box>
          )}
        </Box>
      )}

      {tabIndex === 2 && (
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Arquivados
          </Typography>
          <Typography variant="body1" gutterBottom>
            Lista de contratos arquivados
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default ContractSigningPlatform;