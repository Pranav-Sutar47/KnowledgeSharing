// imports remain same
import React, { useState } from 'react';
import {
  Box, Typography, TextField, Button, Paper, Avatar,
  Divider, MenuItem, Dialog, DialogTitle, DialogContent,
  DialogActions, IconButton
} from '@mui/material';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import CommentIcon from '@mui/icons-material/Comment';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import { useParams } from 'react-router-dom';

const PostDetail = () => {
  const { name } = useParams();

  const [posts, setPosts] = useState([
    {
      id: 1,
      title: 'OOP Concepts - PPT',
      folders: [
        {
          name: 'Unit 1 Notes',
          access: 'public',
          files: [
            { name: 'oop-notes.pdf', size: '2MB' },
            { name: 'inheritance-examples.pdf', size: '1.5MB' }
          ]
        }
      ],
      comments: [],
      newComment: ''
    }
  ]);

  const [newFolderName, setNewFolderName] = useState('');
  const [selectedAccess, setSelectedAccess] = useState('public');
  const [year, setYear] = useState('');
  const [division, setDivision] = useState('');
  const [openFolders, setOpenFolders] = useState({});
  const [editDialog, setEditDialog] = useState({ open: false, postIndex: null, folderIndex: null });
  const [editFolderName, setEditFolderName] = useState('');
  const [editAccess, setEditAccess] = useState('');

  const createPost = () => ({
    id: Date.now(),
    title: '',
    folders: [],
    comments: [],
    newComment: ''
  });

  const createFolder = (name, access) => ({
    name,
    access,
    files: []
  });

  const handleAddPost = () => {
    setPosts(prev => [createPost(), ...prev]);
  };

  const handleTitleChange = (postIndex, value) => {
    const updated = [...posts];
    updated[postIndex].title = value;
    setPosts(updated);
  };

  const handleAddFolderToPost = (postIndex) => {
    if (!newFolderName.trim()) return;

    const access =
      selectedAccess === 'year-division' && year && division
        ? `${year}-${division}`
        : selectedAccess;

    const newFolder = createFolder(newFolderName, access);
    const updated = [...posts];
    updated[postIndex].folders.push(newFolder);
    setPosts(updated);
    setNewFolderName('');
  };

  const handleFileUpload = (postIndex, folderIndex, files) => {
    const updated = [...posts];
    const folder = updated[postIndex].folders[folderIndex];
    const newFiles = Array.from(files).map(file => ({
      name: file.name,
      size: file.size
    }));
    folder.files.push(...newFiles);
    setPosts(updated);
  };

  const handleDeleteFile = (postIndex, folderIndex, fileIndex) => {
    const updated = [...posts];
    updated[postIndex].folders[folderIndex].files.splice(fileIndex, 1);
    setPosts(updated);
  };

  const handleDeleteFolder = (postIndex, folderIndex) => {
    const updated = [...posts];
    updated[postIndex].folders.splice(folderIndex, 1);
    setPosts(updated);
  };

  const openEditDialog = (postIndex, folderIndex) => {
    const folder = posts[postIndex].folders[folderIndex];
    setEditFolderName(folder.name);
    setEditAccess(folder.access);
    setEditDialog({ open: true, postIndex, folderIndex });
  };

  const handleSaveEdit = () => {
    const updated = [...posts];
    updated[editDialog.postIndex].folders[editDialog.folderIndex].name = editFolderName;
    updated[editDialog.postIndex].folders[editDialog.folderIndex].access = editAccess;
    setPosts(updated);
    setEditDialog({ open: false, postIndex: null, folderIndex: null });
  };

  const handleCommentChange = (postIndex, value) => {
    const updated = [...posts];
    updated[postIndex].newComment = value;
    setPosts(updated);
  };

  const handleCommentSubmit = (postIndex) => {
    const post = posts[postIndex];
    if (!post.newComment.trim()) return;
    const newComment = {
      id: Date.now(),
      text: post.newComment,
      author: 'You',
      replies: [],
      replying: false,
      replyText: ''
    };
    const updated = [...posts];
    updated[postIndex].comments.push(newComment);
    updated[postIndex].newComment = '';
    setPosts(updated);
  };

  return (
    <Box px={{ xs: 2, sm: 6, md: 12 }} py={5} bgcolor="#f0f4f8" minHeight="100vh">
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" fontWeight="bold" color="#0d47a1">
          📚 My Posts {name && `- ${name}`}
        </Typography>
        <Button
          variant="contained"
          sx={{
            background: 'linear-gradient(to right, #3f51b5, #5c6bc0)',
            color: '#fff',
            borderRadius: 4,
            fontWeight: 'bold',
            textTransform: 'none',
            px: 3
          }}
          onClick={handleAddPost}
        >
          ➕ New Post
        </Button>
      </Box>

      {posts.map((post, postIndex) => (
        <Paper key={post.id} sx={{ p: 4, mb: 5, borderRadius: 4 }}>
          <Box mb={2}>
            <TextField
              fullWidth
              label="Enter post title"
              variant="outlined"
              value={post.title}
              onChange={(e) => handleTitleChange(postIndex, e.target.value)}
            />
          </Box>

          {/* Folder creation */}
          <Box display="flex" flexWrap="wrap" gap={2} mb={2}>
            <TextField
              label="Folder Name"
              size="small"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
            />
            <TextField
              select
              label="Access"
              size="small"
              value={selectedAccess}
              onChange={(e) => setSelectedAccess(e.target.value)}
              sx={{ width: 160 }}
            >
              <MenuItem value="public">🌐 Public</MenuItem>
              <MenuItem value="students">🎓 Students</MenuItem>
              <MenuItem value="teachers">🧑‍🏫 Teachers</MenuItem>
              <MenuItem value="private">🔒 Private</MenuItem>
              <MenuItem value="year-division">📚 Year + Division</MenuItem>
            </TextField>
            <Button variant="outlined" onClick={() => handleAddFolderToPost(postIndex)}>
              ➕ Add Folder
            </Button>
          </Box>

          {/* Folder cards */}
          <Box display="flex" flexWrap="wrap" gap={2} mb={4}>
            {post.folders.map((folder, folderIndex) => {
              const folderKey = `${postIndex}-${folderIndex}`;
              const isOpen = openFolders[folderKey];

              return (
                <Box
                  key={folderIndex}
                  sx={{
                    backgroundColor: '#fff',
                    borderRadius: 2,
                    p: 2,
                    width: 250,
                    boxShadow: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                  }}
                >
                  <img src="/images/folder-icon.jpg" alt="Folder" width={60} height={60} style={{ cursor: 'pointer' }}
                    onClick={() =>
                      setOpenFolders(prev => ({
                        ...prev,
                        [folderKey]: !prev[folderKey]
                      }))
                    }
                  />
                  <Typography fontWeight="bold" mt={1}>{folder.name}</Typography>
                  <Typography variant="caption" color="textSecondary">
                    Access: {folder.access}
                  </Typography>

                  <Box mt={1} display="flex" gap={1}>
                    <Button
                      size="small"
                      onClick={() => openEditDialog(postIndex, folderIndex)}
                      startIcon={<EditIcon />}
                    >
                      Edit
                    </Button>
                    <Button
                      size="small"
                      color="error"
                      onClick={() => handleDeleteFolder(postIndex, folderIndex)}
                      startIcon={<DeleteIcon />}
                    >
                      Delete
                    </Button>
                  </Box>

                  <Button
                    variant="contained"
                    component="label"
                    size="small"
                    sx={{ mt: 2 }}
                  >
                    Upload Files
                    <input
                      type="file"
                      multiple
                      hidden
                      onChange={(e) =>
                        handleFileUpload(postIndex, folderIndex, e.target.files)
                      }
                    />
                  </Button>

                  {isOpen && (
                    <Box mt={1} width="100%">
                      {folder.files.map((file, fileIndex) => (
                        <Box
                          key={fileIndex}
                          display="flex"
                          justifyContent="space-between"
                          alignItems="center"
                        >
                          <Typography variant="body2" noWrap>
                            📎 {file.name}
                          </Typography>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleDeleteFile(postIndex, folderIndex, fileIndex)}
                          >
                            <CloseIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      ))}
                    </Box>
                  )}
                </Box>
              );
            })}
          </Box>

          {/* Comment section */}
          <Divider sx={{ my: 2 }} />
          <Box display="flex" alignItems="center" mb={1}>
            <CommentIcon sx={{ mr: 1, color: '#4e342e' }} />
            <Typography variant="subtitle1" fontWeight="medium">Comments</Typography>
          </Box>

          <Box display="flex" gap={2} mt={2}>
            <TextField
              fullWidth
              label="Write a comment"
              variant="outlined"
              size="small"
              value={post.newComment}
              onChange={(e) => handleCommentChange(postIndex, e.target.value)}
            />
            <Button
              variant="contained"
              color="success"
              onClick={() => handleCommentSubmit(postIndex)}
            >
              Post
            </Button>
          </Box>
        </Paper>
      ))}

      {/* Edit Folder Dialog */}
      <Dialog open={editDialog.open} onClose={() => setEditDialog({ open: false })}>
        <DialogTitle>Edit Folder</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Folder Name"
            margin="normal"
            value={editFolderName}
            onChange={(e) => setEditFolderName(e.target.value)}
          />
          <TextField
            fullWidth
            select
            label="Access"
            margin="normal"
            value={editAccess}
            onChange={(e) => setEditAccess(e.target.value)}
          >
            <MenuItem value="public">🌐 Public</MenuItem>
            <MenuItem value="students">🎓 Students</MenuItem>
            <MenuItem value="teachers">🧑‍🏫 Teachers</MenuItem>
            <MenuItem value="private">🔒 Private</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialog({ open: false })}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveEdit}>Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PostDetail;
