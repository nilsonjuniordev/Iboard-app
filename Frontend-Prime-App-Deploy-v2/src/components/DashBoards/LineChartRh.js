import React, { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer } from 'recharts';
import { Box } from "@mui/material";
import axios from "axios";

const LineChartRh = () => {
  const [userData, setUserData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/"); // Endpoint para buscar dados de usuários
        setUserData(response.data); // Define os dados de usuários no estado
      } catch (error) {
        console.error("Erro ao obter dados dos usuários:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    // Função para calcular o total de usuários por mês
    const calculateMonthlyData = () => {
      const monthlyCounts = userData.reduce((acc, user) => {
        const date = user.data.substring(0, 7); // Extrai o ano e mês da data de criação do usuário
        if (!acc[date]) {
          acc[date] = 1;
        } else {
          acc[date]++;
        }
        return acc;
      }, {});

      const sortedMonthlyData = Object.entries(monthlyCounts).map(([month, count]) => ({ month, count }));
      setMonthlyData(sortedMonthlyData);
    };

    calculateMonthlyData();
  }, [userData]);

  return (
    <Box>
   
     
      
        <Box height={400} mt={2}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
            
              <Line type="monotone" dataKey="count" stroke="#6A438B" />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      
    </Box>
  );
};

export default LineChartRh;
