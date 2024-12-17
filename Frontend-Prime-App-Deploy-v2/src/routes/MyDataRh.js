
import React from 'react';
import MyAccountRh from '../components/Account/MyAccountRh';
import SideBarRh from '../components/SideBarRh';
import { Box } from "@mui/material";
import { useTheme } from "@mui/material";

const MyDataRh = () => {
  const theme = useTheme();

  return (
<>
<SideBarRh />
      <Box
        component="main"
        sx={{
          marginTop: 10,p: 3, // Margem para o AppBar
          [theme.breakpoints.down("sm")]: {
            marginTop: 7, // Reduz a margem para dispositivos móveis
          },
        }}
      >
    <Box>
    <MyAccountRh />

      
          </Box>
      </Box>
    </>

    
  );
};

export default MyDataRh;
