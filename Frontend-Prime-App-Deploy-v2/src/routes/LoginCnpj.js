import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import {
  useTheme,
  Box,
  Typography,
  Grid,
  TextField,
  Button,
} from "@mui/material";

const LoginCnpj = () => {
  const [nome, setNome] = useState("");
  const [pass, setPass] = useState("");
  const [loginError, setLoginError] = useState("");
  const navigate = useNavigate();
  const theme = useTheme();

  const handleNomeChange = (e) => {
    setNome(e.target.value.toUpperCase());
  };

  const handlePassChange = (e) => {
    setPass(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("/api/loginCnpj", {
        nome,
        pass,
      });

      const { userId } = response.data;

      if (userId !== undefined) {
        localStorage.setItem("specificToken", response.data.token);
        localStorage.setItem("userId", userId);

        navigate("/DashboardRh");
        window.location.reload();
      } else {
        setLoginError(
          <div className="alertRed">
            Credenciais inválidas. Verifique nome e Senha.
          </div>
        );
        console.error("ID do usuário não fornecido na resposta do servidor.");
      }
    } catch (error) {
      setLoginError(
        <div className="alertRed">
          Credenciais inválidas. Verifique nome e Senha.
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
        [theme.breakpoints.down("sm")]: {
          height: "auto",
        },
      }}
    >
      <Grid xs={12} sm={12} md={8}>
        <Box
          className="ContainerDefaultRh"
          sx={{
            [theme.breakpoints.down("sm")]: {
              p: 3,
            },
          }}
        >
          <img
            className="LogoInt"
            src="/assets/iboard-logo-sfundo.png"
            alt=""
          />

          <Typography
            sx={{
              width: "70%",
              color: "white",
              textAlign: "center",
              mt: 2,
              [theme.breakpoints.down("sm")]: {
                width: "100%",
              },
            }}
          >
            Seja bem-vindo, recrutador! Estamos felizes em tê-lo conosco.
            Aproveite nossa plataforma para encontrar os melhores talentos e
            impulsionar o sucesso da sua equipe.
          </Typography>
        </Box>
      </Grid>

      <Grid
        xs={12}
        sm={12}
        md={4}
        sx={{
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box component="form" onSubmit={handleSubmit} sx={{ p: 3 }}>
          <Typography variant="h4">Login</Typography>
          <Typography color="text.secondary" variant="body2" sx={{ mb: 3 }}>
            Ainda não realizou o cadastro?
            <Link to="/RegisterCnpj"> cadastre-se agora!</Link>
          </Typography>

          <TextField
            fullWidth
            label="Nome completo"
            type="text"
            id="nome"
            value={nome}
            onChange={handleNomeChange}
            placeholder="Digite o nome de cadastro"
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label="Senha"
            type="password" // Alterado para tipo password para ocultar a senha
            id="pass"
            value={pass} // Alterado para pegar a senha do estado
            onChange={handlePassChange} // Adicionado para atualizar o estado da senha
            placeholder="Digite a senha"
            sx={{ mb: 2 }}
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

export default LoginCnpj;
