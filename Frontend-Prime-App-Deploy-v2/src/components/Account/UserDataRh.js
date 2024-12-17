import React, { useEffect, useState } from "react";
import axios from "axios";
import InputMask from "react-input-mask";
import { Box, Typography, Grid, TextField, Button } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const UserDataRh = () => {
  const [userData, setUserData] = useState({
    iduser: null,
    nome: "",
    email: "",
    fone: "",
    cep: "",
    rua: "",
    numero: "",
    complemento: "",
    cidade: "",
    estado: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadAddress = async (cep) => {
    try {
      const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
      const { logradouro, localidade, uf } = response.data;
      setUserData((prevUserData) => ({
        ...prevUserData,
        rua: logradouro.toUpperCase(),
        cidade: localidade.toUpperCase(),
        estado: uf.toUpperCase(),
      }));
    } catch (error) {
      toast.error("Erro ao buscar endereço pelo CEP");
      console.error("Erro ao buscar endereço pelo CEP:", error);
    }
  };

  const handleCEPChange = (e) => {
    const formattedCEP = e.target.value.replace(/[^\d]+/g, "");
    setUserData({ ...userData, cep: formattedCEP });
  };

  const handleCEPBlur = () => {
    if (userData.cep.length === 8) {
      loadAddress(userData.cep);
    }
  };


   const handleFormSubmit = async (e) => {
    e.preventDefault();
    const { nome, email, fone, cep, rua, numero, cidade, estado } = userData;

    let hasError = false;

    if (!nome) {
      toast.error("Nome é obrigatório.");
      hasError = true;
    }
    if (!email) {
      toast.error("Email é obrigatório.");
      hasError = true;
    }
    if (!fone) {
      toast.error("Telefone é obrigatório.");
      hasError = true;
    }
    if (!cep) {
      toast.error("CEP é obrigatório.");
      hasError = true;
    }
    if (!rua) {
      toast.error("Rua é obrigatória.");
      hasError = true;
    }
    if (!numero) {
      toast.error("Número é obrigatório.");
      hasError = true;
    }
    if (!cidade) {
      toast.error("Cidade é obrigatória.");
      hasError = true;
    }
    if (!estado) {
      toast.error("Estado é obrigatório.");
      hasError = true;
    }

    if (hasError) {
      return;
    }

    try {
      const userId = localStorage.getItem('userId');
      await axios.put(`/api/${userId}`, userData);
      toast.success("Dados do usuário atualizados com sucesso.");
    } catch (error) {
      toast.error("Erro ao atualizar dados do usuário.");
      console.error('Erro ao atualizar dados do usuário:', error);
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = localStorage.getItem("userId");
        if (userId) {
          const response = await axios.get(`/api/${userId}`);
          setUserData(response.data);
        }
      } catch (error) {
        toast.error("Ocorreu um erro ao carregar os dados do usuário.");
        console.error("Erro ao obter dados do usuário:", error);
        setError("Ocorreu um erro ao carregar os dados do usuário.");
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: value.toUpperCase(),
    }));
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="left" flexDirection="column" >
    <Grid item xs={12}>
    <Typography variant="h6" gutterBottom>
    Meu cadastro
    </Typography>
    <Typography color="text.secondary" variant="body2" sx={{mb:2}} >
Para atualizar suas informações cadastradas, basta editar os campos
  conforme desejado e, em seguida, clicar no botão 'Salvar'.
</Typography>

  </Grid>

{loading && <p>Carregando dados do usuário...</p>}
{error && <p>{error}</p>}
{!loading && !error && (
  <Box>
     <Box component="form" className="UserDataForm" sx={{ p: 2 }} onSubmit={handleFormSubmit}>
        <Grid container spacing={2}>
    <Grid item xs={12} md={3}>
      
        <TextField
        fullWidth
        label="Nome completo"
        placeholder="Digite o Nome completo"             
          type="text"
          name="nome"
          value={userData.nome}
          onChange={handleInputChange}
        />
     </Grid>

    <Grid item xs={12} md={3}>
    
        <TextField
      fullWidth
      label="E-mail"
      type="email"
      placeholder="Digite o E-mail"
            name="email"
          value={userData.email}
          onChange={handleInputChange}
        />
     </Grid>

    <Grid item xs={12} md={3}>
       
    <InputMask
                mask="(99) 99999-9999"
                type="text"
                name="fone"
                value={userData.fone}
                onChange={handleInputChange}
              >
                {(inputProps) => (
                  <TextField
                    {...inputProps}
                    fullWidth
                    label="Telefone"
                    placeholder="Digite o telefone"
                    sx={{ mb: 2 }}
                  />
                )}
              </InputMask>
        
     </Grid>

    <Grid item xs={12} md={3}>
   
    <InputMask
                mask="99.999.999/9999-99"
                type="text"
                name="cnpj"
                value={userData.cnpj}
                onChange={handleInputChange}
              >
                {(inputProps) => (
                  <TextField
                    {...inputProps}
                    fullWidth
                    label="CNPJ"
                    placeholder="Digite o CNPJ"
                    sx={{ mb: 2 }}
                  />
                )}
              </InputMask>
     </Grid>

  

    <Grid item xs={12} md={3}>
       
        <TextField
        fullWidth
        label="CEP"
          name="cep"             
          placeholder="Digite o CEP"
          value={userData.cep}
          onChange={handleCEPChange}
          onBlur={handleCEPBlur}
        />
     </Grid>

    <Grid item xs={12} md={3}>
       
        <TextField
         fullWidth
         label="Rua"
          type="text"
          name="rua"
          value={userData.rua}
          onChange={handleInputChange}
        />
     </Grid>

    <Grid item xs={12} md={3}>
    
        <TextField
         fullWidth
         label="Numero"
          type="text"
          name="numero"
          value={userData.numero}
          onChange={handleInputChange}
        />
     </Grid>

    <Grid item xs={12} md={3}>
     
        <TextField
         fullWidth
         label="Complemento"
          type="text"
          name="complemento"
          value={userData.complemento}
          onChange={handleInputChange}
        />
     </Grid>

    <Grid item xs={12} md={3}>
      
        <TextField
         fullWidth
         label="Cidade"
          type="text"
          name="cidade"
          value={userData.cidade}
          onChange={handleInputChange}
        />
     </Grid>

    <Grid item xs={12} md={3}>
     
        <TextField
         fullWidth
        label="Estado"
          type="text"
          name="estado"
          value={userData.estado}
          onChange={handleInputChange}
        />
     </Grid>

      
     <Button variant="contained" color="primary" type="submit"   sx={{ backgroundColor: "#633687", color: "white", padding: "15px", mt:2 }}>
Salvar</Button>
      </Grid> </Box>
    

<ToastContainer /> 
  </Box>
)}
</Box>
  );
};

export default UserDataRh;
