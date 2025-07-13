import React from 'react';
import {
  Box,
  Chip,
  Typography,
  TextField,
  InputAdornment,
  Stack
} from '@mui/material';
import { Search, FilterList } from '@mui/icons-material';

const TagFilter = ({ 
  tags = [], 
  selectedTags = [], 
  onTagToggle, 
  searchTerm = '', 
  onSearchChange,
  placeholder = "Search materials..."
}) => {
  const handleTagClick = (tag) => {
    if (onTagToggle) {
      onTagToggle(tag);
    }
  };

  return (
    <Box sx={{ mb: { xs: 2, sm: 3 } }}>
      <TextField
        fullWidth
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search sx={{ fontSize: { xs: 18, sm: 20 } }} />
            </InputAdornment>
          ),
        }}
        sx={{ 
          mb: 2,
          '& .MuiInputBase-input': {
            fontSize: { xs: '0.875rem', sm: '1rem' }
          }
        }}
      />
      
      {tags.length > 0 && (
        <Box>
          <Typography variant="subtitle2" sx={{ 
            mb: 1, 
            display: 'flex', 
            alignItems: 'center',
            fontSize: { xs: '0.875rem', sm: '1rem' }
          }}>
            <FilterList sx={{ mr: 1 }} />
            Filter by Tags:
          </Typography>
          <Stack direction="row" spacing={{ xs: 0.5, sm: 1 }} flexWrap="wrap">
            {tags.map((tag) => (
              <Chip
                key={tag}
                label={tag}
                onClick={() => handleTagClick(tag)}
                color={selectedTags.includes(tag) ? 'primary' : 'default'}
                variant={selectedTags.includes(tag) ? 'filled' : 'outlined'}
                clickable
                sx={{ 
                  mb: 1,
                  fontSize: { xs: '0.75rem', sm: '0.875rem' },
                  height: { xs: 24, sm: 32 }
                }}
              />
            ))}
          </Stack>
        </Box>
      )}
    </Box>
  );
};

export default TagFilter;