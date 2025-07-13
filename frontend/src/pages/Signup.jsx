import React, { useState } from "react";
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
  Link,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
} from "@mui/material";
import { School } from "@mui/icons-material";
import { useAuth } from "../features/auth/AuthContext";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { ROLES, BRANCHES, CLASSES } from "../utils/constants";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
    branch: "",
    year: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const result = await signup(formData);
      if (result.success) {
        setSuccess("Account created successfully! Please login.");
        // Auto-login after successful signup
        const role = result.data.user.role;
        if (role === "faculty") {
          navigate("/teacher/dashboard");
        } else {
          navigate("/student/dashboard");
        }
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError("Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="sm" sx={{ px: { xs: 2, sm: 3 } }}>
      <Box
        sx={{
          marginTop: { xs: 4, sm: 8 },
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Paper elevation={3} sx={{ padding: { xs: 2, sm: 4 }, width: "100%" }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              mb: { xs: 2, sm: 3 },
            }}
          >
            <School
              sx={{
                fontSize: { xs: 32, sm: 40 },
                color: "primary.main",
                mb: 2,
              }}
            />
            <Typography
              component="h1"
              variant="h4"
              gutterBottom
              sx={{ fontSize: { xs: "1.75rem", sm: "2.125rem" } }}
            >
              EduShare
            </Typography>
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{
                fontSize: { xs: "1rem", sm: "1.25rem" },
                textAlign: "center",
              }}
            >
              Create your account
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {success}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="name"
              label="Full Name"
              name="name"
              autoComplete="name"
              autoFocus
              value={formData.name}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="new-password"
              value={formData.password}
              onChange={handleChange}
              inputProps={{
                maxLength: 8,
                minLength: 4,
              }}
            />

            <FormControl fullWidth margin="normal" required>
              <InputLabel>Role</InputLabel>
              <Select
                name="role"
                value={formData.role}
                onChange={handleChange}
                label="Role"
              >
                <MenuItem value="faculty">Teacher</MenuItem>
                <MenuItem value="student">Student</MenuItem>
              </Select>
            </FormControl>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth margin="normal" required>
                  <InputLabel>Branch</InputLabel>
                  <Select
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
              </Grid>

              {formData.role === "student" && (
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth margin="normal" required>
                    <InputLabel>Year</InputLabel>
                    <Select
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
                </Grid>
              )}
            </Grid>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : "Sign Up"}
            </Button>
            <Box sx={{ textAlign: "center" }}>
              <Link component={RouterLink} to="/login" variant="body2">
                Already have an account? Sign In
              </Link>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Signup;
