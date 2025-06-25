import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './theme';

import '@fontsource/poppins'; // Import Poppins font

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* resets default browser styles */}
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
