import React, { useState } from "react";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";
import { useAuth } from '../features/auth/AuthContext';
import { useNavigate } from "react-router-dom";
import Alert from '@mui/material/Alert';


const BRANCHES = [
  'Computer Engineering',
  'Information Technology',
  'Civil Engineering',
  'Mechanical Engineering',
  'Electronics and Telecommunication Engineering',
  'Computer Science Engineering (AIML)',
  'Computer Engineering Regional',
  'Electronics Engineering'
];
const CLASSES = ["FE", "SE", "TE", "BE"];

const SignupForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
    branch: "",
    year: "",
  });

  const navigate  = useNavigate();

  const { signup } = useAuth();

  const [alert, setAlert] = useState({
    open: false,
    type: "", // success | error
    message: "",
  });


  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "password" && value.length > 8) return;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "role" && value !== "student" ? { year: "" } : {}),
    }));
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const result = await signup(formData);

    if (result.success) {
      setAlert({
        open: true,
        type: "success",
        message: "Signup successful! Redirecting to login...",
      });

      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } else {
      setAlert({
        open: true,
        type: "error",
        message: result.message || "Signup failed",
      });
    }

  } catch (err) {
    setAlert({
      open: true,
      type: "error",
      message: "Something went wrong",
    });
  }
};



  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          backgroundColor: "#f9f9f9",
          padding: { xs: 3, sm: 5 },
          borderRadius: 2,
          boxShadow: 3,
          width: "100%",
        }}
      >
        <img
          src="https://cdn-icons-png.flaticon.com/512/3135/3135755.png"
          alt="Logo"
          width={60}
        />
        <Typography component="h1" variant="h5" fontWeight="bold" mt={2}>
          EduShare
        </Typography>
        <Typography component="p" variant="body1" mt={1} color="text.secondary">
          Create your account
        </Typography>

        {alert.open && (
          <Alert
            severity={alert.type}
            variant="outlined"
            sx={{ width: "100%", mb: 2 }}
          >
            {alert.message}
          </Alert>
        )}


        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3, width: '100%' }}>
          <TextField
            fullWidth
            required
            label="Full Name"
            name="name"
            margin="normal"
            value={formData.name}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            required
            label="Email Address"
            name="email"
            type="email"
            margin="normal"
            value={formData.email}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            required
            label="Password"
            name="password"
            type="password"
            margin="normal"
            value={formData.password}
            onChange={handleChange}
          />

          <FormControl fullWidth margin="normal" required>
            <InputLabel id="role-label">Role</InputLabel>
            <Select
              labelId="role-label"
              name="role"
              value={formData.role}
              onChange={handleChange}
              label="Role"
            >
              <MenuItem value="student">Student</MenuItem>
              <MenuItem value="faculty">Teacher</MenuItem>
            </Select>
          </FormControl>

          {formData.role && (
            <>
              <FormControl fullWidth required margin="normal">
                <InputLabel id="branch-label">Branch</InputLabel>
                <Select
                  labelId="branch-label"
                  name="branch"
                  value={formData.branch}
                  onChange={handleChange}
                  label="Branch"
                >
                  {BRANCHES.map((branch) => (
                    <MenuItem key={branch} value={branch}>
                      {branch}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {formData.role === "student" && (
                <FormControl fullWidth required margin="normal">
                  <InputLabel id="year-label">Year</InputLabel>
                  <Select
                    labelId="year-label"
                    name="year"
                    value={formData.year}
                    onChange={handleChange}
                    label="Year"
                  >
                    {CLASSES.map((year) => (
                      <MenuItem key={year} value={year}>
                        {year}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            </>
          )}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              mt: 3,
              mb: 2,
              bgcolor: "#0057D9",
              ":hover": { bgcolor: "#0045ad" },
              textTransform: "none",
              fontWeight: "bold",
            }}
          >
            Sign Up
          </Button>

          <Typography variant="body2" align="center">
            Already have an account?{" "}
            <a href="/login" style={{ textDecoration: "none", color: "#1976d2" }}>
              Sign In
            </a>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default SignupForm;
