import React, { useEffect, useState } from "react";
import axios from "axios";
import InputMask from "react-input-mask";
import { toast } from "react-toastify";
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Grid, TextField, MenuItem } from "@mui/material";
import Button from '@mui/material/Button';
import dayjs from 'dayjs';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UserData = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    iduser: null,
    nome: "",
    email: "",
    fone: "",
    rg: "",
    cep: "",
    rua: "",
    numero: "",
    complemento: "",
    cidade: "",
    estado: "",
    civil: "",
    genero: "",
    dependentes: "",
    data_nascimento: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleRGChange = (e) => {
    const value = e.target.value;
    const maxLength = 12; // Define o máximo de caracteres permitidos para o RG
    const sanitizedValue = value.substring(0, maxLength); // Limita o número de caracteres
    setUserData({ ...userData, rg: sanitizedValue.toUpperCase() });
  };

    const handleCivilChange = (event) => {
      setUserData({ ...userData, civil: event.target.value });
    };

    const handleGenChange = (event) => {
      setUserData({ ...userData, genero: event.target.value });
    };

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
      console.error("Erro ao buscar endereço pelo CEP:", error);
      toast.error("Erro ao buscar endereço pelo CEP");
    }
  };

  const handleCEPChange = (e) => {
    const formattedCEP = e.target.value.replace(/[^\d]+/g, "");
    setUserData((prevUserData) => ({
      ...prevUserData,
      cep: formattedCEP,
      // Se o campo de CEP for preenchido, remova manualmente a label
      rua: formattedCEP ? userData.rua : "",
      cidade: formattedCEP ? userData.cidade : "",
      estado: formattedCEP ? userData.estado : "",
    }));
  };

  const handleCEPBlur = () => {
    if (userData.cep.length === 8) {
      loadAddress(userData.cep);
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

  const converterDataParaMySQL = (dataBrasileira) => {
    const [dia, mes, ano] = dataBrasileira.split('/');
    const dataMySQL = dayjs(`${ano}-${mes}-${dia}`).format('YYYY-MM-DD');
    return dataMySQL;
  };

  const validateFields = () => {
    let isValid = true;

    if (!userData.nome) {
      toast.error("O campo Nome é obrigatório.");
      isValid = false;
    }

    if (!userData.email) {
      toast.error("O campo Email é obrigatório.");
      isValid = false;
    }

    if (!userData.fone) {
      toast.error("O campo Telefone é obrigatório.");
      isValid = false;
    }

    if (!userData.rg) {
      toast.error("O campo RG é obrigatório.");
      isValid = false;
    }

    
    if (!userData.cpf) {
      toast.error("O campo CPF é obrigatório.");
      isValid = false;
    }

    if (!userData.cep) {
      toast.error("O campo CEP é obrigatório.");
      isValid = false;
    }

    if (!userData.rua) {
      toast.error("O campo Rua é obrigatório.");
      isValid = false;
    }

    if (!userData.numero) {
      toast.error("O campo Número é obrigatório.");
      isValid = false;
    }

    if (!userData.cidade) {
      toast.error("O campo Cidade é obrigatório.");
      isValid = false;
    }

    if (!userData.estado) {
      toast.error("O campo Estado é obrigatório.");
      isValid = false;
    }

    if (!userData.civil) {
      toast.error("O campo Estado Civil é obrigatório.");
      isValid = false;
    }

    if (!userData.genero) {
      toast.error("O campo Gênero é obrigatório.");
      isValid = false;
    }
    if (!userData.data_nascimento) {
      toast.error("O campo Data de Nascimento é obrigatório.");
      isValid = false;
    }
   
    return isValid;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!validateFields()) {
      return;
    }

      // Ajusta a formatação da data de nascimento
  const userDataCopy = { ...userData };
  userDataCopy.data_nascimento = converterDataParaMySQL(userDataCopy.data_nascimento);


      // Verifica se o e-mail é válido
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(userDataCopy.email)) {
    toast.error("Por favor, insira um e-mail válido.");
    return;
  }

  // Verifica se o telefone é válido
  const phoneRegex = /^\(\d{2}\)\s\d{4,5}-\d{4}$/;
  if (!phoneRegex.test(userDataCopy.fone)) {
    toast.error("Por favor, insira um telefone válido no formato (99) 99999-9999.");
    return;
  }

    try {
      const userId = localStorage.getItem('userId');
      const userDataCopy = { ...userData };
      userDataCopy.data_nascimento = converterDataParaMySQL(userDataCopy.data_nascimento);
      await axios.put(`/api/${userId}`, userDataCopy);
      toast.success("Dados do usuário atualizados com sucesso.");
      setTimeout(() =>{
        navigate('/DashboardUser'); 
      }, 800);
    } catch (error) {
      console.error('Erro ao atualizar dados do usuário:', error);
      toast.error("Erro ao atualizar dados do usuário.");
    }
  };


  useEffect(() => {
    const userId = localStorage.getItem('userId');

    const fetchUserData = async () => {
      try {
        const response = await axios.get(`/api/${userId}`);
        setUserData({ ...response.data, data_nascimento: formatarDataBrasileiro(response.data.data_nascimento) });
      } catch (error) {
        console.error('Erro ao obter dados do usuário:', error);
      }
    };

    fetchUserData();
  }, []);

  const formatarDataBrasileiro = (data) => {
    if (!data) return '';
    const [ano, mes, dia] = data.split('-');
    return `${dia}/${mes}/${ano}`;
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
                mask="999.999.999-99"
                type="text"
                name="cpf"
                value={userData.cpf}
                onChange={handleInputChange}
              >
  {(inputProps) => (
                  <TextField
                    {...inputProps}
                fullWidth
                label="CPF"
                placeholder="Digite o CPF"
                sx={{ mb: 2 }}
              />
            )}
</InputMask>
           </Grid>

          <Grid item xs={12} md={3}>
           
          <InputMask
  mask="99.999.999-*"
  maskChar={null}
  value={userData.rg}
  onChange={handleRGChange}
>
  {(inputProps) => (
    <TextField
      {...inputProps}
      fullWidth
      label="RG"
      name="rg"
      placeholder="Digite o RG"
      variant="outlined"
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

          <Grid item xs={12} md={3}>
      
              <TextField
      select
      name="civil"
      label="Estado Civil"
      value={userData.civil}
      onChange={handleCivilChange}
      variant="outlined"
      fullWidth
    >
      <MenuItem value="">
        <em>Selecione</em>
      </MenuItem>
      <MenuItem value="solteiro">Solteiro(a)</MenuItem>
      <MenuItem value="casado">Casado(a)</MenuItem>
      <MenuItem value="divorciado">Divorciado(a)</MenuItem>
      <MenuItem value="viuvo">Viúvo(a)</MenuItem>
    </TextField>
           </Grid>

          <Grid item xs={12} md={3}>
             
              <TextField
      select
      name="genero"
      label="Gênero"
      value={userData.genero}
      onChange={handleGenChange}
      variant="outlined"
      fullWidth
    >
      <MenuItem value="">
        <em>Selecione</em>
      </MenuItem>
      <MenuItem value="masculino">Masculino</MenuItem>
      <MenuItem value="feminino">Feminino</MenuItem>
      <MenuItem value="outro">Outro</MenuItem>
    </TextField>
           </Grid>

          <Grid item xs={12} md={3}>
     
            <TextField
               fullWidth
              label="Dependentes"
                type="text"
                name="dependentes"
                value={userData.dependentes}
                onChange={handleInputChange}
              />
           </Grid>

          <Grid item xs={12} md={3}>
              
          <InputMask
        mask="99/99/9999"
        value={formatarDataBrasileiro(userData.data_nascimento)}
        onChange={handleInputChange}
      >
        {(inputProps) => (
          <TextField
            {...inputProps}
            fullWidth
            label="Data de Nascimento"
            name="data_nascimento"
            placeholder="Digite a data"
            variant="outlined"
            sx={{ mb: 2 }}
          />
        )}
      </InputMask>

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

export default UserData;
