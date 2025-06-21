import React from 'react';
import { useForm } from 'react-hook-form';
import { Button, TextField, Typography, Container, MenuItem } from '@mui/material';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const { register, handleSubmit, watch } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const res = await api.post('/user/signup', data);
      localStorage.setItem('accessToken', res.data.data.accessToken);
      navigate('/dashboard');
    } catch (err) {
      alert(err.response?.data?.message || 'Signup failed');
    }
  };

  const role = watch('role');

  return (
    <Container maxWidth="xs" sx={{ mt: 10 }}>
      <Typography variant="h5" gutterBottom>Signup</Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField fullWidth label="Name" {...register("name")} margin="normal" />
        <TextField fullWidth label="Email" {...register("email")} margin="normal" />
        <TextField fullWidth label="Password" type="password" {...register("password")} margin="normal" />
        <TextField
          fullWidth
          select
          label="Role"
          {...register("role")}
          margin="normal"
        >
          <MenuItem value="student">Student</MenuItem>
          <MenuItem value="faculty">Faculty</MenuItem>
        </TextField>
        {role === 'student' && (
          <>
            <TextField fullWidth label="Branch" {...register("branch")} margin="normal" />
            <TextField fullWidth label="Year" {...register("year")} margin="normal" />
          </>
        )}
        <Button fullWidth variant="contained" type="submit" sx={{ mt: 2 }}>Signup</Button>
      </form>
    </Container>
  );
};

export default Signup;
