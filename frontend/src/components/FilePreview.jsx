// 
import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, CircularProgress } from '@mui/material';
import { OpenInNew } from '@mui/icons-material';

const FilePreview = ({ file }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (file?.cloudinaryUrl) {
      setLoading(true);
      setError(false);
      
      // Force stop loading after 3 seconds for testing
      const timer = setTimeout(() => {
        setLoading(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [file]);

  if (!file?.cloudinaryUrl) {
    return <Typography>No file URL available</Typography>;
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100%">
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Loading... (will auto-stop in 3s)</Typography>
      </Box>
    );
  }

  const extension = file.originalFileName?.split('.').pop()?.toLowerCase();
  
  if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension)) {
    return (
      <img 
        src={file.cloudinaryUrl} 
        alt={file.originalFileName}
        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
        onLoad={() => console.log('Image loaded successfully')}
        onError={() => console.error('Image failed to load')}
      />
    );
  }

  if (extension === 'pdf') {
    return (
      <iframe
        src={file.cloudinaryUrl}
        width="100%"
        height="100%"
        style={{ border: 'none' }}
        title={file.originalFileName}
        onLoad={() => console.log('PDF loaded successfully')}
        onError={() => console.error('PDF failed to load')}
      />
    );
  }

  return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="100%">
      <Typography variant="h6" gutterBottom>
        {file.originalFileName}
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        File type: {extension || 'unknown'}
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        URL: {file.cloudinaryUrl.substring(0, 50)}...
      </Typography>
      <Button
        variant="outlined"
        startIcon={<OpenInNew />}
        onClick={() => window.open(file.cloudinaryUrl, '_blank')}
      >
        Open in New Tab
      </Button>
    </Box>
  );
};

export default FilePreview;