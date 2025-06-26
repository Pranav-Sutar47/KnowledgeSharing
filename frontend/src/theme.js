import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#3f51b5', // Indigo
    },
    secondary: {
      main: '#f50057', // Pink A400
    },
    background: {
      default: '#f4f6fc', // Very light blue
    },
  },
  typography: {
    fontFamily: 'Poppins, sans-serif',
  },
  shape: {
    borderRadius: 12,
  },
});

export default theme;
