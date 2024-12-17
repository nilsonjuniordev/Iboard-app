import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent, Typography, Grid, Box, Button, Modal } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const JobPostingsByRecruiter = () => {
  const [jobPostings, setJobPostings] = useState([]);
  const [selectedJobPosting, setSelectedJobPosting] = useState(null);
  const [likesUsers, setLikesUsers] = useState([]);
  const [dislikesUsers, setDislikesUsers] = useState([]);
  const [userCurriculum, setUserCurriculum] = useState(null);
  const [showCurriculumModal, setShowCurriculumModal] = useState(false);
  const [showJobModal, setShowJobModal] = useState(false);

  const adminUserId = localStorage.getItem('userId'); // ID do admin

  useEffect(() => {
    const fetchJobPostings = async () => {
      try {
        const userResponse = await axios.get(`/api/${adminUserId}`);
        const id_cnpj = userResponse.data.id_cnpj;

        const response = await axios.get('/api/jobs/job-postings', {
          params: { id_cnpj: id_cnpj },
        });
        setJobPostings(response.data);
      } catch (error) {
        console.error('Erro ao buscar vagas:', error);
        toast.error('Erro ao buscar vagas.');
      }
    };

    fetchJobPostings();
  }, [adminUserId]);

  const fetchUserDetails = async (userIds) => {
    try {
      const userRequests = userIds.map((id) => axios.get(`/api/${id}`));
      const userResponses = await Promise.all(userRequests);
  
      const userIdsToFetchCurriculums = userResponses.map(response => response.data.id);
  
      const curriculumsRequests = userIdsToFetchCurriculums.map(userId =>
        axios.get('/api/curriculums', {
          params: { userId: userId },
          headers: { 'Cache-Control': 'no-cache' }
        })
      );
      const curriculumsResponses = await Promise.all(curriculumsRequests);
  
      const userDetailsWithCurriculum = userResponses.map((response, index) => {
        const curriculum = curriculumsResponses[index]?.data?.find(curriculum => curriculum.userId === response.data.id);
        return {
          user: response.data,
          curriculum: curriculum || null
        };
      });
  
      return userDetailsWithCurriculum;
    } catch (error) {
      console.error('Erro ao buscar detalhes dos usuários e currículos:', error);
      toast.error('Erro ao buscar detalhes dos usuários e currículos.');
      return [];
    }
  };
  
  const handleOpenDetails = async (jobPosting) => {
    try {
      const response = await axios.get(`/api/jobs/job-postings/${jobPosting.id}`);
      setSelectedJobPosting(response.data);
  
      const likesUsers = await fetchUserDetails(response.data.likes);
      const dislikesUsers = await fetchUserDetails(response.data.dislikes);
  
      setLikesUsers(likesUsers);
      setDislikesUsers(dislikesUsers);
      setShowJobModal(true); // Abre o modal para detalhes da vaga
    } catch (error) {
      console.error('Erro ao buscar detalhes da vaga:', error);
      toast.error('Erro ao buscar detalhes da vaga.');
    }
  };
  
  const handleOpenCurriculum = async (userId) => {
    if (!userId) {
      toast.error('ID do usuário não está disponível.');
      return;
    }
  
    try {
      const response = await axios.get('/api/curriculums', {
        params: { userId: userId }
      });
  
      const curriculum = response.data.find(curriculum => curriculum.userId === userId);
      
      if (curriculum) {
        setUserCurriculum(curriculum);
        setShowCurriculumModal(true);
      } else {
        toast.error('Currículo não encontrado.');
      }
    } catch (error) {
      console.error('Erro ao buscar currículo do usuário:', error);
      toast.error('Erro ao buscar currículo do usuário.');
    }
  };
  

  const handleCloseCurriculumModal = () => {
    setShowCurriculumModal(false);
    setUserCurriculum(null);
  };

  const handleCloseJobModal = () => {
    setShowJobModal(false);
    setSelectedJobPosting(null);
  };

  return (
    <div>

<Grid container   justifyContent="center"
    alignItems="center">    
    <Grid item xs={12} sm={6} md={10} sx={{ backgroundColor: '#FBDD23', borderRadius:3, mb:5}}>
      <Typography variant="h5" sx={{ fontWeight:"600",  color: '#6A438B', padding:0.5, mb:0.5, textAlign: 'center', borderRadius:3 }}>
      Dê um match com os colaboradores! 
  </Typography>
  
  <Typography variant="body2" sx={{ backgroundColor: '#6A438B', color: '#fff', padding:0.5,  textAlign: 'center', mb:3  }}>
  Conecte-se com as pessoas certas para impulsionar o sucesso da sua equipe. Vamos fazer esse matching acontecer!
  </Typography>  
  </Grid>
   </Grid>


         <Typography variant="body1"  sx={{ backgroundColor: '#d1c5db', color: '#6A438B', textAlign: 'center', fontWeight:"600"}}>
        Vagas Criadas
      </Typography>
      <Grid container spacing={2} sx={{ padding: 2 }}>
        {jobPostings.length === 0 ? (
          <Typography variant="h6" sx={{ textAlign: 'center', marginTop: 4 }}>
            Nenhuma vaga criada.
          </Typography>
        ) : (
          jobPostings.map((jobPosting) => (
            <Grid item xs={12} sm={6} md={2} key={jobPosting.id}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                <Typography variant="body1" sx={{ backgroundColor: '#d1c5db', fontWeight:"600", color: '#000', padding:0.5, mb:0.5, textAlign: 'center'}}>{jobPosting.cargo}</Typography>
                  <Typography variant="subtitle1">{jobPosting.empresa}</Typography>
                  <Typography variant="body2">{jobPosting.tipoLocal}</Typography>
                  <Typography variant="body2">{jobPosting.localidade}</Typography>
                  <Button
                    variant="outlined"
                    onClick={() => handleOpenDetails(jobPosting)}
                    sx={{ marginTop: 2 }}
                  >
                    Ver matching
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))
        )}
      </Grid>

      {/* Modal para exibir detalhes da vaga */}
      <Modal open={showJobModal} onClose={handleCloseJobModal}>
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
          {selectedJobPosting && (
            <>
              <Typography variant="h6">Detalhes da Vaga</Typography>
              <Typography>Cargo: {selectedJobPosting.cargo}</Typography>
              <Typography>Empresa: {selectedJobPosting.empresa}</Typography>
              <Typography>Localidade: {selectedJobPosting.localidade}</Typography>
              <Typography>Tipo de Local: {selectedJobPosting.tipoLocal}</Typography>
              <Typography>Descrição: {selectedJobPosting.descricao}</Typography>
              
              <Typography variant="body1" sx={{ backgroundColor: '#d1c5db', color: '#6A438B', textAlign: 'center', fontWeight:"600", mt:2}}>Deu Match</Typography>
              {likesUsers.length === 0 ? (
                <Typography variant="body1">Nenhum usuário curtiu esta vaga.</Typography>
              ) : (
                likesUsers.map(({ user, curriculum }) => (
                  <Grid container>
                   <Grid item xs={12} sm={6} md={2} key={user.id} sx={{ mt: 2, mb: 2, p: 2, border: '1px solid #ccc', borderRadius: 2 }}>
                    <Typography variant="body1">Nome: {user.nome}</Typography>
                    <Typography variant="body2">Cidade: {user.cidade}</Typography>
                    <Typography variant="body2">Email: {user.email}</Typography>
                    <Button
                      variant="outlined"
                      onClick={() => handleOpenCurriculum(user.id)}
                      sx={{ mt: 1 }}
                    >
                      Ver Currículo
                    </Button>
                    </Grid></Grid>
                ))
              )}
              
              <Typography variant="body1" sx={{ backgroundColor: '#d1c5db', color: '#6A438B', textAlign: 'center', fontWeight:"600", mt:2}}>Colaboradores disponiveis:</Typography>
              {dislikesUsers.length === 0 ? (
                <Typography variant="body1">Nenhum usuário dispensou esta vaga.</Typography>
              ) : (
                dislikesUsers.map(({ user, curriculum }) => (
               <Grid container>
                  <Grid item xs={12} sm={6} md={2} key={user.id}  sx={{ mt: 2, mb: 2, p: 2, border: '1px solid #ccc', borderRadius: 2 }}>
                    <Typography variant="body1">Nome: {user.nome}</Typography>
                    <Typography variant="body2">Cidade: {user.cidade}</Typography>
                    <Typography variant="body2">Email: {user.email}</Typography>
                    <Button
                      variant="outlined"
                      onClick={() => handleOpenCurriculum(user.id)}
                      sx={{ mt: 1 }}
                    >
                      Ver Currículo
                    </Button>
                    </Grid></Grid>
                ))
              )}

              <Button variant="contained" onClick={handleCloseJobModal} sx={{ mt: 2 }}>
                Fechar
              </Button>
            </>
          )}
        </Box>
      </Modal>

      {/* Modal para exibir currículo do usuário */}
      <Modal open={showCurriculumModal} onClose={handleCloseCurriculumModal}>
        <Box sx={{ p: 4, bgcolor: 'background.paper', maxWidth: 600, margin: 'auto', marginTop: '10%' }}>
          <Typography variant="h6">Currículo</Typography>
          {userCurriculum ? (
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6">Dados Pessoais:</Typography>
              <Typography>Nome: {userCurriculum.nome}</Typography>
              <Typography>Email: {userCurriculum.email}</Typography>
              <Typography>Telefone: {userCurriculum.fone}</Typography>
              {/* Continue a exibir outros campos do currículo conforme necessário */}
              <Button variant="contained" onClick={handleCloseCurriculumModal} sx={{ mt: 2 }}>
                Fechar
              </Button>
            </Box>
          ) : (
            <Typography>Currículo não encontrado.</Typography>
          )}
        </Box>
      </Modal>

      <ToastContainer />
    </div>
  );
};

export default JobPostingsByRecruiter;
