import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Alert,
  Button,
  Avatar,
  Chip,
  CardActions,
  Pagination,
  TextField,
  InputAdornment
} from '@mui/material';
import { Search, School, Email } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import userService from '../../services/userService';

const TeachersList = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();

  const itemsPerPage = 12;

  useEffect(() => {
    fetchTeachers();
  }, [currentPage]);

  const fetchTeachers = async () => {
    setLoading(true);
    try {
      const result = await userService.getFaculty(currentPage, itemsPerPage);
      if (result.success) {
        setTeachers(result.data.faculty || []);
        setTotal(result.data.total || 0);
        setTotalPages(result.data.totalPages || 1);
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError('Failed to fetch teachers');
    } finally {
      setLoading(false);
    }
  };

  const handleViewTeacher = (teacher) => {
    navigate(`/student/teacher/${teacher._id}`);
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const filteredTeachers = teachers.filter(teacher =>
    teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const TeacherCard = ({ teacher }) => (
    //  Explicit width and height are set for every card.
    <Card sx={{ width: 250, height: 290, display: 'flex', flexDirection: 'column' }}>
      <CardContent
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          overflow: 'hidden',
        }}
      >
        <Avatar
          sx={{
            width: 80,
            height: 80,
            mb: 2,
            bgcolor: 'primary.main',
            fontSize: '2rem'
          }}
        >
          {teacher.name?.charAt(0) || 'T'}
        </Avatar>

        <Typography variant="h6" gutterBottom sx={{ textAlign: 'center' }}>
          {teacher.name}
        </Typography>

        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '90%',
          mb: 2,
        }}>
          <Email sx={{ mr: 1, fontSize: 16, color: 'text.secondary', flexShrink: 0 }} />
          {/*  `noWrap` forces single-line text with ellipsis (...) */}
          <Typography
            variant="body2"
            color="text.secondary"
            noWrap
            title={teacher.email}
          >
            {teacher.email}
          </Typography>
        </Box>

        <Chip
          label="Faculty"
          size="small"
          color="primary"
          sx={{ mt: 1 }}
        />
      </CardContent>

      <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
        <Button
          variant="contained"
          onClick={() => handleViewTeacher(teacher)}
        >
          View Materials
        </Button>
      </CardActions>
    </Card>
  );

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Teachers Directory
      </Typography>

      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Browse and access materials shared by your teachers
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ mb: 3, width: '100%' }}>
        <TextField
          fullWidth
          placeholder="Search teachers by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
          sx={{ maxWidth: { xs: '100%', sm: 400 } }}
        />
      </Box>

      <Box sx={{ mb: 3 }}>
        <Typography color="text.secondary">
          {loading ? 'Loading...' : `${total} teachers available`}
        </Typography>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : filteredTeachers.length > 0 ? (
        <>
          <Grid container spacing={3} sx={{ justifyContent: 'center' }}>
            {filteredTeachers.map((teacher) => (
              //  Using "auto" lets the grid item size itself to the card's fixed width.
              <Grid item key={teacher._id}>
                <TeacherCard teacher={teacher} />
              </Grid>
            ))}
          </Grid>

          {totalPages > 1 && (
            <Box sx={{
              display: 'flex',
              justifyContent: 'center',
              mt: 4,
            }}>
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
              />
            </Box>
          )}
        </>
      ) : (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <School sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            {searchTerm ? 'No teachers found' : 'No teachers available'}
          </Typography>
          <Typography color="text.secondary">
            {searchTerm ? 'Try adjusting your search terms' : 'Check back later for new teachers'}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default TeachersList;