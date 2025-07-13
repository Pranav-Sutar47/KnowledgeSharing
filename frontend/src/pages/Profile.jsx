import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  Avatar,
  Divider,
  IconButton,
  Chip,
  Stack,
  Fade,
  Tooltip
} from '@mui/material';
import { 
  Save, 
  Person, 
  School, 
  Edit, 
  Cancel,
  CheckCircle,
  Email,
  Badge,
  AccountTree,
  DateRange
} from '@mui/icons-material';
import { useAuth } from '../features/auth/AuthContext';
import userService from '../services/userService';
import { BRANCHES, CLASSES } from '../utils/constants';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    role: '',
    branch: '',
    year: ''
  });
  const [originalData, setOriginalData] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    // Initialize with current user data
    const initialData = {
      name: localStorage.getItem('name') || user?.name || '',
      email: localStorage.getItem('email') || user?.email || '',
      role: user?.role || '',
      branch: localStorage.getItem('branch') || user?.branch || '',
      year: localStorage.getItem('year') || user?.year || ''
    };
    setProfileData(initialData);
    setOriginalData(initialData);
  }, [user]);

  useEffect(() => {
    // Check if there are any changes
    const changed = Object.keys(profileData).some(key => 
      profileData[key] !== originalData[key]
    );
    setHasChanges(changed);
  }, [profileData, originalData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear messages when user starts typing
    if (error) setError('');
    if (success) setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!hasChanges) {
      setError('No changes to save');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const updateData = {};
      
      // Build update object with only changed fields
      Object.keys(profileData).forEach(key => {
        if (profileData[key] !== originalData[key] && key !== 'email' && key !== 'role') {
          // Special handling for branch - only restrict for students
          if (key === 'branch' && isStudent && !canUpdateBranch) {
            return; // Skip branch update for students after FE
          }
          updateData[key] = profileData[key];
        }
      });

      if (Object.keys(updateData).length === 0) {
        setError('No valid changes to update');
        return;
      }

      const result = await userService.updateProfile(updateData);
      
      if (result.success) {
        setSuccess('Profile updated successfully!');
        setEditMode(false);
        
        // Update localStorage and context
        Object.keys(updateData).forEach(key => {
          if (updateData[key]) {
            localStorage.setItem(key, updateData[key]);
          }
        });
        
        // Update original data to new values
        setOriginalData(profileData);
        
        // Update auth context if available
        if (updateUser) {
          updateUser(profileData);
        }
        
        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(result.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Profile update error:', error);
      setError('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setProfileData(originalData);
    setEditMode(false);
    setError('');
    setSuccess('');
  };

  const canUpdateBranch = profileData.year === 'FE' || !profileData.year;
  const isStudent = profileData.role === 'student';
  const isFaculty = profileData.role === 'faculty';
  
  // Get initials for avatar display
  const getInitials = (name) => {
    if (!name) return 'U';
    const names = name.trim().split(' ');
    if (names.length === 1) return names[0].charAt(0).toUpperCase();
    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
  };

  const getRoleIcon = () => {
    return isFaculty ? <School /> : <Person />;
  };

  const getRoleColor = () => {
    return isFaculty ? 'primary' : 'secondary';
  };

  const getAvatarColor = () => {
    return isFaculty ? 'primary.main' : 'secondary.main';
  };

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography 
          variant="h4" 
          gutterBottom 
          sx={{ 
            fontSize: { xs: '1.75rem', sm: '2.125rem' },
            fontWeight: 600,
            color: 'text.primary'
          }}
        >
          My Profile
        </Typography>
        <Typography 
          variant="body1" 
          color="text.secondary"
          sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
        >
          Manage your personal information and preferences
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Profile Info Card */}
        <Grid item xs={12} md={4}>
          <Card 
            elevation={3}
            sx={{ 
              height: 'fit-content',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <CardContent sx={{ textAlign: 'center', p: 4 }}>
              <Avatar
                sx={{ 
                  width: { xs: 90, sm: 110 }, 
                  height: { xs: 90, sm: 110 }, 
                  mx: 'auto', 
                  mb: 2,
                  bgcolor: 'rgba(255, 255, 255, 0.2)',
                  fontSize: { xs: '2rem', sm: '2.5rem' },
                  fontWeight: 'bold',
                  border: '3px solid rgba(255, 255, 255, 0.3)'
                }}
              >
                {getInitials(profileData.name)}
              </Avatar>
              
              <Typography 
                variant="h5" 
                gutterBottom 
                sx={{ 
                  fontSize: { xs: '1.25rem', sm: '1.5rem' },
                  fontWeight: 600,
                  mb: 1
                }}
              >
                {profileData.name || 'User Name'}
              </Typography>
              
              <Typography 
                variant="body1" 
                sx={{ 
                  fontSize: { xs: '0.875rem', sm: '1rem' },
                  opacity: 0.9,
                  mb: 2,
                  wordBreak: 'break-word'
                }}
              >
                {profileData.email || 'user@example.com'}
              </Typography>
              
              <Chip
                icon={getRoleIcon()}
                label={isFaculty ? 'Teacher' : 'Student'}
                sx={{
                  bgcolor: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  fontWeight: 'bold',
                  mb: 2
                }}
              />

              <Stack spacing={1} sx={{ mt: 2 }}>
                {profileData.branch && (
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <AccountTree sx={{ mr: 1, fontSize: '1rem' }} />
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      {profileData.branch}
                    </Typography>
                  </Box>
                )}

                {profileData.year && isStudent && (
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <DateRange sx={{ mr: 1, fontSize: '1rem' }} />
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      {profileData.year} Year
                    </Typography>
                  </Box>
                )}
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Profile Update Form */}
        <Grid item xs={12} md={8}>
          <Paper 
            elevation={3}
            sx={{ 
              p: { xs: 2, sm: 4 },
              borderRadius: 2,
              position: 'relative'
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography 
                variant="h6" 
                sx={{ 
                  fontSize: { xs: '1.1rem', sm: '1.25rem' },
                  fontWeight: 600,
                  color: 'text.primary'
                }}
              >
                Profile Information
              </Typography>
              {!editMode && (
                <Tooltip title="Edit Profile">
                  <IconButton 
                    onClick={() => setEditMode(true)} 
                    color="primary"
                    sx={{ 
                      bgcolor: 'primary.main',
                      color: 'white',
                      '&:hover': { bgcolor: 'primary.dark' }
                    }}
                  >
                    <Edit />
                  </IconButton>
                </Tooltip>
              )}
            </Box>
            
            <Divider sx={{ mb: 3 }} />

            <Fade in={!!error} timeout={300}>
              <div>
                {error && (
                  <Alert 
                    severity="error" 
                    sx={{ mb: 2 }}
                    onClose={() => setError('')}
                  >
                    {error}
                  </Alert>
                )}
              </div>
            </Fade>
            
            <Fade in={!!success} timeout={300}>
              <div>
                {success && (
                  <Alert 
                    severity="success" 
                    sx={{ mb: 2 }}
                    icon={<CheckCircle />}
                    onClose={() => setSuccess('')}
                  >
                    {success}
                  </Alert>
                )}
              </div>
            </Fade>

            <Box component="form" onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                {/* Full Name */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    name="name"
                    value={profileData.name}
                    onChange={handleChange}
                    disabled={!editMode}
                    variant="outlined"
                    InputProps={{
                      startAdornment: <Person sx={{ mr: 1, color: 'text.secondary' }} />
                    }}
                  />
                </Grid>

                {/* Email */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Email Address"
                    name="email"
                    value={profileData.email}
                    disabled
                    variant="outlined"
                    InputProps={{
                      startAdornment: <Email sx={{ mr: 1, color: 'text.secondary' }} />
                    }}
                  />
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                    Email cannot be changed
                  </Typography>
                </Grid>

                {/* Role */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Role"
                    value={isFaculty ? 'Teacher' : 'Student'}
                    disabled
                    variant="outlined"
                    InputProps={{
                      startAdornment: <Badge sx={{ mr: 1, color: 'text.secondary' }} />
                    }}
                  />
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                    Role is assigned by administration
                  </Typography>
                </Grid>

                {/* Branch */}
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Branch</InputLabel>
                    <Select
                      name="branch"
                      value={profileData.branch}
                      onChange={handleChange}
                      label="Branch"
                      disabled={!editMode}
                    >
                      {BRANCHES.map((branch) => (
                        <MenuItem key={branch} value={branch}>
                          {branch}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  {isStudent && !canUpdateBranch && editMode && (
                    <Typography variant="caption" color="warning.main" sx={{ mt: 1, display: 'block' }}>
                      ⚠️ Branch updates are restricted after FE year, but other fields can still be updated
                    </Typography>
                  )}
                </Grid>

                {/* Year - Only for students */}
                {isStudent && (
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel>Year</InputLabel>
                      <Select
                        name="year"
                        value={profileData.year}
                        onChange={handleChange}
                        label="Year"
                        disabled={!editMode}
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

                {/* Action Buttons */}
                {editMode && (
                  <Grid item xs={12}>
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'flex-end',
                      gap: 2,
                      flexDirection: { xs: 'column', sm: 'row' },
                      pt: 2
                    }}>
                      <Button
                        variant="outlined"
                        startIcon={<Cancel />}
                        onClick={handleCancel}
                        fullWidth={window.innerWidth < 600}
                        sx={{ minWidth: '120px' }}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        variant="contained"
                        startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Save />}
                        disabled={loading || !hasChanges}
                        fullWidth={window.innerWidth < 600}
                        sx={{ minWidth: '120px' }}
                      >
                        {loading ? 'Updating...' : 'Update Profile'}
                      </Button>
                    </Box>
                    
                    {hasChanges && (
                      <Typography 
                        variant="caption" 
                        color="primary" 
                        sx={{ 
                          display: 'block', 
                          textAlign: 'center', 
                          mt: 1,
                          fontStyle: 'italic'
                        }}
                      >
                        You have unsaved changes
                      </Typography>
                    )}
                  </Grid>
                )}
              </Grid>
            </Box>

            {/* Help Text */}
            {!editMode && (
              <Box sx={{ mt: 3, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  Click the edit button to update your profile information
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Profile;