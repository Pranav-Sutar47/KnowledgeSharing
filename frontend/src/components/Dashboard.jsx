import React from 'react';
import { Button, Typography, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await api.get('/user/logout');
    localStorage.removeItem('accessToken');
    navigate('/');
  };

  return (
    <Container sx={{ mt: 10 }}>
      <Typography variant="h4">Dashboard</Typography>
      <Typography>Welcome to Knowledge Sharing Platform!</Typography>
      <Button variant="contained" color="error" onClick={handleLogout} sx={{ mt: 3 }}>
        Logout
      </Button>
    </Container>
  );
};

export default Dashboard;
