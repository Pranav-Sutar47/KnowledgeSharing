import React, { useState } from 'react';
import {
  Box, Typography, TextField, Button, Paper, Avatar, Divider, Stack
} from '@mui/material';
import { useParams } from 'react-router-dom';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import CommentIcon from '@mui/icons-material/Comment';

const PostDetail = () => {
  const { name } = useParams();

  const [posts, setPosts] = useState([
    {
      id: 1,
      title: 'OOP Concepts - PPT',
      file: 'oop-concepts.pdf',
      comments: [
        {
          id: 1,
          text: 'Great resource!',
          author: 'Student A',
          replies: [],
          replying: false,
          replyText: ''
        },
        {
          id: 2,
          text: 'Thanks for sharing!',
          author: 'Student B',
          replies: [],
          replying: false,
          replyText: ''
        }
      ],
      newComment: ''
    },
    {
      id: 2,
      title: 'Python Basics',
      file: 'python-basics.pdf',
      comments: [],
      newComment: ''
    }
  ]);

  const handleCommentChange = (id, value) => {
    setPosts(prevPosts => prevPosts.map(post =>
      post.id === id ? { ...post, newComment: value } : post
    ));
  };

  const handleCommentSubmit = (id) => {
    setPosts(prevPosts => prevPosts.map(post => {
      if (post.id === id && post.newComment.trim()) {
        const newComment = {
          id: Date.now(),
          text: post.newComment,
          author: 'You',
          replies: [],
          replying: false,
          replyText: ''
        };
        return {
          ...post,
          comments: [...post.comments, newComment],
          newComment: ''
        };
      }
      return post;
    }));
  };

  const toggleReply = (postId, commentId) => {
    setPosts(posts.map(post => {
      if (post.id !== postId) return post;
      return {
        ...post,
        comments: post.comments.map(comment =>
          comment.id === commentId
            ? { ...comment, replying: !comment.replying }
            : comment
        )
      };
    }));
  };

  const handleReplyChange = (postId, commentId, value) => {
    setPosts(posts.map(post => {
      if (post.id !== postId) return post;
      return {
        ...post,
        comments: post.comments.map(comment =>
          comment.id === commentId ? { ...comment, replyText: value } : comment
        )
      };
    }));
  };

  const handleReplySubmit = (postId, commentId) => {
    setPosts(posts.map(post => {
      if (post.id !== postId) return post;
      return {
        ...post,
        comments: post.comments.map(comment => {
          if (comment.id === commentId && comment.replyText.trim()) {
            const newReply = {
              id: Date.now(),
              text: comment.replyText,
              author: 'You'
            };
            return {
              ...comment,
              replies: [...comment.replies, newReply],
              replying: false,
              replyText: ''
            };
          }
          return comment;
        })
      };
    }));
  };

  return (
    <Box px={{ xs: 2, sm: 6, md: 12 }} py={5} bgcolor="#f0f4f8" minHeight="100vh">
      <Typography variant="h4" fontWeight="bold" color="#0d47a1" align="center" mb={5}>
        📚 My Posts {name}
      </Typography>

      <Stack spacing={4}>
        {posts.map(post => (
          <Paper
            key={post.id}
            elevation={4}
            sx={{
              p: 4,
              borderRadius: 4,
              backgroundColor: '#ffffff',
              display: 'flex',
              flexDirection: 'column',
              gap: 2
            }}
          >
            <Box display="flex" alignItems="center">
              <InsertDriveFileIcon sx={{ color: '#1565c0', mr: 1 }} />
              <Typography variant="h6" fontWeight="bold">{post.title}</Typography>
            </Box>

            <Button
              variant="contained"
              color="primary"
              size="small"
              sx={{ width: '150px', borderRadius: 2 }}
              href={`/${post.file}`}
              target="_blank"
              startIcon={<InsertDriveFileIcon />}
            >
              View PDF
            </Button>

            <Divider sx={{ my: 2 }} />

            <Box display="flex" alignItems="center">
              <CommentIcon sx={{ mr: 1, color: '#4e342e' }} />
              <Typography variant="subtitle1" fontWeight="medium">Comments</Typography>
            </Box>

            {post.comments.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                No comments yet. Be the first to comment!
              </Typography>
            ) : (
              post.comments.map((c) => (
                <Box key={c.id} mb={1}>
                  <Box display="flex" alignItems="center" bgcolor="#e3f2fd" borderRadius={2} p={1.2} mb={0.5}>
                    <Avatar sx={{ width: 28, height: 28, bgcolor: '#1976d2', mr: 1.2 }}>
                      {c.author.charAt(0)}
                    </Avatar>
                    <Typography variant="body2">
                      <strong>{c.author}</strong>: {c.text}
                    </Typography>
                  </Box>

                  {/* Replies */}
                  <Box pl={6} display="flex" flexDirection="column" gap={1}>
                    {c.replies && c.replies.map((reply) => (
                      <Box
                        key={reply.id}
                        display="flex"
                        alignItems="center"
                        bgcolor="#fce4ec"
                        borderRadius={2}
                        p={1}
                      >
                        <Avatar sx={{ width: 24, height: 24, bgcolor: '#d81b60', mr: 1 }}>
                          {reply.author.charAt(0)}
                        </Avatar>
                        <Typography variant="body2">
                          <strong>{reply.author}</strong>: {reply.text}
                        </Typography>
                      </Box>
                    ))}

                    {/* Reply input */}
                    {c.replying && (
                      <Box display="flex" gap={1} mt={1}>
                        <TextField
                          fullWidth
                          size="small"
                          placeholder="Write a reply..."
                          value={c.replyText || ''}
                          onChange={(e) => handleReplyChange(post.id, c.id, e.target.value)}
                        />
                        <Button
                          variant="contained"
                          color="secondary"
                          onClick={() => handleReplySubmit(post.id, c.id)}
                        >
                          Reply
                        </Button>
                      </Box>
                    )}

                    {!c.replying && (
                      <Button
                        onClick={() => toggleReply(post.id, c.id)}
                        size="small"
                        sx={{ alignSelf: 'flex-start', pl: 0 }}
                      >
                        Reply
                      </Button>
                    )}
                  </Box>
                </Box>
              ))
            )}

            <Box display="flex" gap={2} mt={2}>
              <TextField
                fullWidth
                label="Write a comment"
                variant="outlined"
                size="small"
                value={post.newComment}
                onChange={(e) => handleCommentChange(post.id, e.target.value)}
              />
              <Button
                variant="contained"
                color="success"
                onClick={() => handleCommentSubmit(post.id)}
                sx={{ px: 3 }}
              >
                Post
              </Button>
            </Box>
          </Paper>
        ))}
      </Stack>
    </Box>
  );
};

export default PostDetail;
