import React from 'react';
import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import { LightMode, DarkMode } from '@mui/icons-material';
import { motion } from 'framer-motion';

const ThemeToggle = ({ isDarkMode, onToggle }) => {
  const handleChange = (event, newMode) => {
    if (newMode !== null) {
      onToggle();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <ToggleButtonGroup
        value={isDarkMode ? 'dark' : 'light'}
        exclusive
        onChange={handleChange}
        aria-label="theme toggle"
        size="small"
        sx={{
          backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
          borderRadius: '12px',
          padding: '2px',
          '& .MuiToggleButton-root': {
            border: 'none',
            borderRadius: '10px',
            padding: '8px 12px',
            minWidth: '40px',
            color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)',
            backgroundColor: 'transparent',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
              transform: 'translateY(-1px)',
            },
            '&.Mui-selected': {
              backgroundColor: isDarkMode 
                ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
                : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
              '&:hover': {
                backgroundColor: isDarkMode 
                  ? 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)' 
                  : 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 20px rgba(102, 126, 234, 0.5)',
              },
            },
          },
        }}
      >
        <ToggleButton value="light" aria-label="light mode">
          <motion.div
            whileHover={{ rotate: 15 }}
            whileTap={{ scale: 0.9 }}
            transition={{ duration: 0.2 }}
          >
            <LightMode sx={{ fontSize: 18 }} />
          </motion.div>
        </ToggleButton>
        <ToggleButton value="dark" aria-label="dark mode">
          <motion.div
            whileHover={{ rotate: -15 }}
            whileTap={{ scale: 0.9 }}
            transition={{ duration: 0.2 }}
          >
            <DarkMode sx={{ fontSize: 18 }} />
          </motion.div>
        </ToggleButton>
      </ToggleButtonGroup>
    </motion.div>
  );
};

export default ThemeToggle; 