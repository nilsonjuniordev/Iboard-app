import React, { useState, useEffect } from "react";
import { useTheme, Divider, Typography, CardMedia, Box, Card, CardContent } from '@mui/material';
import { Link } from 'react-router-dom';

const CardDocStep = () => {
  const [userName, setUserName] = useState("");
  const themeContext = useTheme();
  const theme = useTheme();

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    // API para obter os dados do usuário
    fetch(`/api/${userId}`)
      .then((response) => response.json())
      .then((data) => {
        const name = data.nome;
        setUserName(name);
      });
  }, []);

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      sx={{ mb:3 }}
    >
      <Card
        sx={{
          width: '100%', // Largura fixa para dispositivos maiores
          position: 'relative',
          overflow: 'visible',
          padding:1,
          backgroundColor: themeContext.palette.card1?.main,
          borderRadius: 2,
          boxShadow: 5,
          margin: 'auto', // Centraliza o Card horizontalmente
          minHeight: '140px', 
          [theme.breakpoints.down('sm')]: {
            minHeight: '320px', 
            padding:0,
          },
          maxWidth: '100%', // Define uma largura máxima para dispositivos menores
        }}
      >
        <CardMedia
          component="img"
          src="/assets/idverify.png"
          alt="id"
          sx={{
            position: 'absolute',
            bottom: '0',
            right: '50px',
            [theme.breakpoints.down('sm')]: {
              right: '130px',           
              width: '120px', 
            },
            width: '220px',
            borderRadius: '16px',
           
          }}
        />
        <CardContent>
          <Typography sx={{width: '50%', [theme.breakpoints.down('sm')]: {width: '100%'}, }}>
             Bem vindo, {userName || "visitante"}!</Typography>

          <Divider  sx={{  width: '50%'}} />

          <Typography sx={{width: '50%', fontWeight:'bold', mt: 1, [theme.breakpoints.down('sm')]: {width: '100%'}, }} 
          color="text.body"  variant="h6">   Obrigado por completar seu cadastro!</Typography>
            
          <Typography sx={{width: '50%', mt: 1, [theme.breakpoints.down('sm')]: {width: '100%'}, }} >
            2 - Para dar continuidade ao processo de exame, envie os documentos solicitados pelo recrutador. 
            <Link to="/Upload">Enviar Documentos</Link></Typography>
         
        </CardContent>
      </Card>
    </Box>
  );
}

export default CardDocStep;