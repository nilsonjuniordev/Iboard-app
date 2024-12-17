import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Loading from '../components/Loading';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { lightTheme } from '../styles/theme';
import { Box } from '@mui/material';
import { GlobalWorkerOptions } from 'pdfjs-dist';

// Configure o caminho do worker
GlobalWorkerOptions.workerSrc = 'https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js';
console.log('PDF Worker configured:', GlobalWorkerOptions.workerSrc);

function App() {
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <ThemeProvider theme={lightTheme}>
      <CssBaseline />
      <Box sx={{ typography: 'body1' }}>
        {isLoading ? <Loading /> : <Outlet />}
      </Box>
    </ThemeProvider>
  );
}

export default App;
