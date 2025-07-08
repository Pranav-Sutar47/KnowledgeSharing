import React, { useState } from 'react';
import {
  AppBar, Toolbar, Typography, TextField, Box,
  Avatar, Card, CardActionArea, Menu, MenuItem,
  Divider, Grid, Paper, CardMedia, Button
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useNavigate } from 'react-router-dom';

const StudentsDashboard = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

  const handleAvatarClick = (event) => setAnchorEl(event.currentTarget);
  const handleCloseMenu = () => setAnchorEl(null);
  const handleNavigate = (path) => {
    handleCloseMenu();
    navigate(path);
  };

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
              <MenuItem onClick={() => {
                localStorage.removeItem('accessToken');
                handleNavigate('/login');
              }}>Logout</MenuItem>
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

        {/* Toggle Buttons (Styled to match Teachers') */}
        <Box display="flex" justifyContent="center" mb={4}>
          <Button
            variant="outlined"
            sx={{
              borderRadius: '999px',
              mx: 1,
              textTransform: 'uppercase',
              fontWeight: 'bold',
              color: '#3f51b5',
              borderColor: '#3f51b5',
              '&:hover': {
                backgroundColor: '#e3f2fd',
                borderColor: '#3f51b5'
              }
            }}
            onClick={() => navigate('/dashboard')}
          >
            Teachers' Posts
          </Button>

          <Button
            variant="contained"
            sx={{
              borderRadius: '999px',
              mx: 1,
              backgroundColor: '#3f51b5',
              color: 'white',
              textTransform: 'uppercase',
              fontWeight: 'bold',
              '&:hover': {
                backgroundColor: '#303f9f'
              }
            }}
            onClick={() => navigate('/students')}
          >
            Students' Posts
          </Button>
        </Box>

        {/* Students Section */}
        <Box mb={6}>
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
    </>
  );
};

export default StudentsDashboard;
