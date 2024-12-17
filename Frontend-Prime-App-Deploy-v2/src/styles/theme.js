// theme.js
import { createTheme } from '@mui/material/styles';

const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#F4F5FA', // Cor primária
    },
    secondary: {
      main: '#6A438B', // Cor secundária
    },
    navbar: {
      main: '#F4F5FA', // Cor do navbar
    },
    sidebar: {
      main: '#F4F5FA', // Cor do sidebar
    },
    footer: {
      main: '#6A438B', // Cor do footer
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif', // Definindo a fonte global como Roboto
    // Outras configurações de tipografia
  },
  components: {
    MuiAccordion: {
      styleOverrides: {
        root: {
          backgroundColor: '#F4F5FA', // Cor de fundo padrão
          borderRadius: '8px',
          marginBottom: '16px',
          '&:before': {
            display: 'none', // Remove a linha acima do acordeão
          },
        },
      },
    },
    MuiAccordionSummary: {
      styleOverrides: {
        root: {
          backgroundColor: '#6A438B', // Cor de fundo do cabeçalho do acordeão
          color: '#F4F5FA', // Cor do texto do cabeçalho
          borderRadius: '8px 8px 0 0',
          '&.Mui-expanded': {
            backgroundColor: '#6A438B', // Mantém a cor ao expandir
            color: '#FBDD23', // Cor do texto ao expandir
          },
        },
      },
    },
    MuiAccordionDetails: {
      styleOverrides: {
        root: {
          backgroundColor: '#F4F5FA', // Cor de fundo dos detalhes
          borderRadius: '0 0 8px 8px',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          backgroundColor: '#6A438B', // Cor de fundo do botão
          color: '#F4F5FA', // Cor do texto do botão
          width: '100%', // Largura 100%
          borderRadius: '8px 8px',
          padding: '10px',
          '&:hover': {
            backgroundColor: '#bd9bdb', // Cor de fundo ao passar o mouse
          },
        },
      },
    },
    MuiStepIcon: {
      styleOverrides: {
        root: {
          fontSize: '4rem', // Tamanho das bolinhas
          '&.Mui-active': {
            color: '#FBDD23', // Cor das bolinhas ativas
          },
          '&.Mui-completed': {
            color: '#6A438B', // Cor das bolinhas completadas
          },
        },
      },
    },
    MuiCssBaseline: {
      styleOverrides: `
        .react-calendar {
          width: 100% !important;
         height: 65vh !important;
          border: 1px solid #ddd;
          border-radius: 8px;
          overflow: hidden;
        }
        .react-calendar__navigation {
          background-color: #6A438B;
          color: #F4F5FA;
        }

.react-calendar__navigation button:enabled:hover, .react-calendar__navigation button:enabled:focus {
    background-color: #583575!important;
}

.react-calendar__tile--highlight {
  background: #f0f0f0;
}

        .react-calendar__navigation button {
          color: #F4F5FA;
        }
        .react-calendar__month-view__days__day {
          width: calc(100% / 7);
            border: 1px solid #f7f2f2 !important;
           height: 10vh !important;
          text-align: center;
          padding: 15px;
        }
        .react-calendar__tile--active {
          background: #6A438B;
          color: #F4F5FA;
        }
        .react-calendar__tile--now {
          border: 2px solid #F4F5FA;
        }
        .react-calendar__tile {
          border-radius: 0;
        }
      `,
    },
  },
});

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#6A438B', // Cor primária
    },
    secondary: {
      main: '#FBDD23', // Cor secundária
    },
    navbar: {
      main: '#1E1E1E', // Cor do navbar
    },
    sidebar: {
      main: '#1E1E1E', // Cor do sidebar
    },
    footer: {
      main: '#6A438B', // Cor do footer
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif', // Definindo a fonte global como Roboto
    // Outras configurações de tipografia
  },
  components: {
    MuiAccordion: {
      styleOverrides: {
        root: {
          backgroundColor: '#1E1E1E', // Cor de fundo padrão
          borderRadius: '8px',
          marginBottom: '16px',
          '&:before': {
            display: 'none', // Remove a linha acima do acordeão
          },
        },
      },
    },
    MuiAccordionSummary: {
      styleOverrides: {
        root: {
          backgroundColor: '#6A438B', // Cor de fundo do cabeçalho do acordeão
          color: '#FBDD23', // Cor do texto do cabeçalho
          borderRadius: '8px 8px 0 0',
          '&.Mui-expanded': {
            backgroundColor: '#6A438B', // Mantém a cor ao expandir
            color: '#FBDD23', // Cor do texto ao expandir
          },
        },
      },
    },
    MuiAccordionDetails: {
      styleOverrides: {
        root: {
          backgroundColor: '#1E1E1E', // Cor de fundo dos detalhes
          borderRadius: '0 0 8px 8px',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          backgroundColor: '#6A438B', // Cor de fundo do botão
          color: '#FFFFFF', // Cor do texto do botão
          width: '100%', // Largura 100%
          '&:hover': {
            backgroundColor: '#4A2D6F', // Cor de fundo ao passar o mouse
          },
        },
      },
    },
    MuiStepIcon: {
      styleOverrides: {
        root: {
          fontSize: '2rem', // Tamanho das bolinhas
          '&.Mui-active': {
            color: '#FBDD23', // Cor das bolinhas ativas
          },
          '&.Mui-completed': {
            color: '#6A438B', // Cor das bolinhas completadas
          },
        },
      },
    },
  },
});

export { lightTheme, darkTheme };
