import React, { useState } from 'react';
import {
  Box, Typography, TextField, Button, Paper, Avatar,
  Divider
} from '@mui/material';
import CommentIcon from '@mui/icons-material/Comment';
import { useParams } from 'react-router-dom';

const PostDetail = () => {
  const { author } = useParams(); // teacher name from URL

  const [posts, setPosts] = useState([
    {
      id: 1,
      title: 'Unit 1 Notes',
      access: 'public',
      files: [
        { name: 'oop-concepts.pdf', size: '2MB' },
        { name: 'class-diagram.pdf', size: '1.2MB' }
      ],
      comments: [
        {
          id: 1,
          text: 'This helped me a lot!',
          author: 'Student A',
          replies: [],
          replying: false,
          replyText: ''
        }
      ],
      newComment: ''
    },
    {
      id: 2,
      title: 'Python Practice',
      access: 'students',
      files: [
        { name: 'loops.py', size: '850KB' }
      ],
      comments: [],
      newComment: ''
    }
  ]);

  const handleCommentChange = (id, value) => {
    setPosts(prev =>
      prev.map(post =>
        post.id === id ? { ...post, newComment: value } : post
      )
    );
  };

  const handleCommentSubmit = (id) => {
    setPosts(prev =>
      prev.map(post => {
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
      })
    );
  };

  const toggleReply = (postId, commentId) => {
    setPosts(prev =>
      prev.map(post => {
        if (post.id !== postId) return post;
        return {
          ...post,
          comments: post.comments.map(c =>
            c.id === commentId
              ? { ...c, replying: !c.replying }
              : c
          )
        };
      })
    );
  };

  const handleReplyChange = (postId, commentId, value) => {
    setPosts(prev =>
      prev.map(post => {
        if (post.id !== postId) return post;
        return {
          ...post,
          comments: post.comments.map(c =>
            c.id === commentId ? { ...c, replyText: value } : c
          )
        };
      })
    );
  };

  const handleReplySubmit = (postId, commentId) => {
    setPosts(prev =>
      prev.map(post => {
        if (post.id !== postId) return post;
        return {
          ...post,
          comments: post.comments.map(c => {
            if (c.id === commentId && c.replyText.trim()) {
              const reply = {
                id: Date.now(),
                text: c.replyText,
                author: 'You'
              };
              return {
                ...c,
                replies: [...c.replies, reply],
                replying: false,
                replyText: ''
              };
            }
            return c;
          })
        };
      })
    );
  };

  return (
    <Box px={{ xs: 2, sm: 6, md: 10 }} py={5} bgcolor="#f0f4f8" minHeight="100vh">
      <Typography variant="h4" fontWeight="bold" color="#0d47a1" mb={5}>
        🧑‍🏫 Posts by {author}
      </Typography>

      <Box display="flex" gap={4} flexWrap="wrap" mb={4}>
        {posts.map(post => (
          <Paper
            key={post.id}
            sx={{
              width: 280,
              p: 2,
              borderRadius: 4,
              boxShadow: 4,
              backgroundColor: '#fff',
              display: 'flex',
              flexDirection: 'column',
              gap: 1.5
            }}
          >
            <Box display="flex" flexDirection="column" alignItems="center" gap={1}>
              <img
                src="/images/folder-icon.jpg"
                alt="Folder"
                style={{ width: 60, height: 60 }}
              />
              <Typography fontWeight="bold">{post.title}</Typography>
              <Typography variant="caption" color="gray">
                Access: {post.access}
              </Typography>
            </Box>

            <Box mt={1}>
              {post.files.map((file, i) => (
                <Typography key={i} variant="body2" noWrap>
                  📎 {file.name}
                </Typography>
              ))}
            </Box>

            <Divider sx={{ my: 1 }} />

            <Box display="flex" alignItems="center">
              <CommentIcon sx={{ mr: 1, color: '#4e342e' }} />
              <Typography variant="subtitle2">Comments</Typography>
            </Box>

            <Box>
              {post.comments.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  No comments yet
                </Typography>
              ) : (
                post.comments.map(c => (
                  <Box key={c.id} mb={1}>
                    <Box display="flex" bgcolor="#e3f2fd" borderRadius={2} p={1}>
                      <Avatar sx={{ width: 26, height: 26, bgcolor: '#1565c0', mr: 1 }}>
                        {c.author.charAt(0)}
                      </Avatar>
                      <Typography variant="body2">
                        <strong>{c.author}</strong>: {c.text}
                      </Typography>
                    </Box>

                    <Box pl={5} mt={1}>
                      {c.replies.map(reply => (
                        <Box
                          key={reply.id}
                          display="flex"
                          alignItems="center"
                          bgcolor="#fce4ec"
                          borderRadius={2}
                          p={1}
                          mb={0.5}
                        >
                          <Avatar sx={{ width: 22, height: 22, bgcolor: '#d81b60', mr: 1 }}>
                            {reply.author.charAt(0)}
                          </Avatar>
                          <Typography variant="body2">
                            <strong>{reply.author}</strong>: {reply.text}
                          </Typography>
                        </Box>
                      ))}

                      {c.replying && (
                        <Box display="flex" gap={1} mt={1}>
                          <TextField
                            fullWidth
                            size="small"
                            placeholder="Reply..."
                            value={c.replyText || ''}
                            onChange={(e) =>
                              handleReplyChange(post.id, c.id, e.target.value)
                            }
                          />
                          <Button
                            variant="contained"
                            size="small"
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
                        >
                          Reply
                        </Button>
                      )}
                    </Box>
                  </Box>
                ))
              )}
            </Box>

            <Box mt={2} display="flex" gap={1}>
              <TextField
                fullWidth
                size="small"
                placeholder="Write a comment..."
                value={post.newComment}
                onChange={(e) => handleCommentChange(post.id, e.target.value)}
              />
              <Button
                variant="contained"
                onClick={() => handleCommentSubmit(post.id)}
              >
                Post
              </Button>
            </Box>
          </Paper>
        ))}
      </Box>
    </Box>
  );
};

export default PostDetail;
