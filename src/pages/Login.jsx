import React from 'react';
import { useForm } from 'react-hook-form';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  Link,
} from '@mui/material';
import axiosInstance from '../api/axiosInstance';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const res = await axiosInstance.post('/login', data);
      console.log('Login successful', res.data);
      navigate('/dashboard');
    } catch (err) {
      console.error('Login error', err.response?.data?.message || err.message);
    }
  };

  return (
    <Box minHeight="100vh" bgcolor="background.default" display="flex" alignItems="center">
      <Container maxWidth="sm">
        <Paper
          elevation={6}
          sx={{
            p: 4,
            borderRadius: 3,
            boxShadow: '0px 8px 20px rgba(0,0,0,0.08)',
          }}
        >
          <Box display="flex" flexDirection="column" alignItems="center" mb={3}>
            <img
              src="/logo.png"
              alt="App Logo"
              style={{ width: 60, height: 60, marginBottom: 8 }}
            />
            <Typography variant="h5" fontWeight={700} gutterBottom>
              AcadShare
            </Typography>
          </Box>

          <Typography variant="h4" fontWeight={600} gutterBottom align="center">
            Sign in
          </Typography>
          <Typography variant="body2" color="text.secondary" align="center" mb={3}>
            Welcome back! Please enter your credentials
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              margin="normal"
              {...register('email')}
            />
            <TextField
              fullWidth
              label="Password"
              type="password"
              margin="normal"
              {...register('password')}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, py: 1.5, fontWeight: 'bold', borderRadius: 2 }}
            >
              Login
            </Button>
            <Typography variant="body2" align="center" mt={2}>
              Don’t have an account?{' '}
              <Link
                onClick={() => navigate('/signup')}
                sx={{ cursor: 'pointer', fontWeight: 500 }}
              >
                Sign up
              </Link>
            </Typography>
          </form>
        </Paper>
      </Container>
    </Box>
  );
};

export default Login;
