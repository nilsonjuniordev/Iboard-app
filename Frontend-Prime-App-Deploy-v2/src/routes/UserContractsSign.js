// DashboardUser.js
import React from "react";
import "../styles/styles.css";
import SideBarUser from "../components/SideBarUser";
import UserContracts from "../components/UserContracts";
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material';

const UserContractsSign = ({ toggleTheme }) => {
  const theme = useTheme();

  return (
    <>
      <SideBarUser /> 
      <Box
        component="main"
        sx={{
            marginTop: 10, p: 3, // Margem para o AppBar
          [theme.breakpoints.down('sm')]: {
            marginTop: 10, // Reduz a margem para dispositivos móveis
          },
        }}
      >
     
        <UserContracts  />
      </Box>
    </>
  );
};

export default UserContractsSign;
