import React, { useState } from 'react';
import {
  AppBar, Toolbar, Typography, TextField, Box,
  Fab, Avatar, Card, CardActionArea, Menu, MenuItem,
  Divider, Grid, Paper, CardMedia
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import NotificationsIcon from '@mui/icons-material/Notifications';
import PostModal from './PostModal';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

  const handleAvatarClick = (event) => setAnchorEl(event.currentTarget);
  const handleCloseMenu = () => setAnchorEl(null);
  const handleNavigate = (path) => {
    handleCloseMenu();
    navigate(path);
  };

  const handleAddPost = (newPost) => {
    setPosts(prev => [...prev, newPost]);
  };

  const teachers = [
    { name: "Mehzabin Pathan", color: "#0d47a1", img: "mehzabin.jpg" },
    { name: "Suwarna Gothane", color: "#6a1b9a", img: "suwarna.jpg" },
    { name: "Anagha Chaudhari", color: "#1b5e20", img: "anagha.jpg" },
    { name: "Rahul Bhosale", color: "#bf360c", img: "rahul.jpg" },
    { name: "Anjali Pawar", color: "#01579b", img: "anjali.jpg" },
  ];

  const students = [
    { name: "Saurabh Mali", color: "#2e7d32", img: "saurabh.jpg" },
    { name: "Rahul Jagtap", color: "#b71c1c", img: "rahulj.jpg" },
    { name: "Riya Singh", color: "#006064", img: "riya.jpg" },
    { name: "Amit Patil", color: "#4a148c", img: "amit.jpg" },
    { name: "Neha Desai", color: "#f57f17", img: "neha.jpg" },
  ];

  const renderCard = (person) => (
    <Card
      key={person.name}
      sx={{
        width: 300,
        height: 320,
        m: 1,
        borderRadius: 4,
        boxShadow: 6,
        cursor: 'pointer',
        overflow: 'hidden',
        backgroundColor: person.color,
        color: '#fff',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <CardActionArea onClick={() => navigate(`/post/${encodeURIComponent(person.name)}`)} sx={{ width: '100%', height: '100%' }}>
        <Box
          sx={{
            width: '100%',
            height: '180px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            p: 2
          }}
        >
          <CardMedia
            component="img"
            image={`/images/${person.img}`}
            alt={person.name}
            sx={{
              width: 150,
              height: 150,
              borderRadius: '50%',
              objectFit: 'cover',
              border: '4px solid white',
              backgroundColor: '#fff'
            }}
            onError={(e) => {
              e.target.onerror = null;
              e.target.style.display = 'none';
              const fallback = document.createElement('div');
              fallback.style.width = '150px';
              fallback.style.height = '150px';
              fallback.style.borderRadius = '50%';
              fallback.style.backgroundColor = '#ffffff44';
              fallback.style.display = 'flex';
              fallback.style.alignItems = 'center';
              fallback.style.justifyContent = 'center';
              fallback.style.color = '#fff';
              fallback.style.fontSize = '3rem';
              fallback.innerText = person.name.charAt(0);
              e.target.parentNode.appendChild(fallback);
            }}
          />
        </Box>

        <Box sx={{ textAlign: 'center', p: 1 }}>
          <Typography variant="h6" fontWeight="bold">
            {person.name}
          </Typography>
        </Box>
      </CardActionArea>
    </Card>
  );

  return (
    <>
      <AppBar position="static" sx={{ backgroundColor: '#0d47a1' }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography variant="h6" fontWeight="bold">
            Knowledge Sharing Platform
          </Typography>
          <Box display="flex" alignItems="center" gap={2}>
            <TextField
              placeholder="Search teachers or students"
              size="small"
              sx={{ backgroundColor: 'white', borderRadius: 1 }}
            />
            <NotificationsIcon style={{ color: 'white', cursor: 'pointer' }} />
            <Avatar sx={{ bgcolor: 'orange', cursor: 'pointer' }} onClick={handleAvatarClick}>
              U
            </Avatar>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleCloseMenu}
              PaperProps={{ elevation: 4, sx: { borderRadius: 2, mt: 1.5, minWidth: 200 } }}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
              <Box px={2} py={1}>
                <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                  sdmaniitian@gmail.com
                </Typography>
              </Box>
              <Divider />
              <MenuItem onClick={() => handleNavigate('/profile')}>Profile</MenuItem>
              <MenuItem onClick={() => handleNavigate('/myposts')}>My Posts</MenuItem>
              <MenuItem onClick={() => handleNavigate('/logout')}>Logout</MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      <Box p={3} bgcolor="#e8ebf0" minHeight="100vh">
        <Box bgcolor="white" p={2} mb={4} borderRadius={2} boxShadow={2}>
          <Typography variant="h6" gutterBottom>
            Welcome to the Knowledge Sharing Platform!
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Start posting your knowledge, share videos, PDFs, and engage in discussions.
          </Typography>
        </Box>

        <Box mb={6}>
          <Typography variant="h5" fontWeight="bold" mb={2}>
            🧑‍🏫 Teachers' Shared Content
          </Typography>
          <Grid container spacing={2} justifyContent="center">
            {teachers.map(renderCard)}
          </Grid>
        </Box>

        <Box>
          <Typography variant="h5" fontWeight="bold" mb={2}>
            🎓 Students' Shared Content
          </Typography>
          <Grid container spacing={2} justifyContent="center">
            {students.map(renderCard)}
          </Grid>
        </Box>

        {posts.length > 0 && (
          <Box mt={6}>
            <Typography variant="h5" fontWeight="bold" mb={2}>
              📝 Recently Added Posts
            </Typography>
            <Grid container spacing={2}>
              {posts.map((post, index) => (
                <Grid item xs={12} md={6} key={index}>
                  <Paper elevation={3} sx={{ p: 2, borderRadius: 2 }}>
                    <Typography variant="h6" fontWeight="bold" color="#0d47a1">
                      {post.title}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" my={1}>
                      {post.description}
                    </Typography>
                    {post.fileName && (
                      <Typography variant="body2" color="primary">
                        📎 {post.fileName}
                      </Typography>
                    )}
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </Box>

      <Fab
        color="primary"
        aria-label="add"
        onClick={() => setOpen(true)}
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
      >
        <AddIcon />
      </Fab>

      <PostModal open={open} handleClose={() => setOpen(false)} handleAddPost={handleAddPost} />
    </>
  );
};

export default Dashboard;
