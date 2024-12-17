import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardContent, Grid, Button, Typography, Stack  } from "@mui/material";
import UserList from "./UserList";
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';


const ViewUsersRH = () => {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isMobile, setIsMobile] = useState(false);

  const filteredUsers = users.filter((user) =>
    user.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

    useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 600);
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };


  const handleSendMessage = (phoneNumber) => {
    console.log("Enviar mensagem para:", phoneNumber);
  };

  
  useEffect(() => {
    // Obter userId do localStorage
    const userId = localStorage.getItem("userId");

    if (!userId) {
      console.error("ID do usuário não encontrado no localStorage.");
      return;
    }

    // Fazer uma solicitação ao servidor para buscar os detalhes do usuário atual
    const fetchCurrentUser = async () => {
      try {
        const result = await axios.get(`/api/${userId}`);
        setCurrentUser(result.data);
      } catch (error) {
        console.error("Erro ao buscar detalhes do usuário:", error);
      }
    };

    fetchCurrentUser();
  }, []);

  useEffect(() => {
    if (!currentUser) return;

    // Fazer uma solicitação ao servidor para buscar todos os usuários com o mesmo id_cnpj
    const fetchUsersByCnpj = async () => {
      try {
        const result = await axios.get(`/api/?cnpj=${currentUser.id_cnpj}`);
        // Filtrar os usuários para excluir o usuário atual
        const filteredUsers = result.data.filter((user) => user.iduser !== currentUser.iduser);
        setUsers(filteredUsers);
      } catch (error) {
        console.error("Erro ao buscar usuários pelo id_cnpj:", error);
      }
    };

    fetchUsersByCnpj();
  }, [currentUser]);

  return (
    <>
      <Grid container spacing={3} justifyContent="center">



        <Grid item xs={12} sm={12} md={12}>

 
        <Stack spacing={3}>
        <Stack direction="row" spacing={3}>
       
        <Stack spacing={1} sx={{ flex: 'auto' }}>
          <Typography variant="h4">Colaboradores</Typography>
          <Stack direction={isMobile ? "column" : "row"} spacing={1} sx={{ alignItems: 'center' }}>
            <Button color="inherit" >
             <FileUploadOutlinedIcon/> Importar colaboradores
            </Button>
            <Button color="inherit" >
             <FileDownloadOutlinedIcon/>Exportar colaboradores
            </Button>
            <Button  variant="contained"  sx={{ backgroundColor: "#633687", color: "white", padding: "15px", mt:2 }}>
            Adicionar Colaborador
          </Button>
          </Stack>
        
       
        </Stack>
      </Stack>
    </Stack>

    <Card sx={{ p: 2 }}>
      <OutlinedInput
        defaultValue=""
        fullWidth       
        placeholder="Pesquisar colaborador"
        value={searchTerm}
        onChange={handleSearch}
        startAdornment={
          <InputAdornment position="start">
         <SearchOutlinedIcon />
          </InputAdornment>
        }
        
      />


    </Card>
       
    
        </Grid>

        <Grid item xs={12} sm={12} md={12}>
          <Card sx={{ boxShadow: 5, borderRadius: 3 }}>
            <CardContent>
              <UserList   users={filteredUsers}
          onSendMessage={handleSendMessage}
          currentUser={currentUser}/>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  );
};

export default ViewUsersRH;
