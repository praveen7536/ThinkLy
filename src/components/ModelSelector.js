import React, { useState, useEffect, useRef } from 'react';
import { 
  Box, 
  Typography, 
  Chip,
  Tooltip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@mui/material';
import { 
  SmartToy,
  Psychology,
  AutoAwesome,
  Check
} from '@mui/icons-material';

const ModelSelector = ({ selectedModel, onModelChange, isDarkMode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const models = [
    {
      id: 'gemini',
      name: 'Google Gemini',
      description: 'Powerful AI model by Google',
      icon: <Psychology />,
      color: '#4285f4'
    },
    {
      id: 'mistral',
      name: 'Mistral',
      description: 'High-performance open model',
      icon: <AutoAwesome />,
      color: '#7c3aed'
    }
  ];

  const selectedModelData = models.find(model => model.id === selectedModel);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleModelSelect = (modelId) => {
    console.log('ModelSelector: Selecting model:', modelId);
    onModelChange(modelId);
    setIsOpen(false);
  };

  return (
    <Box sx={{ position: 'relative' }} ref={dropdownRef}>
      <Tooltip title="Select AI Model">
        <Box
          onClick={() => setIsOpen(!isOpen)}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            background: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
            border: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
            borderRadius: 2,
            px: 1.5,
            py: 0.5,
            cursor: 'pointer',
            '&:hover': {
              background: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
            }
          }}
        >
          <Box
            sx={{
              width: 24,
              height: 24,
              borderRadius: 1.5,
              background: selectedModelData?.color || '#666',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white'
            }}
          >
            {selectedModelData?.icon}
          </Box>
          <Typography variant="body2" sx={{ 
            fontWeight: 500,
            color: isDarkMode ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.9)'
          }}>
            {selectedModelData?.name || 'Select Model'}
          </Typography>
        </Box>
      </Tooltip>

      {isOpen && (
        <Box
          sx={{
            position: 'absolute',
            top: '100%',
            left: 0,
            mt: 1,
            minWidth: 240,
            maxWidth: 280,
            background: isDarkMode 
              ? '#1a1a2e'
              : '#f8fafc',
            border: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
            borderRadius: 3,
            boxShadow: isDarkMode 
              ? '0 20px 40px rgba(0, 0, 0, 0.3)' 
              : '0 20px 40px rgba(0, 0, 0, 0.1)',
            zIndex: 9999,
            backdropFilter: 'blur(10px)'
          }}
        >
          <Box sx={{ p: 1.5, borderBottom: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}` }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
              Select AI Model
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Choose your preferred AI assistant
            </Typography>
          </Box>

          <List sx={{ p: 0 }}>
            {models.map((model) => (
              <ListItem
                key={model.id}
                button
                onClick={() => handleModelSelect(model.id)}
                sx={{
                  py: 1,
                  px: 1.5,
                  borderBottom: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'}`,
                  '&:hover': {
                    background: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
                  },
                  '&:last-child': {
                    borderBottom: 'none'
                  }
                }}
              >
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <Box
                    sx={{
                      width: 32,
                      height: 32,
                      borderRadius: 2,
                      background: model.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white'
                    }}
                  >
                    {model.icon}
                  </Box>
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {model.name}
                      </Typography>
                      {selectedModel === model.id && (
                        <Check sx={{ color: model.color, fontSize: 14 }} />
                      )}
                    </Box>
                  }
                  secondary={
                    <Typography variant="caption" color="text.secondary">
                      {model.description}
                    </Typography>
                  }
                />
                {selectedModel === model.id && (
                  <Chip
                    label="Active"
                    size="small"
                    sx={{
                      background: model.color,
                      color: 'white',
                      fontWeight: 600,
                      fontSize: '0.7rem',
                      height: 20
                    }}
                  />
                )}
              </ListItem>
            ))}
          </List>
        </Box>
      )}
    </Box>
  );
};

export default ModelSelector; 