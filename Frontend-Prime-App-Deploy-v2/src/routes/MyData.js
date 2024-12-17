// MyData.js
import React from 'react';
import MyAccountUser from '../components/Account/MyAccountUser';
import SideBarUser from '../components/SideBarUser';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material';


const MyData = ({ userId }) => {

  console.log('userId no MyData:', userId);
  
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

      
      <MyAccountUser iduser={userId} />
      </Box></>
    
  );
};

export default MyData;
