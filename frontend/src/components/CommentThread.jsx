import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  CircularProgress,
  Alert
} from '@mui/material';
import { Send, Comment as CommentIcon } from '@mui/icons-material';
import { useAuth } from '../features/auth/AuthContext';
import commentService from '../services/commentService';
import { formatDate } from '../utils/formatters';

const CommentThread = ({ materialId, onClose }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    fetchComments();
  }, [materialId]);

  const fetchComments = async () => {
    setLoading(true);
    try {
      const result = await commentService.getComments(materialId);
      if (result.success) {
        setComments(result.data || []);
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError('Failed to fetch comments');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return;

    // Check if user is authenticated before allowing comment
    if (!user && !localStorage.getItem('name')) {
      setError('You must be logged in to comment');
      return;
    }

    setSubmitLoading(true);
    try {
      const result = await commentService.addComment(materialId, newComment);
      if (result.success) {
        setNewComment('');
        
        // Get current user info - prioritize user object over localStorage
        const currentUser = {
          name: user?.name || localStorage.getItem('name'),
          email: user?.email || localStorage.getItem('email'),
          branch: user?.branch || localStorage.getItem('branch'),
          year: user?.year || localStorage.getItem('year')
        };
        
        // Only add immediate comment if we have user data
        if (currentUser.name) {
          const newCommentObj = {
            _id: Date.now().toString(), // Temporary ID
            content: newComment,
            author: currentUser,
            user: currentUser, // Fallback
            createdAt: new Date().toISOString()
          };
          
          setComments(prev => [...prev, newCommentObj]);
        }
        
        // Refresh from server to get the real comment data
        setTimeout(() => fetchComments(), 1000);
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError('Failed to add comment');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleReply = async (doubtId, replyContent) => {
    if (!replyContent.trim()) return;

    try {
      const result = await commentService.replyToComment(doubtId, replyContent);
      if (result.success) {
        fetchComments(); // Refresh comments
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError('Failed to reply to comment');
    }
  };

  // Helper function to get display name
  const getDisplayName = (comment) => {
    return comment.author?.name || comment.user?.name || 'Unknown User';
  };

  return (
    <Paper sx={{ 
      p: { xs: 2, sm: 3 }, 
      maxHeight: { xs: '70vh', sm: '600px' }, 
      overflow: 'auto' 
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <CommentIcon sx={{ mr: 1 }} />
        <Typography variant="h6" sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>Discussion</Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Add new comment */}
      <Box sx={{ mb: { xs: 2, sm: 3 } }}>
        <TextField
          fullWidth
          multiline
          rows={{ xs: 2, sm: 3 }}
          placeholder="Add a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          sx={{ mb: 2, fontSize: { xs: '0.875rem', sm: '1rem' } }}
        />
        <Button
          variant="contained"
          startIcon={<Send />}
          onClick={handleSubmitComment}
          disabled={!newComment.trim() || submitLoading}
          size={window.innerWidth < 600 ? "small" : "medium"}
        >
          {submitLoading ? <CircularProgress size={20} /> : 'Post Comment'}
        </Button>
      </Box>

      <Divider sx={{ mb: 2 }} />

      {/* Comments list */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <CircularProgress />
        </Box>
      ) : comments.length === 0 ? (
        <Typography color="text.secondary" sx={{ 
          textAlign: 'center', 
          py: 3,
          fontSize: { xs: '0.875rem', sm: '1rem' }
        }}>
          No comments yet. Be the first to comment!
        </Typography>
      ) : (
        <List>
          {comments.map((comment, index) => (
            <React.Fragment key={comment._id || index}>
              <ListItem alignItems="flex-start">
                <ListItemAvatar sx={{ minWidth: { xs: 40, sm: 56 } }}>
                  <Avatar sx={{ width: { xs: 32, sm: 40 }, height: { xs: 32, sm: 40 } }}>
                    {getDisplayName(comment).charAt(0).toUpperCase()}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box sx={{ 
                      display: 'flex', 
                      mb: 1,
                      flexDirection: { xs: 'column', sm: 'row' },
                      alignItems: { xs: 'flex-start', sm: 'center' }
                    }}>
                      <Typography variant="subtitle2" sx={{ 
                        mr: 1,
                        fontSize: { xs: '0.875rem', sm: '1rem' }
                      }}>
                        {getDisplayName(comment)}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>
                        {formatDate(comment.createdAt)}
                      </Typography>
                     {(comment.author?.branch || comment.user?.branch) && (
                       <Typography variant="caption" color="text.secondary" sx={{ 
                         fontSize: { xs: '0.7rem', sm: '0.75rem' },
                         display: 'block'
                       }}>
                         {comment.author?.branch || comment.user?.branch}
                         {(comment.author?.year || comment.user?.year) && ` - ${comment.author?.year || comment.user?.year}`}
                       </Typography>
                     )}
                    </Box>
                  }
                  secondary={
                    <Typography variant="body2" color="text.primary" sx={{ 
                      fontSize: { xs: '0.875rem', sm: '1rem' },
                      wordBreak: 'break-word'
                    }}>
                      {comment.content}
                    </Typography>
                  }
                />
              </ListItem>
              {/* Reply functionality can be added here */}
              {index < comments.length - 1 && <Divider variant="inset" component="li" />}
            </React.Fragment>
          ))}
        </List>
      )}
    </Paper>
  );
};

export default CommentThread;