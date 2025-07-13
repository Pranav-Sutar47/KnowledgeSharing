import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Grid,
  IconButton,
  useTheme,
  useMediaQuery,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider
} from '@mui/material';
import { 
  ArrowBack, 
  Description, 
  PictureAsPdf, 
  Image, 
  Videocam, 
  AudioFile,
  Visibility
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import materialService from '../services/materialService';
import { formatDate } from '../utils/formatters';

const FolderView = () => {
  const { id } = useParams(); // This is the folderId
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [folderData, setFolderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      fetchFolderMaterials();
    }
  }, [id]);

  const fetchFolderMaterials = async () => {
    setLoading(true);
    setError('');
    try {
      console.log('Fetching materials for folder ID:', id);
      const result = await materialService.getMaterialsFromFolder(id);
      if (result.success) {
        console.log('Folder data received:', result.data);
        // Handle the API response structure correctly
        setFolderData({
          materials: result.data || [],
          folder: { name: 'Folder Contents' } // Default folder info
        });
      } else {
        setError(result.message || 'Failed to fetch folder materials');
      }
    } catch (error) {
      console.error('Error fetching folder materials:', error);
      setError('Failed to fetch folder materials');
    } finally {
      setLoading(false);
    }
  };

  const getFileIcon = (fileName) => {
    if (!fileName) return <Description />;
    
    const extension = fileName.split('.').pop()?.toLowerCase();
    
    switch (extension) {
      case 'pdf':
        return <PictureAsPdf color="error" />;
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
      case 'webp':
        return <Image color="primary" />;
      case 'mp4':
      case 'avi':
      case 'mov':
      case 'wmv':
        return <Videocam color="secondary" />;
      case 'mp3':
      case 'wav':
      case 'aac':
        return <AudioFile color="warning" />;
      default:
        return <Description color="action" />;
    }
  };

  const handleViewMaterial = (material) => {
    console.log('Navigating to material:', material._id);
    navigate(`/material/${material._id}`);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
        <IconButton onClick={() => navigate(-1)} sx={{ mt: 2 }}>
          <ArrowBack />
        </IconButton>
      </Box>
    );
  }

  if (!folderData) {
    return (
      <Box sx={{ mt: 4 }}>
        <Alert severity="warning">Folder not found</Alert>
        <IconButton onClick={() => navigate(-1)} sx={{ mt: 2 }}>
          <ArrowBack />
        </IconButton>
      </Box>
    );
  }

  // Use the correct data structure
  const materials = folderData.materials || [];
  const folder = folderData.folder || { name: 'Folder Contents' };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        mb: 3,
        flexDirection: { xs: 'column', sm: 'row' },
        gap: { xs: 2, sm: 0 }
      }}>
        <IconButton 
          onClick={() => navigate(-1)}
          sx={{ mr: { sm: 2 } }}
        >
          <ArrowBack />
        </IconButton>
        <Box sx={{ flexGrow: 1, textAlign: { xs: 'center', sm: 'left' } }}>
          <Typography variant="h4" sx={{ fontSize: { xs: '1.5rem', sm: '2.125rem' } }}>
            {folder.name || 'Folder Contents'}
          </Typography>
          {folder.description && (
            <Typography variant="body1" color="text.secondary" sx={{ 
              mt: 1,
              fontSize: { xs: '0.875rem', sm: '1rem' }
            }}>
              {folder.description}
            </Typography>
          )}
          {folder.createdAt && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Created: {formatDate(folder.createdAt)}
            </Typography>
          )}
        </Box>
      </Box>

      {/* Materials List */}
      {materials && materials.length > 0 ? (
        <Box>
          <Typography variant="h6" gutterBottom sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>
            Materials ({materials.length})
          </Typography>
          
          {isMobile ? (
            // Mobile: List View
            <List>
              {materials.map((material, index) => (
                <React.Fragment key={material._id}>
                  <ListItem
                    sx={{ 
                      px: 0,
                      py: 2,
                      cursor: 'pointer',
                      '&:hover': {
                        backgroundColor: 'action.hover',
                        borderRadius: 1
                      }
                    }}
                    onClick={() => handleViewMaterial(material)}
                  >
                    <ListItemIcon>
                      {getFileIcon(material.items?.[0]?.originalFileName)}
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                          {material.title}
                        </Typography>
                      }
                      secondary={
                        <Box>
                          {material.description && (
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                              {material.description}
                            </Typography>
                          )}
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                            <Chip
                              label={material.access === 'allStudents' ? 'All Students' : 
                                     material.access === 'facultyOnly' ? 'Faculty Only' : 
                                     material.access}
                              size="small"
                              color={material.access === 'allStudents' ? 'success' : 
                                     material.access === 'facultyOnly' ? 'error' : 'default'}
                            />
                            <Typography variant="caption" color="text.secondary">
                              {formatDate(material.createdAt)}
                            </Typography>
                          </Box>
                        </Box>
                      }
                    />
                  </ListItem>
                  {index < materials.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          ) : (
            // Desktop: Card View
            <Grid container spacing={2}>
              {materials.map((material) => (
                <Grid item xs={12} sm={6} lg={4} key={material._id}>
                  <Card sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column',
                    cursor: 'pointer',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: 4
                    }
                  }}>
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        {getFileIcon(material.items?.[0]?.originalFileName)}
                        <Typography variant="h6" component="div" sx={{ 
                          ml: 1,
                          fontSize: '1.1rem',
                          wordBreak: 'break-word'
                        }}>
                          {material.title}
                        </Typography>
                      </Box>
                      
                      {material.description && (
                        <Typography variant="body2" color="text.secondary" sx={{ 
                          mb: 2,
                          wordBreak: 'break-word',
                          display: '-webkit-box',
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden'
                        }}>
                          {material.description}
                        </Typography>
                      )}

                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                        <Chip
                          label={material.access === 'allStudents' ? 'All Students' : 
                                 material.access === 'facultyOnly' ? 'Faculty Only' : 
                                 material.access}
                          size="small"
                          color={material.access === 'allStudents' ? 'success' : 
                                 material.access === 'facultyOnly' ? 'error' : 'default'}
                        />
                        
                        {material.items && material.items.length > 0 && (
                          <Chip
                            label={`${material.items.length} file${material.items.length > 1 ? 's' : ''}`}
                            size="small"
                            variant="outlined"
                          />
                        )}
                      </Box>

                      <Typography variant="caption" color="text.secondary">
                        Created: {formatDate(material.createdAt)}
                      </Typography>
                    </CardContent>

                    <CardActions>
                      <Button
                        size="small"
                        startIcon={<Visibility />}
                        onClick={() => handleViewMaterial(material)}
                        fullWidth
                      >
                        View Material
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      ) : (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Description sx={{ fontSize: { xs: 60, sm: 80 }, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>
            No materials in this folder
          </Typography>
          <Typography color="text.secondary" sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
            This folder is empty or materials are not accessible to you
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default FolderView;