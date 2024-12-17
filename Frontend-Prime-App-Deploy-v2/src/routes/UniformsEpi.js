// UniformsEpi.js
import React from 'react';
import UniformsEpiCreator from '../components/UniformsEpiCreator';
import SideBarRh from "../components/SideBarRh";
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material';


const UniformsEpi = () => {


  
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

      
      <UniformsEpiCreator  />
      </Box></>
    
  );
};

export default UniformsEpi;
