import React, { useEffect, useState } from "react";
import {
  Grid,
  Typography,
  StepLabel,
  Step,
  Stepper,
  Box,
  Card,
  CardContent,
  Divider,
 
} from "@mui/material";

import CardDocStep from "./CardDocStep";
import CardRegisterStep from "./CardRegisterStep";
import CardAsoStep from "./CardAsoStep";
import CardFinalStep from "./CardFinalStep";
import SurveyDashboard from "./SurveyDashboard";
import CalendarWithEvents from "../CalendarWithEvents";

const StatusUserStep = () => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    //API para obter os dados do usuário
    fetch(`/api/${userId}`)
      .then((response) => response.json())
      .then((data) => {
        setUserData(data);
      })
      .catch((error) => {
        console.error("Erro ao obter dados do usuário:", error);
      });
  }, []);

  const steps = [
    "Complete seu cadastro",
    "Documentos solicitados",
    "Envio de exames",
  ];

  let activeStep = 0;

  if (userData) {
    if (!userData.rg || !userData.cep || !userData.rua || !userData.numero) {
      activeStep = 0;
    } else if (!userData.uploadsPath) {
      activeStep = 1;
    } else if (!userData.uploadsPathAso) {
      activeStep = 2;
    } else {
      activeStep = 3;
    }
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ width: "100%" }}>
        {activeStep === 0 && <CardRegisterStep />}
        {activeStep === 1 && <CardDocStep />}
        {activeStep === 2 && <CardAsoStep />}
        {activeStep === 3 && <CardFinalStep />}
      </Box>

      <Box sx={{ width: "100%", borderRadius: 3, boxShadow: 5 }}>
        <Stepper
          activeStep={activeStep}
          sx={{
            m: 5,
            borderRadius: "16px",
            flexDirection: { xs: "column", sm: "row" },
          }}
        >
          {steps.map((label, index) => (
            <Step
              sx={{ p: 2 }}
              display="flex"
              alignItems="flex-start"
              key={label}
              completed={index < activeStep}
            >
              <StepLabel
                StepIconProps={{
                  style: {
                    color: index === activeStep ? "#FDEE00" : "#633687",
                  },
                }}
              >
                {label}
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>

      <Grid container spacing={2} justifyContent="center">
      <Grid item xs={12} sm={6} md={6}>
          <Card sx={{ minHeight: "400px", boxShadow: 5, borderRadius: 3 }}>
            <CardContent>
                 <Divider />
              <CalendarWithEvents />  
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <Card sx={{ minHeight: "400px", boxShadow: 5, borderRadius: 3 }}>
            <CardContent>             
              <Typography variant="h6" align="center">
                Pesquisa de clima
              </Typography>
              <Divider />
              <Typography variant="body1"  sx={{ p:2}}>
                Resonda as pesquisas e compartilhe
                sua opinião de forma anônima. Suas respostas são confidenciais e
                fundamentais para melhorar continuamente nossos processos e
                ambiente de trabalho.
              </Typography>
              <SurveyDashboard />
            </CardContent>
          </Card>
        </Grid>

     
      </Grid>
    </Box>
  );
};

export default StatusUserStep;
