import React, { useEffect, useState } from "react";
import axios from "axios";
import { CSVLink } from 'react-csv';
import { Typography, Button, Card, CardContent, Grid } from "@mui/material";
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import MedicalInformationOutlinedIcon from '@mui/icons-material/MedicalInformationOutlined';
import RunningWithErrorsOutlinedIcon from '@mui/icons-material/RunningWithErrorsOutlined';
import GroupAddOutlinedIcon from '@mui/icons-material/GroupAddOutlined';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import PieRh from "./PieRh";
import BarChartRh from "./BarChartRh";
import SurveyDashboardResponse from "./SurveyDashboardResponse"
const DashBoardAdm = () => {
  const [userData, setUserData] = useState([]);
  const [totalCollaborators, setTotalCollaborators] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = localStorage.getItem("userId");
        const response = await axios.get(`/api/${userId}`);
        const currentUserData = response.data;

        const responseAllUsers = await axios.get("/api/");
        const allUsers = responseAllUsers.data;

        const users = allUsers.filter(user => user.id_cnpj === currentUserData.id_cnpj && !user.cnpj);

        let completed = 0;
        let pending = 0;

        users.forEach(user => {
          const isComplete = user.rg && user.uploadsPath && user.uploadsPathAso;
          if (isComplete) {
            completed++;
          } else {
            pending++;
          }
        });

        setCompletedCount(completed);
        setPendingCount(pending);
        setTotalCollaborators(users.length);
        setUserData(users);
      } catch (error) {
        console.error("Erro ao obter dados dos usuários:", error);
      }
    };

    fetchUserData();
  }, []);

  const generateCSV = () => {
    const headers = ["Nome", "Email", "Telefone", "CPF", "RG", "CEP", "Rua", "Numero", "Complemento", "Cidade", "Estado", "Estado Civil", "Genero", "Dependentes", "Data Nascimento", "UploadsPath", "Data", "CNPJ", "ID CNPJ", "UploadsPathAso", "Docs", "Pass"];
    const data = userData.map(user => Object.values(user));
    return [headers, ...data];
  };

  return (
    <>
      <Grid container spacing={2} justifyContent="center" sx={{ mb:3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ boxShadow: 5, borderRadius: 3, minHeight: '180px' }}>
            <CardContent>     
              <Stack direction="row" sx={{ alignItems: 'flex-start', justifyContent: 'space-between', padding: '15px' }} spacing={3}>
                <Stack>
                  <Typography color="text.secondary" variant="overline">
                    Total de colaboradores 
                  </Typography>
                  <Typography variant="h2">{totalCollaborators}</Typography>
                </Stack>
                <Avatar sx={{ bgcolor: '#2E96FF', height: '60px', width: '60px'}}>
                  <GroupAddOutlinedIcon />
                </Avatar>
              </Stack> 
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ boxShadow: 5, borderRadius: 3, minHeight: '180px' }}>
            <CardContent>     
              <Stack direction="row" sx={{ alignItems: 'flex-start', justifyContent: 'space-between', padding: '15px' }} spacing={3}>
                <Stack>
                  <Typography color="text.secondary" variant="overline">
                    Processos Pendentes
                  </Typography>
                  <Typography variant="h2">{pendingCount}</Typography>
                </Stack>
                <Avatar sx={{ bgcolor: '#B800D8', height: '60px', width: '60px'}}>
                  <RunningWithErrorsOutlinedIcon />
                </Avatar>
              </Stack> 
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ boxShadow: 5, borderRadius: 3, minHeight: '180px' }}>
            <CardContent>     
              <Stack direction="row" sx={{ alignItems: 'flex-start', justifyContent: 'space-between', padding: '15px' }} spacing={3}>
                <Stack>
                  <Typography color="text.secondary" variant="overline">
                    Processos concluídos
                  </Typography>
                  <Typography variant="h2">{completedCount}</Typography>
                </Stack>
                <Avatar sx={{ bgcolor: '#6A438B', height: '60px', width: '60px'}}>
                  <MedicalInformationOutlinedIcon />
                </Avatar>
              </Stack> 
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ boxShadow: 5, borderRadius: 3, minHeight: '180px' }}>
            <CardContent>     
              <Stack direction="row" sx={{ alignItems: 'flex-start', justifyContent: 'space-between', padding: '15px' }} spacing={3}>
                <Stack>
                  <Typography color="text.secondary" variant="overline">
                    Relatórios
                  </Typography>
                  <CSVLink data={generateCSV()} filename={"dados_dashboard.csv"} target="_blank">
                    <Button variant="contained" color="primary">Baixar Relatório</Button>
                  </CSVLink>
                </Stack>
                <Avatar sx={{ bgcolor: '#f4d318', height: '60px', width: '60px'}}>
                  <AssignmentOutlinedIcon />
                </Avatar>
              </Stack> 
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={2} justifyContent="center"  sx={{ mb:3 }}>
        <Grid item xs={12} sm={6} md={7}>
          <Card sx={{ boxShadow: 5, borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6" align="center">Processos Pendentes e concluídos</Typography>
              <BarChartRh />
           
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={5}>
          <Card sx={{ boxShadow: 5, borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6" align="center">Visão Geral de colaboradores</Typography>
              <PieRh />
            </CardContent>
          </Card>
        </Grid>
      </Grid>


      <Grid container spacing={2} justifyContent="center">
        <Grid item xs={12} sm={6} md={12}>
          <Card sx={{ boxShadow: 5, borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6" align="center">Visualizar relatorios de pesquisa de clima</Typography>
              
              <SurveyDashboardResponse />
            </CardContent>
          </Card>
        </Grid>

        
      </Grid>


    </>
  );
};

export default DashBoardAdm;
