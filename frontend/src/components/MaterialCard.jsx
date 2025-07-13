import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Divider
} from '@mui/material';
import {
  MoreVert,
  Folder,
  Description,
  Edit,
  Delete,
  Comment,
  Share,
  Visibility
} from '@mui/icons-material';
import { formatDate } from '../utils/formatters';
import { useAuth } from '../features/auth/AuthContext';

const MaterialCard = ({ 
  material, 
  isFolder = false, 
  onView, 
  onEdit, 
  onDelete, 
  onComment,
  showActions = true 
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const { isTeacher } = useAuth();

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    onEdit && onEdit(material);
    handleMenuClose();
  };

  const handleDelete = () => {
    onDelete && onDelete(material);
    handleMenuClose();
  };

  const handleView = () => {
    if (material.name) {
      // It's a folder
      onView && onView(material);
    } else {
      // It's a material
      onView && onView(material);
    }
  };

  const handleComment = () => {
    onComment && onComment(material);
  };

  const getAccessColor = (access) => {
    switch (access) {
      case 'allStudents':
        return 'success';
      case 'facultyOnly':
        return 'error';
      case 'specificBranchOrClass':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getAccessLabel = (access) => {
    switch (access) {
      case 'allStudents':
        return 'All Students';
      case 'facultyOnly':
        return 'Faculty Only';
      case 'specificBranchOrClass':
        return 'Specific Access';
      default:
        return access;
    }
  };

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', minHeight: { xs: 180, sm: 200 } }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: 1
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            {isFolder ? (
              <Folder sx={{ mr: 1, color: 'primary.main' }} />
            ) : (
              <Description sx={{ mr: 1, color: 'text.secondary' }} />
            )}
            <Typography variant="h6" component="div" sx={{ 
              fontSize: { xs: '1rem', sm: '1.25rem' },
              wordBreak: 'break-word'
            }}>
              {material.title || material.name}
            </Typography>
          </Box>
          
          {showActions && isTeacher && (
            <IconButton
              size="small"
              onClick={handleMenuOpen}
              sx={{ ml: 1 }}
            >
              <MoreVert />
            </IconButton>
          )}
        </Box>

        {material.description && (
          <Typography variant="body2" color="text.secondary" sx={{ 
            mb: 2,
            fontSize: { xs: '0.75rem', sm: '0.875rem' },
            wordBreak: 'break-word'
          }}>
            {material.description}
          </Typography>
        )}

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
          <Chip
            label={getAccessLabel(material.access)}
            size="small"
            color={getAccessColor(material.access)}
          />
          
          {material.allowedBranches && material.allowedBranches.length > 0 && (
            <Chip
              label={`${material.allowedBranches.length} Branch(es)`}
              size="small"
              variant="outlined"
            />
          )}
          
          {material.allowedClasses && material.allowedClasses.length > 0 && (
            <Chip
              label={`${material.allowedClasses.length} Class(es)`}
              size="small"
              variant="outlined"
            />
          )}
        </Box>

        <Typography variant="caption" color="text.secondary" sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>
          Created: {formatDate(material.createdAt)}
        </Typography>
      </CardContent>

      <Divider />

      <CardActions sx={{ 
        justifyContent: 'space-between',
        flexDirection: { xs: 'column', sm: 'row' },
        gap: { xs: 1, sm: 0 },
        p: { xs: 1, sm: 2 }
      }}>
        <Button
          size={window.innerWidth < 600 ? "small" : "medium"}
          startIcon={<Visibility />}
          onClick={handleView}
          fullWidth={window.innerWidth < 600}
        >
          View
        </Button>
        
        {!isFolder && (
          <Button
            size={window.innerWidth < 600 ? "small" : "medium"}
            startIcon={<Comment />}
            onClick={handleComment}
            fullWidth={window.innerWidth < 600}
          >
            Comments
          </Button>
        )}
      </CardActions>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleEdit}>
          <Edit sx={{ mr: 1 }} />
          Edit
        </MenuItem>
        <MenuItem onClick={handleDelete}>
          <Delete sx={{ mr: 1 }} />
          Delete
        </MenuItem>
      </Menu>
    </Card>
  );
};

export default MaterialCard;