import React, { useState } from 'react';
import {
  Box, Card, Typography, TextField, IconButton,
  Avatar, Button, Tooltip, Select, MenuItem, InputLabel, FormControl
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const Profile = () => {
  const [editable, setEditable] = useState(false);
  const [profile, setProfile] = useState({
    name: 'Saurabh Mali',
    email: 'sdmaniitian@gmail.com',
    password: '********',
    role: 'Student',
    branch: 'Computer Engineering',
    year: 'II'
  });

  const handleToggleEdit = () => {
    setEditable(!editable);
  };

  const handleChange = (field, value) => {
    setProfile({ ...profile, [field]: value });
  };

  const fieldLabels = {
    name: "Full Name",
    email: "Email Address",
    password: "Password",
    role: "Role",
    branch: "Branch",
    year: "Academic Year"
  };

  const yearOptions = ['I', 'II', 'III', 'IV'];
  const roleOptions = ['Student', 'Teacher'];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(to right, #c9d6ff, #e2e2e2)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        p: 2
      }}
    >
      <Card
        sx={{
          width: '100%',
          maxWidth: 600,
          borderRadius: 4,
          boxShadow: 8,
          px: { xs: 3, sm: 6 },
          py: { xs: 4, sm: 6 },
          backgroundColor: 'white',
        }}
      >
        <Box display="flex" justifyContent="center" mb={3}>
          <Avatar sx={{ bgcolor: '#1565c0', width: 100, height: 100 }}>
            <AccountCircleIcon sx={{ fontSize: 70 }} />
          </Avatar>
        </Box>

        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4" fontWeight="bold" color="primary">
            User Profile
          </Typography>
          <Tooltip title={editable ? "Save" : "Edit"}>
            <IconButton onClick={handleToggleEdit} color={editable ? "success" : "primary"}>
              {editable ? <SaveIcon fontSize="large" /> : <EditIcon fontSize="large" />}
            </IconButton>
          </Tooltip>
        </Box>

        {/* Profile Fields */}
        {Object.keys(profile).map((field) => (
          <Box key={field} mb={2}>
            <Typography fontWeight="500" fontSize="1.1rem" mb={1}>
              {fieldLabels[field]}
            </Typography>

            {field === 'role' || field === 'year' ? (
              <FormControl fullWidth disabled={!editable}>
                <Select
                  value={profile[field]}
                  onChange={(e) => handleChange(field, e.target.value)}
                  size="small"
                >
                  {(field === 'role' ? roleOptions : yearOptions).map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            ) : (
              <TextField
                fullWidth
                size="large"
                value={profile[field]}
                onChange={(e) => handleChange(field, e.target.value)}
                disabled={!editable}
                type={field === 'password' ? 'password' : 'text'}
                InputProps={{ sx: { fontSize: '1.1rem', py: 1.5 } }}
              />
            )}
          </Box>
        ))}

        {editable && (
          <Box mt={4} display="flex" justifyContent="center">
            <Button variant="contained" color="primary" size="large" onClick={handleToggleEdit}>
              Save Changes
            </Button>
          </Box>
        )}
      </Card>
    </Box>
  );
};

export default Profile;
