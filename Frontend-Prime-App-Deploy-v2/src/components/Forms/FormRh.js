import axios from "axios";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import InputMask from "react-input-mask";
import { Box, FormControlLabel, FormGroup, Checkbox, Button, TextField, Grid, Typography, CardActions, Divider } from "@mui/material";
import { useNavigate } from "react-router-dom";

const FormRh = () => {
  const [numeroTelefone, setNumeroTelefone] = useState("");
  const [userData, setUserData] = useState({
    nome: "",
    email: "",
    fone: "",
    cpf: "",
    id_cnpj: "",
    pass: '1234',
  });
  const [documentosSelecionados, setDocumentosSelecionados] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = localStorage.getItem("userId");
        const response = await axios.get(`/api/${userId}`);
        const userDataFromApi = response.data;
        setUserData((prevUserData) => ({
          ...prevUserData,
          id_cnpj: userDataFromApi.id_cnpj || "",
        }));
      } catch (error) {
        console.error("Erro ao buscar dados do usuário:", error);
      }
    };

    fetchUserData();
  }, []);

  const handleChange = (e) => {
    setNumeroTelefone(e.target.value);
    setUserData({ ...userData, fone: e.target.value });
  };

  const handleCPFChange = (e) => {
    const maskedCPF = e.target.value
      .replace(/[^\d]+/g, "")
      .replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
    setUserData({ ...userData, cpf: maskedCPF });
  };

  const handleDocumentChange = (e) => {
    const { value } = e.target;
    if (e.target.checked) {
      setDocumentosSelecionados([...documentosSelecionados, value]);
    } else {
      setDocumentosSelecionados(documentosSelecionados.filter((doc) => doc !== value));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userDataUpperCase = Object.keys(userData).reduce((acc, key) => {
      acc[key] = userData[key].toUpperCase();
      return acc;
    }, {});

    const requiredFields = ["nome", "email", "fone", "cpf"];
    if (requiredFields.some((field) => !userDataUpperCase[field])) {
      return toast.warn("Preencha todos os campos corretamente!");
    }

    try {
      const docsString = documentosSelecionados.join(",");
      const response = await axios.post("/api/register", {
        ...userDataUpperCase,
        docs: docsString,
      });
      const { message } = response.data;

      toast.success(message);

      setUserData({
        nome: "",
        email: "",
        fone: "",
        cpf: "",
        id_cnpj: userData.id_cnpj,
      });
      setNumeroTelefone("");
      setDocumentosSelecionados([]);

      const { email } = userData;

      await axios.post("/api/mail", {
        to: email,
        subject: "Processo de Exame ASO",
        text: "Seja bem-vindo colaborador, acesse https://flexit.site/loginUser e faça o login com seu nome completo e CPF para continuar seu processo de exame.",
      });
    } catch (error) {
      console.error("Erro no handleSubmit:", error);
      toast.error("Erro ao enviar cadastro. Verifique o console para mais detalhes.");
    }

    navigate("/RegisterRH");
    window.location.reload();
  };

  const documentos = [
    "C.T.P.S - com baixa do último emprego",
    "Proposta de trabalho asssinada",
    "R.G. Identidade",
    "Título eleitoral",
    "Reservista",
    "C.P.F.",
    "Certidão de nascimento (Solteiro)",
    "Certidão de casamento",
    "Certidão de nascimento dos filhos",
    "Cartão do PIS",
    "Carteira de vacinação dos filhos menores de 14 anos",
    "C.N.H. Habilitação",
    "Comprovante de endereço",
    "Foto 3x4",
    "Diploma de graduação",
    "Registro no conselho de sua categoria profissional",
    "Número de Conta corrente",
  ];

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ p: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            Informações Pessoais
          </Typography>
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Nome completo"
            placeholder="Digite o Nome completo"
            value={userData.nome}
            onChange={(e) => setUserData({ ...userData, nome: e.target.value })}
            sx={{ mb: 2 }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="E-mail"
            type="email"
            placeholder="Digite o E-mail"
            value={userData.email}
            onChange={(e) => setUserData({ ...userData, email: e.target.value })}
            sx={{ mb: 2 }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <InputMask
            mask="(99) 99999-9999"
            value={numeroTelefone}
            onChange={handleChange}
          >
            {() => (
              <TextField
                fullWidth
                label="Telefone"
                placeholder="Digite o telefone"
                sx={{ mb: 2 }}
              />
            )}
          </InputMask>
        </Grid>
        <Grid item xs={12} md={6}>
          <InputMask
            mask="999.999.999-99"
            value={userData.cpf}
            onChange={handleCPFChange}
          >
            {() => (
              <TextField
                fullWidth
                label="CPF"
                placeholder="Digite o CPF"
                sx={{ mb: 2 }}
              />
            )}
          </InputMask>
        </Grid>
      </Grid>

      <Grid container spacing={2} >
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            Documentos Necessários
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <FormGroup row>
            {documentos.map((doc, index) => (
              <FormControlLabel
                key={index}
                control={
                  <Checkbox
                    value={doc}
                    onChange={handleDocumentChange}
                    sx={{
                      '&.Mui-checked': {
                        color: '#633687', // Cor do ícone quando o checkbox está marcado
                      },
                      '&.MuiCheckbox-root': {
                        '&:hover': {
                          backgroundColor: 'rgba(0, 0, 0, 0.04)', // Cor de fundo quando hover
                        },
                      },
                    }}
                  />
                }
                label={doc}
              />
            ))}
          </FormGroup>
        </Grid>
      </Grid>
      <Divider  />
      <CardActions> 
      <Button variant="contained" color="primary" type="submit"   sx={{ backgroundColor: "#633687", color: "white", padding: "15px", mt:2 }}>
        Adicionar Colaborador
      </Button>
      </CardActions> 
    </Box>
  );
};

export default FormRh;
