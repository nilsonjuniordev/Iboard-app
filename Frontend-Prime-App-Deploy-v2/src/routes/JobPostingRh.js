// DashboardUser.js
import React from "react";
import "../styles/styles.css";
import SideBarRh from "../components/SideBarRh";
import JobPostingsByRecruiter  from "../components/JobPostingsByRecruiter";
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material';

const JobPosting = ({ toggleTheme }) => {
  const theme = useTheme();

  return (
    <>
      <SideBarRh /> 
      <Box
        component="main"
        sx={{
            marginTop: 10, p: 3, // Margem para o AppBar
          [theme.breakpoints.down('sm')]: {
            marginTop: 10, // Reduz a margem para dispositivos móveis
          },
        }}
      >
     
        <JobPostingsByRecruiter  />
      </Box>
    </>
  );
};

export default JobPosting;
