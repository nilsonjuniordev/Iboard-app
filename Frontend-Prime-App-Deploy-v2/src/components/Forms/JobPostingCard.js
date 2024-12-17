import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent, Typography, Button, Modal, Box, IconButton, Grid } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import CloseIcon from '@mui/icons-material/Close';
import 'react-toastify/dist/ReactToastify.css';

const JobPostingCard = () => {
  const [jobPostings, setJobPostings] = useState([]);
  const [likedJobPostings, setLikedJobPostings] = useState([]);
  const [dislikedJobPostings, setDislikedJobPostings] = useState([]);
  const [selectedJobPosting, setSelectedJobPosting] = useState(null);
  const [open, setOpen] = useState(false);

  const userId = localStorage.getItem('userId'); // Obter o userId do localStorage

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Buscar todas as vagas disponíveis
        const response = await axios.get('/api/jobs/job-postings');
        const availableJobPostings = response.data;

        // Buscar vagas curtidas e dispensadas pelo usuário
        const [likedResponse, dislikedResponse] = await Promise.all([
          axios.get('/api/jobs/job-postings/liked', { params: { userId } }),
          axios.get('/api/jobs/job-postings/disliked', { params: { userId } }),
        ]);

        const likedJobPostings = likedResponse.data;
        const dislikedJobPostings = dislikedResponse.data;

        // Filtrar as vagas disponíveis para remover aquelas que já foram curtidas ou dispensadas
        const filteredJobPostings = availableJobPostings.filter(jobPosting => 
          !likedJobPostings.some(liked => liked.id === jobPosting.id) &&
          !dislikedJobPostings.some(disliked => disliked.id === jobPosting.id)
        );

        setJobPostings(filteredJobPostings);
        setLikedJobPostings(likedJobPostings);
        setDislikedJobPostings(dislikedJobPostings);
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
        toast.error('Erro ao buscar dados.');
      }
    };

    if (userId) {
      fetchData();
    } else {
      toast.error('Usuário não autenticado.');
    }
  }, [userId]);

  const handleOpen = (jobPosting) => {
    setSelectedJobPosting(jobPosting);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedJobPosting(null);
  };

  const handleLike = async () => {
    try {
      await axios.put(`/api/jobs/job-postings/${selectedJobPosting.id}/like`, { userId });
      toast.success('Vaga curtida com sucesso!');
      
      // Atualiza as listas de vagas
      setJobPostings(prev => prev.filter(posting => posting.id !== selectedJobPosting.id));
      setLikedJobPostings(prev => [...prev, selectedJobPosting]);
      setDislikedJobPostings(prev => prev.filter(posting => posting.id !== selectedJobPosting.id));

      handleClose(); // Fechar o modal após curtir
    } catch (error) {
      console.error('Erro ao curtir a vaga:', error);
      toast.error('Erro ao curtir a vaga.');
    }
  };

  const handleDislike = async () => {
    try {
      await axios.put(`/api/jobs/job-postings/${selectedJobPosting.id}/dislike`, { userId });
      toast.info('Vaga dispensada.');
      
      // Atualiza as listas de vagas
      setJobPostings(prev => prev.filter(posting => posting.id !== selectedJobPosting.id));
      setDislikedJobPostings(prev => [...prev, selectedJobPosting]);
      setLikedJobPostings(prev => prev.filter(posting => posting.id !== selectedJobPosting.id));

      handleClose(); // Fechar o modal após dispensar
    } catch (error) {
      console.error('Erro ao dispensar a vaga:', error);
      toast.error('Erro ao dispensar a vaga.');
    }
  };

  return (
    <div>  
      
      <Grid container   justifyContent="center"
    alignItems="center">    
    <Grid item xs={12} sm={6} md={10} sx={{ backgroundColor: '#FBDD23', borderRadius:3, mb:5}}>
      <Typography variant="h5" sx={{ fontWeight:"600",  color: '#6A438B', padding:0.5, mb:0.5, textAlign: 'center', borderRadius:3 }}>
      Curta as vagas e dê um match com os recrutadores! 
  </Typography>
  
  <Typography variant="body2" sx={{ backgroundColor: '#6A438B', color: '#fff', padding:0.5,  textAlign: 'center', mb:3  }}>
  É simples: quando você curte, os recrutadores sabem que você está interessado e entram em contato com novas oportunidades. Vamos fazer esse match acontecer!
  </Typography>  
  </Grid>
   </Grid>


      <Grid container spacing={2}>
      <Grid item xs={12} sm={6} md={12} >

          <Typography variant="body1" sx={{ backgroundColor: '#d1c5db',  color: '#6A438B', textAlign: 'center' , fontWeight:"600"}}>
            Vagas Disponíveis
          </Typography>
          {jobPostings.length === 0 ? (
            <Typography variant="body2" sx={{ textAlign: 'left', marginTop: 4 }}>
              No momento, não há vagas disponíveis. Por favor, volte mais tarde.
            </Typography>
          ) : (
            <Grid container spacing={2} sx={{ padding: 2 }}>
              {jobPostings.map((jobPosting) => (
                <Grid item xs={12} sm={6} md={2} key={jobPosting.id}>
                  <Card sx={{ height: '100%' }}>
                    <CardContent>
                      <Typography variant="body1" sx={{ backgroundColor: '#d1c5db', fontWeight:"600", color: '#000', padding:0.5, mb:0.5, textAlign: 'center'}}>{jobPosting.cargo}</Typography>
                      <Typography variant="subtitle1">{jobPosting.empresa}</Typography>
                      <Typography variant="body2">{jobPosting.tipoLocal}</Typography>
                      <Typography variant="body2">{jobPosting.localidade}</Typography>
                      <Button variant="outlined" onClick={() => handleOpen(jobPosting)} sx={{ marginTop: 2 }}>
                        Ver Detalhes
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
       </Grid>

       <Grid item xs={12} sm={6} md={12}>
          <Typography variant="body1" sx={{ backgroundColor: '#d1c5db', color: '#6A438B', textAlign: 'center', fontWeight:"600"}}>
            Vagas Curtidas
          </Typography>
          {likedJobPostings.length === 0 ? (
            <Typography variant="body2" sx={{ textAlign: 'left', marginTop: 4 }}>
              Você ainda não curtiu nenhuma vaga.
            </Typography>
          ) : (
            <Grid container spacing={2} sx={{ padding: 2 }}>
              {likedJobPostings.map((jobPosting) => (
                <Grid item xs={12} sm={6} md={2} key={jobPosting.id}>
                  <Card sx={{ height: '100%' }}>
                    <CardContent>
                      <Typography variant="body1" sx={{ backgroundColor: '#d1c5db', fontWeight:"600", color: '#000', padding:0.5, mb:0.5, textAlign: 'center'}}>{jobPosting.cargo}</Typography>
                      <Typography variant="subtitle1">{jobPosting.empresa}</Typography>
                      <Typography variant="body2">{jobPosting.tipoLocal}</Typography>
                      <Typography variant="body2">{jobPosting.localidade}</Typography>
                      <Button variant="outlined" onClick={() => handleOpen(jobPosting)} sx={{ marginTop: 2 }}>
                        Ver Detalhes
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
      </Grid>

      <Grid item xs={12} sm={6} md={12}>
          <Typography variant="body1"  sx={{ backgroundColor: '#d1c5db', color: '#6A438B', textAlign: 'center', fontWeight:"600"}}>
            Vagas Dispensadas
          </Typography>
          {dislikedJobPostings.length === 0 ? (
            <Typography variant="body1" sx={{ textAlign: 'left', marginTop: 4 }}>
              Você ainda não dispensou nenhuma vaga.
            </Typography>
          ) : (
            <Grid container spacing={2} sx={{ padding: 2 }}>
              {dislikedJobPostings.map((jobPosting) => (
                <Grid item xs={12} sm={6} md={2} key={jobPosting.id}>
                  <Card sx={{ height: '100%' }}>
                    <CardContent>
                      <Typography variant="body1" sx={{ backgroundColor: '#d1c5db', fontWeight:"600", color: '#000', padding:0.5, mb:0.5, textAlign: 'center'}}>{jobPosting.cargo}</Typography>
                      <Typography variant="subtitle1">{jobPosting.empresa}</Typography>
                      <Typography variant="body2">{jobPosting.tipoLocal}</Typography>
                      <Typography variant="body2">{jobPosting.localidade}</Typography>
                      <Button variant="outlined" onClick={() => handleOpen(jobPosting)} sx={{ marginTop: 2 }}>
                        Ver Detalhes
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
       </Grid>
     

      {selectedJobPosting && (
        <Modal open={open} onClose={handleClose}>
          <Box   sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            height: '90vh',
            minWidth: '90vw',
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
             overflow: 'auto'
          }}>
            <IconButton
              onClick={handleClose}
              sx={{ position: 'absolute', top: 10, right: 10 }}
            >
              <CloseIcon />
            </IconButton>
            <Typography variant="h4" sx={{ p:2}}>{selectedJobPosting.cargo}</Typography>
            <Typography variant="h6" sx={{ p:2}}>Empresa:<br/>{selectedJobPosting.empresa}</Typography>
            <Typography variant="body1" sx={{ p:2}}> Tipo:<br/>{selectedJobPosting.tipoLocal}</Typography>
            <Typography variant="body2" sx={{ p:2}}>
            Localidade da vaga:<br/> {selectedJobPosting.localidade}
            </Typography>
            <Typography variant="body2"sx={{ p:2}}>
            Tipo de vaga:<br/> {selectedJobPosting.tipoVaga}
            </Typography>
            <Typography variant="body2"sx={{ p:2}}>
            Descrição da Vaga:<br/> {selectedJobPosting.descricao}
            </Typography>
            <Typography variant="body2"sx={{ p:2}}>
            Responsabilidades:<br/> {selectedJobPosting.responsabilidades}
            </Typography>

            <Typography variant="body2"sx={{ p:2}}>
            Qualificações:<br/> {selectedJobPosting.qualificacoes}
            </Typography>

            <Box sx={{ marginTop: 2 }}>
            <Grid container spacing={2}>
            <Grid item xs={6} sm={6} md={6} sx={{ p:1 }}>              
              <Button variant="contained" color="secondary" onClick={handleDislike} sx={{ marginLeft: 2 }}>
                Dispensar
              </Button>
                            
              </Grid>
              <Grid item xs={6} sm={6} md={6}>
              <Button variant="contained" color="primary" onClick={handleLike}>
                Curtir
              </Button>              
              </Grid> </Grid>
            </Box>
          </Box>
        </Modal>
      )}
 </Grid>
      <ToastContainer />
    </div>
  );
};



export default JobPostingCard;
