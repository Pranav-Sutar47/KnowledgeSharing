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
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', minHeight: { xs: 200, sm: 220 } }}>
      <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
        <Avatar
          sx={{ 
            width: { xs: 60, sm: 80 }, 
            height: { xs: 60, sm: 80 }, 
            mx: 'auto', 
            mb: 2,
            bgcolor: 'primary.main',
            fontSize: { xs: '1.5rem', sm: '2rem' }
          }}
        >
          {teacher.name?.charAt(0) || 'T'}
        </Avatar>
        
        <Typography variant="h6" gutterBottom sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>
          {teacher.name}
        </Typography>
        
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          mb: 2,
          flexWrap: 'wrap'
        }}>
          <Email sx={{ mr: 1, fontSize: 16, color: 'text.secondary' }} />
          <Typography variant="body2" color="text.secondary" sx={{ 
            fontSize: { xs: '0.75rem', sm: '0.875rem' },
            wordBreak: 'break-word'
          }}>
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
          size={window.innerWidth < 600 ? "small" : "medium"}
          onClick={() => handleViewTeacher(teacher)}
        >
          View Materials
        </Button>
      </CardActions>
    </Card>
  );

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ fontSize: { xs: '1.75rem', sm: '2.125rem' } }}>
        Teachers Directory
      </Typography>
      
      <Typography variant="body1" color="text.secondary" sx={{ 
        mb: 3,
        fontSize: { xs: '0.875rem', sm: '1rem' }
      }}>
        Browse and access materials shared by your teachers
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Search Bar */}
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

      {/* Stats */}
      <Box sx={{ mb: 3 }}>
        <Typography color="text.secondary" sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
          {loading ? 'Loading...' : `${total} teachers available`}
        </Typography>
      </Box>

      {/* Teachers Grid */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : filteredTeachers.length > 0 ? (
        <>
          <Grid container spacing={{ xs: 2, sm: 2, md: 3 }}>
            {filteredTeachers.map((teacher) => (
              <Grid item xs={12} sm={6} lg={4} xl={3} key={teacher._id}>
                <TeacherCard teacher={teacher} />
              </Grid>
            ))}
          </Grid>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              mt: 4,
              '& .MuiPagination-root': {
                '& .MuiPaginationItem-root': {
                  fontSize: { xs: '0.75rem', sm: '0.875rem' }
                }
              }
            }}>
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
                size={window.innerWidth < 600 ? "small" : "medium"}
              />
            </Box>
          )}
        </>
      ) : (
        <Box sx={{ textAlign: 'center', py: 8 }}>
        <School sx={{ fontSize: { xs: 60, sm: 80 }, color: 'text.secondary', mb: 2 }} />
        <Typography variant="h6" color="text.secondary" gutterBottom sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>
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