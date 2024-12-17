import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box } from "@mui/material";
import ReactApexChart from 'react-apexcharts';

const BarChartRh = () => {
  const [userData, setUserData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [currentUserData, setCurrentUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCurrentUser = async (userId) => {
      try {
        const response = await axios.get(`/api/${userId}`);
        setCurrentUserData(response.data);
      } catch (error) {
        console.error("Erro ao obter dados do usuário atual:", error);
      }
    };

    const userId = localStorage.getItem("userId");
    if (userId) {
      fetchCurrentUser(userId);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/");
        setUserData(response.data);
      } catch (error) {
        console.error("Erro ao obter dados dos usuários:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (!currentUserData) return;

    const filterUsers = (allUsers) => {
      return allUsers.filter(user => user.id_cnpj === currentUserData.id_cnpj && !user.cnpj);
    };

    const calculateMonthlyData = (filteredUsers) => {
      // Mapeia todos os meses do ano e inicializa os dados mensais com zero
      const months = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0'));
      const monthlyCounts = months.map(month => ({
        month,
        pending: 0,
        complete: 0
      }));

      // Atualiza os dados mensais com os valores dos usuários
      filteredUsers.forEach(user => {
        const date = user.data.substring(0, 7);
        const monthIndex = parseInt(date.substring(5, 7)) - 1;
        if (!user.rg || !user.uploadsPath || !user.uploadsPathAso) {
          monthlyCounts[monthIndex].pending++;
        } else {
          monthlyCounts[monthIndex].complete++;
        }
      });

      setMonthlyData(monthlyCounts);
      setLoading(false);
    };

    const filteredUsers = filterUsers(userData);
    calculateMonthlyData(filteredUsers);
  }, [userData, currentUserData]);

  if (loading) {
    return (
      <Box height={400} mt={2}>
        Loading...
      </Box>
    );
  }

  const chartOptions = {
    chart: {
      background: 'transparent',
      stacked: false,
      toolbar: { show: false }
    },
    colors: ['#f4d318', '#6A438B'],
    dataLabels: { enabled: false },
    fill: { opacity: 1, type: 'solid' },
    grid: { borderColor: '#ddd', strokeDashArray: 2 },
    legend: { show: true, position: 'top', horizontalAlign: 'top', labels: { colors: '#333' } },
    plotOptions: { bar: { horizontal: false, columnWidth: '100%', barHeight: '80%', endingShape: 'rounded' } },
    stroke: { colors: ['transparent'], show: true, width: 2 },
    xaxis: { categories: monthlyData.map(data => data.month) },
    yaxis: { labels: { formatter: (value) => (value > 0 ? `${value}` : '') } }
  };

  const series = [
    {
      name: 'Pendentes',
      data: monthlyData.map(data => data.pending)
    },
    {
      name: 'Concluídos',
      data: monthlyData.map(data => data.complete)
    }
  ];

  return (
    <Box>
      <Box height={400} mt={2}>
        <ReactApexChart options={chartOptions} series={series} type="bar" height={350} />
      </Box>
    </Box>
  );
};

export default BarChartRh;
