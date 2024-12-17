import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Menu, MenuItem } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useNavigate } from 'react-router-dom'; // Importando useNavigate

const UserContracts = () => {
  const [contracts, setContracts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedContractId, setSelectedContractId] = useState(null);
  const navigate = useNavigate(); // Usando useNavigate

  useEffect(() => {
    const fetchUserContracts = async () => {
      const userId = localStorage.getItem('userId');

      if (!userId) {
        setError('User ID não encontrado. Faça login novamente.');
        setLoading(false);
        return;
      }

      try {
        // Obter dados do usuário
        const userResponse = await axios.get(`/api/${userId}`);
        const userEmail = userResponse.data.email;

        // Buscar contratos associados ao email do usuário
        const contractsResponse = await axios.get('/api/contracts');
        const userContracts = contractsResponse.data.filter(contract => 
          contract.signers.some(signer => signer.email.trim().toLowerCase() === userEmail.trim().toLowerCase())
        );

        setContracts(userContracts);
      } catch (error) {
        console.error('Erro ao buscar contratos:', error);
        setError('Erro ao carregar contratos.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserContracts();
  }, []);

  const handleMenuClick = (event, contractId) => {
    setAnchorEl(event.currentTarget);
    setSelectedContractId(contractId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDownload = () => {
    const contract = contracts.find(c => c.id === selectedContractId);
    if (contract) {
      const downloadUrl = `/api/${contract.documentPath}`;
      window.open(downloadUrl, '_blank');
    }
    handleMenuClose();
  };

  const handleSign = () => {
    navigate(`/sign/${selectedContractId}`); // Usando navigate para redirecionar
    handleMenuClose();
  };

  if (loading) {
    return <Typography variant="body1">Carregando contratos...</Typography>;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Meus Contratos
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Título</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Criado em</TableCell>
              <TableCell>Atualizado em</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {contracts.map(contract => (
              <TableRow key={contract.id}>
                <TableCell>{contract.id}</TableCell>
                <TableCell>{contract.title}</TableCell>
                <TableCell>{contract.status}</TableCell>
                <TableCell>{new Date(contract.createdAt).toLocaleString('pt-BR')}</TableCell>
                <TableCell>{new Date(contract.updatedAt).toLocaleString('pt-BR')}</TableCell>
                <TableCell>
                  <IconButton onClick={(event) => handleMenuClick(event, contract.id)}>
                    <MoreVertIcon />
                  </IconButton>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl) && selectedContractId === contract.id}
                    onClose={handleMenuClose}
                  >
                    <MenuItem onClick={handleDownload}>Baixar Contrato</MenuItem>
                    <MenuItem onClick={handleSign}>Assinar Contrato</MenuItem>
                  </Menu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default UserContracts;