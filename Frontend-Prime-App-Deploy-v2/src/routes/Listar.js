import React from "react";
import ViewUsersRH from "../components/ViewUsersRH";
import SideBarRh from "../components/SideBarRh";
import { useTheme } from '@mui/material';
import { Box } from "@mui/material";

const Listar = () => {

  const theme = useTheme();


 

  return (
    <>
    <SideBarRh /> 
      <Box
        component="main"
        sx={{
          marginTop: 7, p: 3, // Margem para o AppBar
          [theme.breakpoints.down('sm')]: {
            marginTop: 7, // Reduz a margem para dispositivos móveis
          },
        }}
      >  
      <Box>   
            
    
        <ViewUsersRH   />
     </Box>
      </Box>
    </>
  );
};

export default Listar;
