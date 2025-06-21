import React from 'react';
import { useForm } from 'react-hook-form';
import { Button, TextField, Typography, Container } from '@mui/material';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const res = await api.post('/user/login', data);
      localStorage.setItem('accessToken', res.data.data.accessToken);
      navigate('/dashboard');
    } catch (err) {
      alert(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 10 }}>
      <Typography variant="h5" gutterBottom>Login</Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField fullWidth label="Email" {...register("email")} margin="normal" />
        <TextField fullWidth label="Password" type="password" {...register("password")} margin="normal" />
        <Button fullWidth variant="contained" type="submit" sx={{ mt: 2 }}>Login</Button>
      </form>
    </Container>
  );
};

export default Login;
