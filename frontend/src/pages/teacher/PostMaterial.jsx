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
  LinearProgress
} from '@mui/material';
import { CloudUpload, Save, Cancel, AttachFile } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import materialService from '../../services/materialService';
import { ACCESS_LEVELS, BRANCHES, CLASSES } from '../../utils/constants';

const PostMaterial = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    access: 'allStudents',
    allowedBranches: [],
    allowedClasses: [],
    folderId: ''
  });
  const [files, setFiles] = useState([]);
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    fetchFolders();
  }, []);

  const fetchFolders = async () => {
    try {
      const result = await materialService.getMaterialList();
      if (result.success) {
        setFolders(result.data.folders || []);
      }
    } catch (error) {
      console.error('Failed to fetch folders:', error);
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
    setFiles(selectedFiles);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (files.length === 0) {
      setError('Please select at least one file');
      return;
    }

    setLoading(true);
    setError('');
    setUploadProgress(0);

    try {
      const submitData = new FormData();
      
      // Add form fields
      submitData.append('title', formData.title);
      submitData.append('description', formData.description);
      
      // Handle folder assignment
      if (formData.folderId) {
        submitData.append('folderId', formData.folderId);
      } else {
        submitData.append('access', formData.access);
        if (formData.access === ACCESS_LEVELS.SPECIFIC_BRANCH_OR_CLASS) {
          submitData.append('allowedBranches', JSON.stringify(formData.allowedBranches));
          submitData.append('allowedClasses', JSON.stringify(formData.allowedClasses));
        } else {
          submitData.append('allowedBranches', JSON.stringify([]));
          submitData.append('allowedClasses', JSON.stringify([]));
        }
      }

      // Add files
      files.forEach((file) => {
        submitData.append('material', file);
      });

      // Log what we're sending
      console.log('Submitting material with:', {
        title: formData.title,
        description: formData.description,
        folderId: formData.folderId,
        access: formData.access,
        filesCount: files.length
      });
      const result = await materialService.addMaterial(submitData);
      if (result.success) {
        setSuccess('Material posted successfully!');
        setFiles([]); // Clear files
        setFormData({
          title: '',
          description: '',
          access: 'allStudents',
          allowedBranches: [],
          allowedClasses: [],
          folderId: ''
        });
        setTimeout(() => {
          navigate('/teacher/dashboard');
        }, 2000);
      } else {
        setError(result.message);
      }
    } catch (error) {
      console.error('Submit error:', error);
      setError('Failed to post material');
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ fontSize: { xs: '1.75rem', sm: '2.125rem' } }}>
        Post New Material
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
              <FormControl fullWidth>
                <InputLabel>Select Folder (Optional)</InputLabel>
                <Select
                  name="folderId"
                  value={formData.folderId}
                  onChange={handleChange}
                  label="Select Folder (Optional)"
                >
                  <MenuItem value="">
                    <em>No Folder (Standalone Post)</em>
                  </MenuItem>
                  {folders.map((folder) => (
                    <MenuItem key={folder._id} value={folder._id}>
                      {folder.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {!formData.folderId && (
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
            )}

            {!formData.folderId && formData.access === ACCESS_LEVELS.SPECIFIC_BRANCH_OR_CLASS && (
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
                    <Typography variant="h6" sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>File Upload</Typography>
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
                  
                  {files.length > 0 && (
                    <Box>
                      <Typography variant="subtitle2" sx={{ mb: 1, fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                        Selected Files ({files.length}):
                      </Typography>
                      {files.map((file, index) => (
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

            {loading && (
              <Grid item xs={12}>
                <LinearProgress variant="determinate" value={uploadProgress} />
                <Typography variant="body2" color="text.secondary" sx={{ 
                  mt: 1,
                  fontSize: { xs: '0.75rem', sm: '0.875rem' }
                }}>
                  Uploading... {uploadProgress}%
                </Typography>
              </Grid>
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
                  disabled={loading}
                 fullWidth={window.innerWidth < 600}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<Save />}
                  disabled={loading || files.length === 0}
                 fullWidth={window.innerWidth < 600}
                >
                  {loading ? <CircularProgress size={20} /> : 'Post Material'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Box>
  );
};

export default PostMaterial;