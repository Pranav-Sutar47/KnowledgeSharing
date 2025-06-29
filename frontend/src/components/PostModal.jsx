import React, { useState } from 'react';
import {
  Modal, Box, Typography, TextField, Button
} from '@mui/material';

const PostModal = ({ open, handleClose, handleAddPost }) => {
  const [title, setTitle] = useState('');
  const [file, setFile] = useState(null);

  const handleSubmit = () => {
    if (title.trim() === '' || !file) return;

    const newPost = {
      title,
      fileName: file.name
    };

    handleAddPost(newPost);
    setTitle('');
    setFile(null);
    handleClose();
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        p={4}
        bgcolor="white"
        borderRadius={2}
        boxShadow={24}
        sx={{
          width: 400,
          mx: 'auto',
          mt: '10%',
          display: 'flex',
          flexDirection: 'column',
          gap: 2
        }}
      >
        <Typography variant="h6" fontWeight="bold">
          Upload New File
        </Typography>

        <TextField
          label="Title"
          fullWidth
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <Button
          variant="contained"
          component="label"
        >
          Select File
          <input
            hidden
            type="file"
            accept=".pdf,.ppt,.pptx,.doc,.docx"
            onChange={(e) => setFile(e.target.files[0])}
          />
        </Button>

        {file && (
          <Typography variant="body2" color="textSecondary">
            📎 {file.name}
          </Typography>
        )}

        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Upload
        </Button>
      </Box>
    </Modal>
  );
};

export default PostModal;
