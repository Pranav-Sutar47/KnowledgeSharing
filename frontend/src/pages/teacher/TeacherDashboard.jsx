import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { Add, Upload, Folder, School } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import MaterialCard from '../../components/MaterialCard';
import CommentThread from '../../components/CommentThread';
import materialService from '../../services/materialService';
import folderService from '../../services/folderService';

const TeacherDashboard = () => {
  const [materials, setMaterials] = useState([]);
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [commentDialog, setCommentDialog] = useState({ open: false, materialId: null });
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const result = await materialService.getMaterialList();
      if (result.success) {
        setMaterials(result.data.materialsWithoutFolder || []);
        setFolders(result.data.folders || []);
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError('Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleViewItem = (item) => {
    if (item.name) {
      // It's a folder
      navigate(`/folder/${item._id}`);
    } else {
      // It's a material
      navigate(`/material/${item._id}`);
    }
  };

  const handleEditItem = (item) => {
    if (item.name) {
      // It's a folder - navigate to folder edit (you can implement this later)
      console.log('Edit folder:', item._id);
    } else {
      // It's a material
      navigate(`/teacher/edit-material/${item._id}`);
    }
  };

  const handleDeleteItem = async (item) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        const result = item.name 
          ? await folderService.removeFolder(item._id)
          : await materialService.removeMaterial(item._id);
        
        if (result.success) {
          fetchDashboardData();
        } else {
          setError(result.message);
        }
      } catch (error) {
        setError('Failed to delete item');
      }
    }
  };

  const handleComment = (material) => {
    setCommentDialog({ open: true, materialId: material._id });
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ fontSize: { xs: '1.75rem', sm: '2.125rem' } }}>
        Teacher Dashboard
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Quick Actions */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>
          Quick Actions
        </Typography>
        <Box sx={{ 
          display: 'flex', 
          gap: { xs: 1, sm: 2 }, 
          flexWrap: 'wrap',
          flexDirection: { xs: 'column', sm: 'row' }
        }}>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => navigate('/teacher/create-folder')}
            fullWidth={window.innerWidth < 600}
          >
            Create Folder
          </Button>
          <Button
            variant="contained"
            startIcon={<Upload />}
            onClick={() => navigate('/teacher/post-material')}
            fullWidth={window.innerWidth < 600}
          >
            Post Material
          </Button>
        </Box>
      </Box>

      {/* Recent Folders */}
      {folders.length > 0 && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>
            Recent Folders
          </Typography>
          <Grid container spacing={{ xs: 2, sm: 2, md: 3 }}>
            {folders.slice(0, 3).map((folder) => (
              <Grid item xs={12} sm={6} lg={4} key={folder._id}>
                <MaterialCard
                  material={folder}
                  isFolder={true}
                  onView={handleViewItem}
                  onEdit={handleEditItem}
                  onDelete={handleDeleteItem}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* Recent Materials */}
      {materials.length > 0 && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>
            Recent Materials
          </Typography>
          <Grid container spacing={{ xs: 2, sm: 2, md: 3 }}>
            {materials.slice(0, 3).map((material) => (
              <Grid item xs={12} sm={6} lg={4} key={material._id}>
                <MaterialCard
                  material={material}
                  onView={handleViewItem}
                  onEdit={handleEditItem}
                  onDelete={handleDeleteItem}
                  onComment={handleComment}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* Empty State */}
      {materials.length === 0 && folders.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <School sx={{ fontSize: { xs: 60, sm: 80 }, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>
            No content yet
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 3, fontSize: { xs: '0.875rem', sm: '1rem' } }}>
            Start by creating a folder or uploading your first material
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => navigate('/teacher/create-folder')}
            size={window.innerWidth < 600 ? "small" : "medium"}
          >
            Create Folder
          </Button>
        </Box>
      )}

      {/* Comment Dialog */}
      <Dialog
        open={commentDialog.open}
        onClose={() => setCommentDialog({ open: false, materialId: null })}
        maxWidth="sm"
        fullWidth
        fullScreen={window.innerWidth < 600}
      >
        <DialogTitle sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>Comments</DialogTitle>
        <DialogContent>
          {commentDialog.materialId && (
            <CommentThread materialId={commentDialog.materialId} />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCommentDialog({ open: false, materialId: null })}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TeacherDashboard;