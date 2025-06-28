import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Box, Typography } from '@mui/material';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './components/Login';
import ChatComponent from './components/Chat';
import DashboardComponent from './components/Dashboard';
import { ChatProvider } from './contexts/ChatContext';

// Main App Content (no Router here)
const AppContent = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : true;
  });
  
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  // Debug logging
  useEffect(() => {
    console.log('Auth state changed:', { isAuthenticated, isLoading });
  }, [isAuthenticated, isLoading]);

  const theme = createTheme({
    palette: {
      mode: isDarkMode ? 'dark' : 'light',
      primary: { 
        main: '#3b82f6',
        light: '#60a5fa',
        dark: '#2563eb'
      },
      secondary: { 
        main: '#8b5cf6',
        light: '#a78bfa',
        dark: '#7c3aed'
      },
      background: {
        default: isDarkMode 
          ? '#0f172a'
          : '#ffffff',
        paper: isDarkMode ? '#1e293b' : '#ffffff',
      },
      text: {
        primary: isDarkMode ? '#f8fafc' : '#0f172a',
        secondary: isDarkMode ? '#94a3b8' : '#64748b',
      },
    },
    typography: {
      fontFamily: '"Inter", "system-ui", "sans-serif"',
      h1: { 
        fontWeight: 700,
        fontSize: '2.25rem',
        lineHeight: 1.2,
        letterSpacing: '-0.025em'
      }, 
      h2: { 
        fontWeight: 700,
        fontSize: '1.875rem',
        lineHeight: 1.25,
        letterSpacing: '-0.025em'
      }, 
      h3: { 
        fontWeight: 600,
        fontSize: '1.5rem',
        lineHeight: 1.25,
        letterSpacing: '-0.025em'
      }, 
      h4: { 
        fontWeight: 600,
        fontSize: '1.25rem',
        lineHeight: 1.25
      }, 
      h5: { 
        fontWeight: 600,
        fontSize: '1.125rem',
        lineHeight: 1.25
      }, 
      h6: { 
        fontWeight: 600,
        fontSize: '1rem',
        lineHeight: 1.25
      },
      body1: {
        fontSize: '1rem',
        lineHeight: 1.6,
        color: isDarkMode ? '#e2e8f0' : '#334155'
      },
      body2: {
        fontSize: '0.875rem',
        lineHeight: 1.5,
        color: isDarkMode ? '#cbd5e1' : '#64748b'
      }
    },
    shape: { borderRadius: 12 },
    components: {
      MuiButton: { 
        styleOverrides: { 
          root: { 
            textTransform: 'none', 
            fontWeight: 600, 
            borderRadius: 8,
            fontSize: '0.875rem',
            padding: '8px 16px',
            boxShadow: 'none',
            '&:hover': {
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            }
          } 
        } 
      },
      MuiCard: { 
        styleOverrides: { 
          root: { 
            borderRadius: 16, 
            boxShadow: isDarkMode 
              ? '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' 
              : '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
            border: isDarkMode ? '1px solid #334155' : '1px solid #e2e8f0'
          } 
        } 
      },
      MuiPaper: { 
        styleOverrides: { 
          root: { 
            borderRadius: 16,
            border: isDarkMode ? '1px solid #334155' : '1px solid #e2e8f0'
          } 
        } 
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: 8,
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: isDarkMode ? '#475569' : '#cbd5e1',
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: '#3b82f6',
                borderWidth: 2,
              },
            },
          },
        },
      },
    },
  });
  
  const toggleTheme = () => setIsDarkMode(!isDarkMode);
  
  // Show loading state
  if (isLoading) {
    return (
      <Box sx={{ 
        height: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: isDarkMode ? '#0f172a' : '#ffffff'
      }}>
        <Typography variant="h6" sx={{ color: isDarkMode ? '#f8fafc' : '#0f172a' }}>
          Loading ThinkLy...
        </Typography>
      </Box>
    );
  }
  
  if (!isAuthenticated) {
    console.log('Not authenticated, showing login');
    return <Login isDarkMode={isDarkMode} />;
  }
  
  console.log('Authenticated, showing main app');
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ 
        height: '100vh', 
        display: 'flex',
        flexDirection: 'column',
        background: isDarkMode ? '#0f172a' : '#ffffff',
      }}>
        <Routes>
          <Route path="/" element={<Navigate to="/chat" replace />} />
          <Route 
            path="/chat" 
            element={
              <ChatComponent 
                isDarkMode={isDarkMode} 
                toggleTheme={toggleTheme}
              />
            } 
          />
          <Route 
            path="/dashboard" 
            element={
              <DashboardComponent 
                isDarkMode={isDarkMode}
                toggleTheme={toggleTheme}
              />
            } 
          />
        </Routes>
      </Box>
    </ThemeProvider>
  );
};

// App Component (no Router wrapper)
const App = () => {
  return (
    <AuthProvider>
      <ChatProvider>
        <AppContent />
      </ChatProvider>
    </AuthProvider>
  );
};

export default App; 