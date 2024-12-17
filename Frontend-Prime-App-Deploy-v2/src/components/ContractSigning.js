import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Box, Typography, Button, Grid, TextField } from '@mui/material';
import { Document, Page } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import { pdfjs } from 'react-pdf';

// Configurar o worker do PDF.js
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const ContractSigning = () => {
  const { contractId } = useParams();
  const [contract, setContract] = useState(null);
  const [signerInfo, setSignerInfo] = useState({ name: '', email: '', cpf: '' });
  const [numPages, setNumPages] = useState(null);
  const [pdfUrl, setPdfUrl] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchContract = async () => {
      try {
        const response = await axios.get(`/api/contracts/${contractId}`);
        const documentPath = response.data.documentPath.replace(/\\/g, '/');
        setPdfUrl(`/api/${documentPath}`);
        setContract(response.data);
      } catch (error) {
        console.error('Erro ao buscar contrato:', error);
        setError('Erro ao carregar o contrato.');
      }
    };

    fetchContract();
  }, [contractId]);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const handleSign = async () => {
    try {
      const response = await axios.post(`/api/contracts/${contractId}/sign`, signerInfo);
      alert('Contrato assinado com sucesso!');
      console.log('Resposta da assinatura:', response.data); // Use a resposta se necessário
    } catch (error) {
      console.error('Erro ao assinar contrato:', error);
      setError('Erro ao assinar o contrato.');
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      {error && <Typography color="error">{error}</Typography>}
      {contract && (
        <Grid container spacing={2}>
          <Grid item xs={12} md={8}>
            <Grid container spacing={2} alignItems="center">
              <Grid item>
                <Typography variant="h5">{contract.title}</Typography>
              </Grid>
              <Grid item>
                <Typography variant="h5"> | Status: {contract.status} | </Typography>
              </Grid>
              <Grid item>
                <Button
                  variant="outlined"
                  onClick={() => window.open(pdfUrl, '_blank')} // Abre o PDF em uma nova aba
                  sx={{ mb: 2, width: 'auto' }}
                >
                  Visualizar Documento
                </Button>
              </Grid>
            </Grid>
            {pdfUrl ? (
              <Box sx={{ border: '2px solid #ccc', boxShadow:'5', p :2 , borderRadius: '4px', overflow: 'hidden', maxHeight: '80vh', overflowY: 'auto' }}>
                <Document  
                  file={pdfUrl}
                  onLoadSuccess={onDocumentLoadSuccess}
                  onLoadError={(error) => {
                    console.error('Erro ao carregar PDF:', error);
                    setError('Erro ao carregar o PDF.');
                  }}
                >
                  {Array.from(new Array(numPages), (el, index) => (
                    <Page key={`page_${index + 1}`} pageNumber={index + 1} width={window.innerWidth * 0.590} />
                  ))}
                </Document>
              </Box>
            ) : (
              <Typography variant="body1">Carregando Contrato...</Typography>
            )}
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="h6">Assinante:</Typography>
            <TextField
              fullWidth
              label="Nome"
              value={signerInfo.name}
              onChange={(e) => setSignerInfo({ ...signerInfo, name: e.target.value })}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Email"
              value={signerInfo.email}
              onChange={(e) => setSignerInfo({ ...signerInfo, email: e.target.value })}
              margin="normal"
            />
            <TextField
              fullWidth
              label="CPF"
              value={signerInfo.cpf}
              onChange={(e) => setSignerInfo({ ...signerInfo, cpf: e.target.value })}
              margin="normal"
            />
            <Button variant="contained" onClick={handleSign} sx={{ mt: 2 }}>
              Assinar Contrato
            </Button>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default ContractSigning;