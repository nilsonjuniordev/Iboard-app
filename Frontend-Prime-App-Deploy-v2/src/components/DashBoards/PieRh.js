import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box, CircularProgress } from "@mui/material";
import ReactApexChart from 'react-apexcharts';

const COLORS = ['#6A438B', '#B800D8', '#2E96FF', '#f4d318'];

const PieRh = () => {
  //const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pieData, setPieData] = useState([
    { name: 'Processos Concluídos', value: 0 },
    { name: 'Pendentes Exames', value: 0 },
    { name: 'Pendentes Documentos', value: 0 },
    { name: 'Pendentes Cadastros', value: 0 }
  ]);

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
        let pendingExams = 0;
        let pendingDocs = 0;
        let pendingReg = 0;

        users.forEach(user => {
          const isComplete = user.rg && user.uploadsPath && user.uploadsPathAso;
          if (isComplete) {
            completed++;
          } else {
            if (!user.rg) pendingReg++;
            if (!user.uploadsPath) pendingDocs++;
            if (!user.uploadsPathAso) pendingExams++;
          }
        });

        //setUserData(users);
        setLoading(false);

        setPieData([
          { name: 'Processos Concluídos', value: completed },
          { name: 'Pendentes Exames', value: pendingExams },
          { name: 'Pendentes Documentos', value: pendingDocs },
          { name: 'Pendentes Cadastros', value: pendingReg }
        ]);
      } catch (error) {
        console.error("Erro ao obter dados dos usuários:", error);
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  //const totalCadastros = userData.length;

  const chartOptions = {
    labels: pieData.map(data => data.name),
    colors: COLORS,
    legend: {
      show: true,
      position: 'bottom'
    },
    plotOptions: {
      pie: {
        expandOnClick: false,
        donut: {
          size: '70%',
          labels: {
            show: true,
            total: {
              show: false,
              //  label: 'Colaboradores: ' + totalCadastros,
              formatter: function(w) {
                return w.globals.seriesTotals.reduce((a, b) => {
                  return a + b
                }, 0)
              }
            }
          }
        }
      }
    },
    responsive: [{
      breakpoint: 480,
      options: {
        chart: {
          width: '100%'
        },
        legend: {
          position: 'bottom'
        }
      }
    }]
  };

  return (
    <Box height={400} mt={2}>
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height={400}>
          <CircularProgress />
        </Box>
      ) : (
        <ReactApexChart options={chartOptions} series={pieData.map(data => data.value)} type="donut" height={400} />
      )}
    </Box>
  );
};

export default PieRh;
