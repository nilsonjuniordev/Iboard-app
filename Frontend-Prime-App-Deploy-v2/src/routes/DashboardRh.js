import React, { useEffect, useState } from "react";
import SideBarRh from "../components/SideBarRh";
import "../styles/styles.css";
import Dashboard from "../components/DashBoards/DashBoard";
import { useTheme } from "@mui/material";
import { Box } from "@mui/material";

const DashboardRh = () => {
  const [userName, setUserName] = useState("");

  const theme = useTheme();

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    fetch(`/api/${userId}`)
      .then((response) => response.json())
      .then((data) => {
        const name = data.nome;

        setUserName(name);
      })
      .catch((error) => {
        console.error("Erro ao obter dados do usuário:", error);
      });
  }, []);

  return (
    <>
      <SideBarRh />
      <Box
        component="main"
        sx={{
          marginTop: 7,p: 3, // Margem para o AppBar
          [theme.breakpoints.down("sm")]: {
            marginTop: 7, // Reduz a margem para dispositivos móveis
          },
        }}
      >
    <Box>
          <div>
            <h3>
              <b>Bem vindo, {userName || "visitante"}</b>
            </h3>
      
          </div>

          <Dashboard />
          </Box>
      </Box>
    </>
  );
};

export default DashboardRh;
