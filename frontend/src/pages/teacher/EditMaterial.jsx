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
  Chip,
  Alert,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { Save, Cancel, Delete, CloudUpload, AttachFile, Visibility } from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import materialService from '../../services/materialService';
import FilePreview from '../../components/FilePreview';
import { ACCESS_LEVELS, BRANCHES, CLASSES } from '../../utils/constants';

const EditMaterial = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [material, setMaterial] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    access: 'allStudents',
    allowedBranches: [],
    allowedClasses: []
  });
  const [newFiles, setNewFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [deleteDialog, setDeleteDialog] = useState({ open: false, itemId: null });

  useEffect(() => {
    if (id) {
      fetchMaterial();
    }
  }, [id]);

  const fetchMaterial = async () => {
    setLoading(true);
    try {
      const result = await materialService.getMaterial(id);
      if (result.success) {
        const materialData = result.data;
        setMaterial(materialData);
        setFormData({
          title: materialData.title || '',
          description: materialData.description || '',
          access: materialData.access || 'allStudents',
          allowedBranches: materialData.allowedBranches || [],
          allowedClasses: materialData.allowedClasses || []
        });
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError('Failed to fetch material');
    } finally {
      setLoading(false);
    }
  };

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

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setNewFiles(selectedFiles);
  };

  const handleDeleteItem = async (itemId) => {
    try {
      const result = await materialService.removeItem(id, itemId);
      if (result.success) {
        setSuccess('Item removed successfully');
        fetchMaterial(); // Refresh material data
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError('Failed to remove item');
    }
    setDeleteDialog({ open: false, itemId: null });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const submitData = new FormData();
      
      // Add form fields
      submitData.append('materialId', id);
      submitData.append('title', formData.title);
      submitData.append('description', formData.description);
      submitData.append('access', formData.access);
      
      if (formData.access === ACCESS_LEVELS.SPECIFIC_BRANCH_OR_CLASS) {
        submitData.append('allowedBranches', JSON.stringify(formData.allowedBranches));
        submitData.append('allowedClasses', JSON.stringify(formData.allowedClasses));
      } else {
        submitData.append('allowedBranches', JSON.stringify([]));
        submitData.append('allowedClasses', JSON.stringify([]));
      }

      // Add new files if any
      newFiles.forEach((file) => {
        submitData.append('material', file);
      });

      const result = await materialService.updateMaterial(submitData);
      if (result.success) {
        setSuccess('Material updated successfully!');
        setNewFiles([]);
        setTimeout(() => {
          navigate('/teacher/dashboard');
        }, 2000);
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError('Failed to update material');
    } finally {
      setSaving(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!material) {
    return (
      <Box sx={{ mt: 4 }}>
        <Alert severity="error">Material not found</Alert>
        <Button onClick={() => navigate('/teacher/dashboard')} sx={{ mt: 2 }}>
          Back to Dashboard
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ fontSize: { xs: '1.75rem', sm: '2.125rem' } }}>
        Edit Material
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
                label="Material Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="Enter material title"
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
                placeholder="Enter material description"
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

            {/* Existing Files */}
            {material.items && material.items.length > 0 && (
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>
                  Current Files
                </Typography>
                <Grid container spacing={2}>
                  {material.items.map((item, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                      <Card variant="outlined">
                        <CardContent>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                            <Typography variant="subtitle2" sx={{ 
                              fontSize: { xs: '0.875rem', sm: '1rem' },
                              wordBreak: 'break-word',
                              flex: 1
                            }}>
                              {item.originalFileName}
                            </Typography>
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => setDeleteDialog({ open: true, itemId: item._id })}
                            >
                              <Delete />
                            </IconButton>
                          </Box>
                          <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                            {formatFileSize(item.size)}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            )}

            {/* Add New Files */}
            <Grid item xs={12}>
              <Card variant="outlined">
                <CardContent>
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    mb: 2,
                    flexDirection: { xs: 'column', sm: 'row' },
                    textAlign: { xs: 'center', sm: 'left' }
                  }}>
                    <AttachFile sx={{ mr: 1 }} />
                    <Typography variant="h6" sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>Add New Files</Typography>
                  </Box>
                  
                  <Button
                    variant="outlined"
                    component="label"
                    startIcon={<CloudUpload />}
                    fullWidth
                    sx={{ mb: 2, fontSize: { xs: '0.875rem', sm: '1rem' } }}
                  >
                    Select Files
                    <input
                      type="file"
                      multiple
                      hidden
                      onChange={handleFileChange}
                      accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.jpg,.jpeg,.png,.gif,.mp4,.mp3,.txt"
                    />
                  </Button>
                  
                  {newFiles.length > 0 && (
                    <Box>
                      <Typography variant="subtitle2" sx={{ mb: 1, fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                        New Files ({newFiles.length}):
                      </Typography>
                      {newFiles.map((file, index) => (
                        <Box key={index} sx={{ 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          py: 1,
                          flexDirection: { xs: 'column', sm: 'row' },
                          gap: { xs: 0.5, sm: 0 }
                        }}>
                          <Typography variant="body2" sx={{ 
                            fontSize: { xs: '0.75rem', sm: '0.875rem' },
                            wordBreak: 'break-word'
                          }}>
                            {file.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                            {formatFileSize(file.size)}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>

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
                  disabled={saving}
                  fullWidth={window.innerWidth < 600}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<Save />}
                  disabled={saving}
                  fullWidth={window.innerWidth < 600}
                >
                  {saving ? <CircularProgress size={20} /> : 'Update Material'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Paper>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, itemId: null })}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this file? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, itemId: null })}>
            Cancel
          </Button>
          <Button 
            onClick={() => handleDeleteItem(deleteDialog.itemId)} 
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EditMaterial;