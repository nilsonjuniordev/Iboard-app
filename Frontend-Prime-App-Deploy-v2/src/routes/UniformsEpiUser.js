// UniformsEpiUser.js
import React from 'react';
import UniformsEpiDashboard from "../components/DashBoards/UniformsEpiDashboard"
import SideBarUser from "../components/SideBarUser";
import Box from '@mui/material/Box';
import { useTheme, Typography, Card, CardContent, Divider } from '@mui/material';


const UniformsEpiUser = () => {


  
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

<Card sx={{ minHeight: "400px", boxShadow: 5, borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6" align="center">
              Uniformes e EPI's disponíveis
              </Typography>
              <Divider sx={{ mb:1 }} />


              <UniformsEpiDashboard />


           
            </CardContent>
          </Card>

      </Box></>
    
  );
};

export default UniformsEpiUser;
