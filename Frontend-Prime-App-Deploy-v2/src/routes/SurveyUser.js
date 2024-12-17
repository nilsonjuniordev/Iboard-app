// SurveyUser.js
import React from 'react';
import SurveyDashboard from "../components/DashBoards/SurveyDashboard"
import SideBarUser from "../components/SideBarUser";
import Box from '@mui/material/Box';
import { useTheme, Typography, Card, CardContent, Divider } from '@mui/material';


const SurveyUser = () => {


  
  const theme = useTheme();

  return (
    <>
  <SideBarUser /> 
      <Box
        component="main"
        sx={{
          marginTop: 10, p: 3, // Margem para o AppBar
          [theme.breakpoints.down('sm')]: {
            marginTop: 7, // Reduz a margem para dispositivos móveis
          },
        }}
      >

<Card sx={{ minHeight: "80vh", boxShadow: 5, borderRadius: 3,  bgcolor: '#F4F5FA' }}>
            <CardContent>             
              <Typography variant="h6" align="center">
                Pesquisas de clima
              </Typography>
              <Divider sx={{ mb:1 }} />
              <Typography variant="h6" align="center" sx={{ pb:1}}>
                Resonda as pesquisas e compartilhe
                sua opinião de forma anônima.
              </Typography>
              <Typography variant="body2" align="center" sx={{ pb:1}}>
               Suas respostas são confidenciais e
                fundamentais para melhorar continuamente nossos processos e
                ambiente de trabalho.
              </Typography>
              <SurveyDashboard />
            </CardContent>
          </Card>
      </Box></>
    
  );
};

export default SurveyUser;
