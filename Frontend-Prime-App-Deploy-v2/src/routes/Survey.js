// Survey.js
import React from 'react';
import SurveyCreator from '../components/SurveyCreator';
import SideBarRh from "../components/SideBarRh";
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material';


const Survey = () => {


  
  const theme = useTheme();

  return (
    <>
  <SideBarRh /> 
      <Box
        component="main"
        sx={{
          marginTop: 10, p: 3, // Margem para o AppBar
          [theme.breakpoints.down('sm')]: {
            marginTop: 7, // Reduz a margem para dispositivos móveis
          },
        }}
      >

      
      <SurveyCreator />
      </Box></>
    
  );
};

export default Survey;
