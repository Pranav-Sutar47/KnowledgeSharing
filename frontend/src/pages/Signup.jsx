import React from 'react';
import { useForm } from 'react-hook-form';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  MenuItem,
  Paper,
  Link
} from '@mui/material';
import axiosInstance from '../api/axiosInstance';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const { register, handleSubmit, watch } = useForm();
  const role = watch('role');
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const res = await axiosInstance.post('/signup', data);
      console.log('Signup success', res.data);
      navigate('/login');
    } catch (err) {
      console.error('Signup error', err.response?.data?.message || err.message);
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
            Create an account
          </Typography>
          <Typography variant="body2" color="text.secondary" align="center" mb={3}>
            Join the community and start sharing knowledge!
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)}>
            <TextField
              fullWidth
              label="Name"
              margin="normal"
              {...register('name')}
            />
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
            <TextField
              select
              fullWidth
              label="Role"
              margin="normal"
              {...register('role')}
            >
              <MenuItem value="student">Student</MenuItem>
              <MenuItem value="faculty">Faculty</MenuItem>
            </TextField>

            {role === 'student' && (
              <>
                <TextField
                  fullWidth
                  label="Branch"
                  margin="normal"
                  {...register('branch')}
                />
                <TextField
                  fullWidth
                  label="Year"
                  margin="normal"
                  {...register('year')}
                />
              </>
            )}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, py: 1.5, fontWeight: 'bold', borderRadius: 2 }}
            >
              Register
            </Button>

            <Typography variant="body2" align="center" mt={2}>
              Already have an account?{' '}
              <Link
                onClick={() => navigate('/login')}
                sx={{ cursor: 'pointer', fontWeight: 500 }}
              >
                Sign in
              </Link>
            </Typography>
          </form>
        </Paper>
      </Container>
    </Box>
  );
};

export default Signup;
