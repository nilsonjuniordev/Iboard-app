import React from "react";
import { Card, CardContent, Grid, Divider, CardActions } from "@mui/material";
import FormRh from "./FormRh";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";

const MyAccountUser = () => {
  return (
    <>
      <Grid container spacing={3} justifyContent="center">
        <Grid item xs={12} sm={6} md={4}>
          <Card
            sx={{
              width: "100%", // Largura fixa para dispositivos maiores

              overflow: "visible",

              boxShadow: 5,
              borderRadius: 3,
              margin: "auto", // Centraliza o Card horizontalmente
            }}
          >
            <CardContent>
              <Typography variant="h5" sx={{ width: "100%", mb: 1 }}>
                {" "}
                Lançar colaborador
              </Typography>
            </CardContent>

            <Divider />
            <CardContent>
              <CardMedia
                component="img"
                src="/assets/hello.png"
                alt="fogueterh"
                sx={{
                  width: "100%",
                  height: "auto",
                }}
              />
            </CardContent>
            <Divider sx={{ width: "100%", mt: 3 }} />
            <CardActions>
              <Typography sx={{ width: "100%" }} color="text.secondary">
                Para iniciar a integração, registre um novo colaborador. Este
                receberá um convite para acessar a plataforma usando nome e CPF,
                onde poderá completar suas informações e enviar documentos
                necessários.
              </Typography>{" "}
            </CardActions>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={8}>
          <Card sx={{ boxShadow: 5, borderRadius: 3 }}>
            <CardContent>
              <FormRh />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  );
};

export default MyAccountUser;
