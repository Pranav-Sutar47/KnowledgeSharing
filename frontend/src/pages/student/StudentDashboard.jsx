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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useMediaQuery,
  useTheme,
  Pagination
} from '@mui/material';
import { School, Person, Visibility, Email } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import userService from '../../services/userService';
import materialService from '../../services/materialService';
import MaterialCard from '../../components/MaterialCard';
import FilePreview from '../../components/FilePreview';
import { formatDate } from '../../utils/formatters';

const StudentDashboard = () => {
  const [teachers, setTeachers] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [teacherMaterials, setTeacherMaterials] = useState({ folders: [], materials: [] });
  const [materialDialog, setMaterialDialog] = useState({ open: false, material: null });
  const [loading, setLoading] = useState(true);
  const [materialsLoading, setMaterialsLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const itemsPerPage = 12;

  useEffect(() => {
    fetchDashboardData();
  }, [currentPage]);

  const fetchDashboardData = async () => {
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
      setError('Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const fetchTeacherMaterials = async (teacherId) => {
    setMaterialsLoading(true);
    try {
      // Use the faculty-specific API to get teacher's materials
      const result = await materialService.getFacultyMaterials(teacherId);
      if (result.success) {
        setTeacherMaterials({
          folders: result.data.folders || [],
          materials: result.data.materials || []
        });
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError('Failed to fetch teacher materials');
    } finally {
      setMaterialsLoading(false);
    }
  };
  const handleViewTeacher = (teacher) => {
    setSelectedTeacher(teacher);
    fetchTeacherMaterials(teacher._id);
  };

  const handleViewMaterial = (material) => {
    if (material.name) {
      // It's a folder
      navigate(`/folder/${material._id}`);
    } else {
      // It's a material
      navigate(`/material/${material._id}`);
    }
  };

  const handleCloseTeacherView = () => {
    setSelectedTeacher(null);
    setTeacherMaterials({ folders: [], materials: [] });
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

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
          size={isMobile ? "small" : "medium"}
          onClick={() => handleViewTeacher(teacher)}
        >
          View Materials
        </Button>
      </CardActions>
    </Card>
  );

  if (selectedTeacher) {
    return (
      <Box>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          mb: { xs: 2, sm: 3 },
          flexDirection: { xs: 'column', sm: 'row' },
          gap: { xs: 1, sm: 0 }
        }}>
          <Button onClick={handleCloseTeacherView} sx={{ mr: 2 }}>
            ← Back to Dashboard
          </Button>
          <Typography variant="h4" sx={{ 
            fontSize: { xs: '1.5rem', sm: '2.125rem' },
            textAlign: { xs: 'center', sm: 'left' }
          }}>
            {selectedTeacher.name}'s Materials
          </Typography>
        </Box>

        {materialsLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {/* Folders */}
            {teacherMaterials.folders.length > 0 && (
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" gutterBottom sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>
                  Folders
                </Typography>
                <Grid container spacing={2}>
                  {teacherMaterials.folders.map((folder) => (
                    <Grid item xs={12} sm={6} lg={4} key={folder._id}>
                      <MaterialCard
                        material={folder}
                        isFolder={true}
                        onView={handleViewMaterial}
                        showActions={false}
                      />
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}

            {/* Materials */}
            {teacherMaterials.materials.length > 0 && (
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" gutterBottom sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>
                  Materials
                </Typography>
                <Grid container spacing={2}>
                  {teacherMaterials.materials.map((material) => (
                    <Grid item xs={12} sm={6} lg={4} key={material._id}>
                      <MaterialCard
                        material={material}
                        onView={handleViewMaterial}
                        showActions={false}
                      />
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}

            {/* Empty State */}
            {teacherMaterials.folders.length === 0 && teacherMaterials.materials.length === 0 && (
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <School sx={{ fontSize: { xs: 60, sm: 80 }, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>
                  No materials available
                </Typography>
                <Typography color="text.secondary" sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                  This teacher hasn't shared any materials yet
                </Typography>
              </Box>
            )}
          </>
        )}
      </Box>
    );
  }
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ fontSize: { xs: '1.75rem', sm: '2.125rem' } }}>
        Teachers Directory
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Description */}
      <Typography variant="body1" color="text.secondary" sx={{ 
        mb: 3,
        fontSize: { xs: '0.875rem', sm: '1rem' }
      }}>
        Browse and access materials shared by your teachers
      </Typography>

      {/* Stats */}
      <Box sx={{ mb: 3 }}>
        <Typography color="text.secondary" sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
          {loading ? 'Loading...' : `${total} teachers available`}
        </Typography>
      </Box>

      {/* Teachers Grid */}
      {teachers.length > 0 ? (
        <>
          <Grid container spacing={{ xs: 2, sm: 2, md: 3 }}>
            {teachers.map((teacher) => (
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
            No teachers available
          </Typography>
          <Typography color="text.secondary" sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
            Check back later for new teachers and materials
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default StudentDashboard;