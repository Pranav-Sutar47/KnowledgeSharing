import React, { useState } from 'react';
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
  Chip,
  Alert,
  CircularProgress,
  Grid
} from '@mui/material';
import { Save, Cancel } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import folderService from '../../services/folderService';
import { ACCESS_LEVELS, BRANCHES, CLASSES } from '../../utils/constants';

const CreateFolder = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    access: 'allStudents',
    allowedBranches: [],
    allowedClasses: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleArrayChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const submitData = {
        ...formData,
        allowedBranches: formData.access === ACCESS_LEVELS.SPECIFIC_BRANCH_OR_CLASS ? formData.allowedBranches : [],
        allowedClasses: formData.access === ACCESS_LEVELS.SPECIFIC_BRANCH_OR_CLASS ? formData.allowedClasses : []
      };

      const result = await folderService.createFolder(submitData);
      if (result.success) {
        setSuccess('Folder created successfully!');
        setTimeout(() => {
          navigate('/teacher/dashboard');
        }, 2000);
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError('Failed to create folder');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ fontSize: { xs: '1.75rem', sm: '2.125rem' } }}>
        Create New Folder
      </Typography>
      
      <Paper sx={{ p: { xs: 2, sm: 3 }, mt: 3 }}>
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

        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={{ xs: 2, sm: 3 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Folder Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Enter folder name"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                multiline
                rows={4}
                placeholder="Enter folder description"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Access Level</InputLabel>
                <Select
                  name="access"
                  value={formData.access}
                  onChange={handleChange}
                  label="Access Level"
                >
                  <MenuItem value={ACCESS_LEVELS.ALL_STUDENTS}>All Students</MenuItem>
                  <MenuItem value={ACCESS_LEVELS.FACULTY_ONLY}>Faculty Only</MenuItem>
                  <MenuItem value={ACCESS_LEVELS.SPECIFIC_BRANCH_OR_CLASS}>Specific Branch/Class</MenuItem>
                  <MenuItem value={ACCESS_LEVELS.BOTH}>Both Faculty & Students</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {formData.access === ACCESS_LEVELS.SPECIFIC_BRANCH_OR_CLASS && (
              <>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Allowed Branches</InputLabel>
                    <Select
                      multiple
                      value={formData.allowedBranches}
                      onChange={(e) => handleArrayChange('allowedBranches', e.target.value)}
                      renderValue={(selected) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {selected.map((value) => (
                            <Chip key={value} label={value} size="small" />
                          ))}
                        </Box>
                      )}
                    >
                      {BRANCHES.map((branch) => (
                        <MenuItem key={branch} value={branch}>
                          {branch}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Allowed Classes</InputLabel>
                    <Select
                      multiple
                      value={formData.allowedClasses}
                      onChange={(e) => handleArrayChange('allowedClasses', e.target.value)}
                      renderValue={(selected) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {selected.map((value) => (
                            <Chip key={value} label={value} size="small" />
                          ))}
                        </Box>
                      )}
                    >
                      {CLASSES.map((cls) => (
                        <MenuItem key={cls} value={cls}>
                          {cls}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </>
            )}

            <Grid item xs={12}>
              <Box sx={{ 
                display: 'flex', 
                gap: { xs: 1, sm: 2 }, 
                justifyContent: { xs: 'stretch', sm: 'flex-end' },
                flexDirection: { xs: 'column', sm: 'row' }
              }}>
                <Button
                  variant="outlined"
                  startIcon={<Cancel />}
                  onClick={() => navigate('/teacher/dashboard')}
                  fullWidth={window.innerWidth < 600}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<Save />}
                  disabled={loading}
                  fullWidth={window.innerWidth < 600}
                >
                  {loading ? <CircularProgress size={20} /> : 'Create Folder'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Box>
  );
};

export default CreateFolder;