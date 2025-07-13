import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Button,
  CircularProgress,
  Alert,
  Chip,
  Divider,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Grid,
  Container,
  Card,
  CardContent,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  ArrowBack,
  Comment,
  Send,
  PictureAsPdf,
  Image,
  Videocam,
  AudioFile,
  Description,
  OpenInNew
} from '@mui/icons-material';
import materialService from '../services/materialService';
import commentService from '../services/commentService';
import { useAuth } from '../features/auth/AuthContext';
import FilePreview from '../components/FilePreview';
import { formatDate } from '../utils/formatters';

const MaterialView = () => {
  const { id } = useParams(); // This is the material ID
  const navigate = useNavigate();
  const { user } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [material, setMaterial] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  useEffect(() => {
    if (id) {
      fetchMaterial();
      fetchComments();
    }
  }, [id]);

  const fetchMaterial = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('Fetching material with ID:', id);
      const result = await materialService.getMaterial(id);
      if (result.success) {
        console.log('Material data received:', result.data);
        setMaterial(result.data);
        // Set the first file as selected by default
        if (result.data.items && result.data.items.length > 0) {
          setSelectedFile(result.data.items[0]);
        }
      } else {
        setError(result.message || 'Failed to load material');
      }
    } catch (err) {
      console.error('Error fetching material:', err);
      setError('Failed to load material');
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const result = await commentService.getComments(id);
      if (result.success) {
        setComments(result.data || []);
      }
    } catch (err) {
      console.error('Error fetching comments:', err);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      setCommentLoading(true);
      const result = await commentService.addComment(id, newComment);
      if (result.success) {
        setNewComment('');
        // Add the new comment immediately with current user info
        const currentUser = {
          name: localStorage.getItem('name') || user?.name || 'Anonymous',
          email: localStorage.getItem('email') || user?.email || '',
          branch: localStorage.getItem('branch') || user?.branch || '',
          year: localStorage.getItem('year') || user?.year || ''
        };
        
        const newCommentObj = {
          _id: Date.now().toString(), // Temporary ID
          content: newComment,
          author: currentUser,
          user: currentUser, // Fallback
          createdAt: new Date().toISOString()
        };
        
        setComments(prev => [...prev, newCommentObj]);
        
        // Also refresh from server to get the real comment data
        setTimeout(() => fetchComments(), 1000);
      }
    } catch (err) {
      console.error('Error adding comment:', err);
    } finally {
      setCommentLoading(false);
    }
  };

  const handleOpenInNewTab = (file) => {
    if (file?.cloudinaryUrl) {
      window.open(file.cloudinaryUrl, '_blank', 'noopener,noreferrer');
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

  const formatFileSize = (bytes) => {
    if (!bytes || bytes === 0 || isNaN(bytes)) return 'Unknown size';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate(-1)}
          variant="outlined"
        >
          Go Back
        </Button>
      </Container>
    );
  }

  if (!material) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="warning" sx={{ mb: 2 }}>
          Material not found
        </Alert>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate(-1)}
          variant="outlined"
        >
          Go Back
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 4 } }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate(-1)}
          variant="outlined"
          sx={{ mb: 2 }}
        >
          Back
        </Button>
        
        <Typography 
          variant="h4" 
          component="h1" 
          gutterBottom
          sx={{ 
            fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
            fontWeight: 'bold'
          }}
        >
          {material.title}
        </Typography>
        
        {material.description && (
          <Typography 
            variant="body1" 
            color="text.secondary" 
            sx={{ mb: 2, fontSize: { xs: '0.9rem', sm: '1rem' } }}
          >
            {material.description}
          </Typography>
        )}

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
          <Chip
            label={material.access === 'allStudents' ? 'All Students' : 
                   material.access === 'facultyOnly' ? 'Faculty Only' : 
                   material.access}
            size="small"
            color={material.access === 'allStudents' ? 'success' : 
                   material.access === 'facultyOnly' ? 'error' : 'default'}
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

        <Typography variant="caption" color="text.secondary">
          Created: {formatDate(material.createdAt)}
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* File List and Preview Section */}
        <Grid item xs={12} lg={8}>
          {/* File List */}
          {material.items && material.items.length > 1 && (
            <Paper sx={{ p: 2, mb: 2 }}>
              <Typography variant="h6" gutterBottom>
                Files ({material.items.length})
              </Typography>
              <List dense>
                {material.items.map((file, index) => (
                  <ListItem
                    key={file._id || index}
                    button
                    selected={selectedFile?._id === file._id}
                    onClick={() => setSelectedFile(file)}
                    sx={{
                      borderRadius: 1,
                      mb: 0.5,
                      '&.Mui-selected': {
                        backgroundColor: 'primary.light',
                        color: 'primary.contrastText',
                        '&:hover': {
                          backgroundColor: 'primary.main',
                        }
                      }
                    }}
                  >
                    <ListItemAvatar>
                      {getFileIcon(file.originalFileName)}
                    </ListItemAvatar>
                    <ListItemText
                      primary={file.originalFileName}
                      secondary={`${formatFileSize(file.size)} • ${file.resourceType || 'File'}`}
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>
          )}

          {/* File Preview */}
          {selectedFile && (
            <Paper sx={{ p: { xs: 2, sm: 3 } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 1 }}>
                <Typography variant="h6" sx={{ flexGrow: 1, wordBreak: 'break-word' }}>
                  {getFileIcon(selectedFile.originalFileName)} {selectedFile.originalFileName}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  <Button
                    startIcon={<OpenInNew />}
                    onClick={() => handleOpenInNewTab(selectedFile)}
                    variant="contained"
                    size="small"
                  >
                    Open
                  </Button>
                </Box>
              </Box>

              {/* File Info */}
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Size: {formatFileSize(selectedFile.size)} • 
                  Type: {selectedFile.resourceType || 'File'} • 
                  Uploaded: {formatDate(selectedFile.uploadedAt)}
                </Typography>
              </Box>

              {/* Embedded Preview */}
              <Box sx={{ 
                height: { xs: 300, sm: 400, md: 500 }, 
                border: '1px solid #e0e0e0',
                borderRadius: 1,
                overflow: 'hidden'
              }}>
                <FilePreview 
                  file={selectedFile}
                  showDownload={false}
                />
              </Box>
            </Paper>
          )}
        </Grid>

        {/* Comments Section */}
        <Grid item xs={12} lg={4}>
          <Paper sx={{ p: { xs: 2, sm: 3 }, height: 'fit-content' }}>
            <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
              <Comment sx={{ mr: 1 }} />
              Comments ({comments.length})
            </Typography>

            {/* Add Comment */}
            <Box sx={{ mb: 3 }}>
              <TextField
                fullWidth
                multiline
                rows={3}
                placeholder="Add a comment or ask a doubt..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                variant="outlined"
                size="small"
                sx={{ mb: 1 }}
              />
              <Button
                fullWidth
                variant="contained"
                startIcon={<Send />}
                onClick={handleAddComment}
                disabled={!newComment.trim() || commentLoading}
                size="small"
              >
                {commentLoading ? 'Posting...' : 'Post Comment'}
              </Button>
            </Box>

            <Divider sx={{ mb: 2 }} />

            {/* Comments List */}
            <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
              {comments.length === 0 ? (
                <Typography variant="body2" color="text.secondary" textAlign="center">
                  No comments yet. Be the first to comment!
                </Typography>
              ) : (
                <List sx={{ p: 0 }}>
                  {comments.map((comment) => (
                    <ListItem key={comment._id} sx={{ px: 0, alignItems: 'flex-start' }}>
                      <ListItemAvatar>
                        <Avatar sx={{ width: 32, height: 32, fontSize: '0.875rem' }}>
                          {(comment.author?.name || comment.user?.name || 'User')?.charAt(0)?.toUpperCase()}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Typography variant="subtitle2" sx={{ fontSize: '0.875rem' }}>
                            {comment.author?.name || comment.user?.name || 'Anonymous'}
                          </Typography>
                        }
                        secondary={
                          <Box>
                            <Typography variant="body2" sx={{ mt: 0.5, mb: 0.5 }}>
                              {comment.content}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {formatDate(comment.createdAt)}
                            </Typography>
                            {(comment.author?.branch || comment.user?.branch) && (
                              <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                                {comment.author?.branch || comment.user?.branch}
                                {(comment.author?.year || comment.user?.year) && ` - ${comment.author?.year || comment.user?.year}`}
                              </Typography>
                            )}
                          </Box>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Preview Dialog */}
      <Dialog
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        maxWidth="lg"
        fullWidth
        fullScreen={isMobile}
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          pb: 1
        }}>
          <Typography variant="h6" noWrap>
            {selectedFile?.originalFileName}
          </Typography>
          <IconButton onClick={() => setPreviewOpen(false)} size="small">
            ✕
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 0, height: { xs: '100%', sm: '70vh' } }}>
          {selectedFile && (
            <FilePreview 
              file={selectedFile}
              showDownload={false}
            />
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => handleOpenInNewTab(selectedFile)} startIcon={<OpenInNew />}>
            Open in New Tab
          </Button>
          <Button onClick={() => setPreviewOpen(false)}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default MaterialView;