import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { useTheme, Box, Typography, Grid, TextField, Button } from "@mui/material";

const Login = () => {
  const [nome, setNome] = useState("");
  const [cpf, setCPF] = useState("");
  const [loginError, setLoginError] = useState("");
  const navigate = useNavigate();
  const theme = useTheme();

  const formatCPF = (inputCPF) => {
    const numericCPF = inputCPF.replace(/\D/g, "");
    return numericCPF.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  };

  const handleNomeChange = (e) => {
    setNome(e.target.value.toUpperCase());
  };

  const handleCPFChange = (e) => {
    const numericCPF = e.target.value.replace(/\D/g, "");
    if (numericCPF.length <= 11) {
      setCPF(formatCPF(numericCPF));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("/api/login", {
        nome,
        cpf,
      });

      const { token, userId } = response.data;

      // Adicione logs para depuração
      console.log("Token recebido após o login:", token);
      console.log("ID do usuário recebido após o login:", userId);

      // Verifique se o ID do usuário é definido antes de armazenar
      if (userId !== undefined) {
        // Armazenar o token e o ID do usuário no localStorage
        localStorage.setItem("token", token);
        localStorage.setItem("userId", userId);

        // Redirecionar o usuário para a rota desejada
        navigate("/DashboardUser");
        window.location.reload();
      } else {
        setLoginError(
          <div className="alertRed">
            Credenciais inválidas. Verifique nome e CPF.
          </div>
        );
        console.error("ID do usuário não fornecido na resposta do servidor.");
      }
    } catch (error) {
      setLoginError(
        <div className="alertRed">
          Credenciais inválidas. Verifique nome e CPF.
        </div>
      );
      console.error("Erro ao realizar login:", error.message);
    }
  };

  return (
    <Grid
      container  
      sx={{       
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        [theme.breakpoints.down('sm')]:{ 
          height:"auto"
        }
      }}
    >
      <Grid  xs={12} sm={12} md={8}>
        <Box className="ContainerDefaultUser" sx={{  
          [theme.breakpoints.down('sm')]:{ 
           
            p:3
          },}}>
          <img
            className="LogoInt"
            src="/assets/iboard-logo-sfundo.png"
            alt=""
          />

         

          <Typography            
            sx={{width:'70%', color: "white", textAlign: "center", mt: 2,
             [theme.breakpoints.down('sm')]:{ 
              width:'100%',             
            } }}
          >
            Seja muito bem-vindo Colaborador! Estamos entusiasmados em tê-lo
            conosco. Vamos iniciar juntos um processo de admissão repleto de
            oportunidades e desafios emocionantes. Estamos ansiosos
            para ver você brilhar em nossa equipe!
          </Typography>
        </Box>
      </Grid>

      <Grid  xs={12} sm={12} md={4}  sx={{       
        justifyContent: "center",
        alignItems: "center",
   
      }}>
        <Box component="form" onSubmit={handleSubmit} sx={{  p:3}}>
          <Typography variant="h4">Login</Typography>
          <Typography color="text.secondary" variant="body2"  sx={{  mb:3}} >
         
              Ainda não realizou o cadastro?    <Link to="/register">cadastre-se agora!
            </Link>
          </Typography>

         

  <TextField
              fullWidth
              label="Nome completo"
              type="text"
              id="nome"
              value={nome}
              onChange={handleNomeChange}
              placeholder="Nome completo"
              sx={{  mb:2}} 
            />

            <TextField
              fullWidth
              label="CPF"
              type="text"
              id="cpf"
              value={cpf}
              maxLength={14}
              onChange={handleCPFChange}
              placeholder="Digite seu CPF"
              sx={{  mb:2}} 
            />
         
         
            <Button
              fullWidth
              color="primary"
              type="submit"
              sx={{
                backgroundColor: "#633687",
                color: "white",
                padding: "15px",
              }}
            >
              Entrar
            </Button>
            {loginError && <p className="errorMessage">{loginError}</p>}
         
        </Box>
      </Grid>


    </Grid>
  );
};

export default Login;
