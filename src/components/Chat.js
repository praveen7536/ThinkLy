import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  IconButton, 
  TextField, 
  Button, 
  Typography, 
  Box,
  Chip,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Switch,
  FormControlLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Tabs,
  Tab
} from '@mui/material';
import { 
  Send, 
  Refresh,
  History,
  Star,
  Chat as ChatIcon,
  Dashboard,
  ExpandMore,
  Search,
  Download,
  LightMode,
  DarkMode,
  Logout,
  Settings
} from '@mui/icons-material';
import { sendMessage as sendMessageGemini } from '../services/geminiService';
import { sendMessageToMistral } from '../services/mistralService';
import Message from './Message';
import LoadingSpinner from './LoadingSpinner';
import ModelSelector from './ModelSelector';
import { useChat } from '../contexts/ChatContext';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Chat = ({ isDarkMode, toggleTheme }) => {
  const { 
    messages, 
    selectedModel, 
    isLoading, 
    addMessage, 
    clearMessages, 
    setSelectedModel, 
    setIsLoading, 
    setError 
  } = useChat();
  
  const { logout } = useAuth();
  
  const [inputMessage, setInputMessage] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [autoScroll, setAutoScroll] = useState(true);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (autoScroll) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages, autoScroll]);

  // Helper to focus input
  const focusInput = useCallback(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Focus input on mount, after sending, and when tab regains focus
  useEffect(() => {
    focusInput();
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') focusInput();
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, [focusInput]);
  useEffect(() => { focusInput(); }, [isLoading, focusInput]);

  const handleModelChange = (modelId) => {
    console.log('Chat: handleModelChange called with:', modelId);
    console.log('Chat: Current selectedModel before change:', selectedModel);
    setSelectedModel(modelId);
    setError('');
    console.log('Chat: selectedModel should now be:', modelId);
  };

  const sendMessageHandler = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      content: inputMessage.trim(),
      role: 'user',
      timestamp: new Date().toISOString(),
      model: selectedModel
    };

    addMessage(userMessage);
    setInputMessage('');
    setIsLoading(true);
    setError('');

    try {
      const conversationHistory = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      let response;
      
      if (selectedModel === 'gemini') {
        response = await sendMessageGemini(inputMessage.trim(), conversationHistory);
      } else if (selectedModel === 'mistral') {
        response = await sendMessageToMistral(inputMessage.trim(), conversationHistory);
      }

      if (response.success) {
        const assistantMessage = {
          id: Date.now() + 1,
          content: response.message,
          role: 'assistant',
          timestamp: new Date().toISOString(),
          model: selectedModel,
          usage: response.usage
        };

        addMessage(assistantMessage);
      } else {
        throw new Error(response.error || 'Failed to get response');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setError(error.message || 'Failed to send message. Please try again.');
      
      const errorMessage = {
        id: Date.now() + 1,
        content: `Error: ${error.message || 'Failed to send message. Please try again.'}`,
        role: 'error',
        timestamp: new Date().toISOString(),
        model: selectedModel
      };
      
      addMessage(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessageHandler();
    }
  };

  const getModelDisplayName = (modelId) => {
    switch (modelId) {
      case 'gemini':
        return 'Google Gemini';
      case 'mistral':
        return 'Mistral';
      default:
        return 'Unknown Model';
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.3
      }
    }
  };

  const sidebarWidth = 320;

  return (
    <Box sx={{ 
      display: 'flex', 
      height: '100vh', 
      overflow: 'hidden',
      flexDirection: 'column',
      background: isDarkMode 
        ? 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 25%, #16213e 50%, #0f3460 75%, #533483 100%)'
        : 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 25%, #f0fdf4 50%, #fef7ff 75%, #fdf2f8 100%)',
      position: 'relative'
    }}>
      {/* Enhanced Background Pattern */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: isDarkMode
            ? 'radial-gradient(circle at 20% 80%, rgba(59, 130, 246, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(147, 51, 234, 0.15) 0%, transparent 50%), radial-gradient(circle at 40% 40%, rgba(236, 72, 153, 0.1) 0%, transparent 50%)'
            : 'radial-gradient(circle at 20% 80%, rgba(59, 130, 246, 0.08) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(147, 51, 234, 0.08) 0%, transparent 50%), radial-gradient(circle at 40% 40%, rgba(236, 72, 153, 0.05) 0%, transparent 50%)',
          pointerEvents: 'none',
          zIndex: 0
        }}
      />

      {/* Enhanced Top Navigation Bar */}
      <Box
        sx={{
          position: 'relative',
          zIndex: 10,
          background: isDarkMode 
            ? 'rgba(10, 10, 10, 0.85)' 
            : 'rgba(240, 249, 255, 0.85)',
          backdropFilter: 'blur(25px)',
          borderBottom: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.08)'}`,
          px: { xs: 2, sm: 4 },
          py: 2.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexShrink: 0,
          boxShadow: isDarkMode 
            ? '0 4px 20px rgba(0, 0, 0, 0.3)' 
            : '0 4px 20px rgba(0, 0, 0, 0.05)'
        }}
      >
        {/* Left side - Enhanced Logo and Model Selector */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              p: 1,
              borderRadius: 2,
              background: isDarkMode 
                ? 'rgba(255, 255, 255, 0.05)' 
                : 'rgba(255, 255, 255, 0.8)',
              backdropFilter: 'blur(10px)',
              border: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`
            }}
          >
            <Typography 
              variant="h5" 
              sx={{ 
                fontWeight: 900,
                background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #ec4899 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: '-0.8px',
                fontSize: '1.8rem'
              }}
            >
              ThinkLy
            </Typography>
          </Box>
          
          <ModelSelector
            selectedModel={selectedModel}
            onModelChange={handleModelChange}
            isDarkMode={isDarkMode}
          />
        </Box>

        {/* Right side - Enhanced Actions */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Tooltip title="Clear chat">
            <IconButton
              onClick={clearMessages}
              sx={{
                color: isDarkMode ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)',
                background: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(10px)',
                border: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
                '&:hover': {
                  background: isDarkMode ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.1)',
                  color: isDarkMode ? '#fff' : '#000',
                  transform: 'translateY(-1px)',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                },
                transition: 'all 0.2s ease'
              }}
            >
              <Refresh />
            </IconButton>
          </Tooltip>

          <Tooltip title="Settings">
            <IconButton
              onClick={() => setSettingsOpen(true)}
              sx={{
                color: isDarkMode ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)',
                background: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(10px)',
                border: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
                '&:hover': {
                  background: isDarkMode ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.1)',
                  color: isDarkMode ? '#fff' : '#000',
                  transform: 'translateY(-1px)',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                },
                transition: 'all 0.2s ease'
              }}
            >
              <Settings />
            </IconButton>
          </Tooltip>

          <Tooltip title="Toggle theme">
            <IconButton
              onClick={toggleTheme}
              sx={{
                color: isDarkMode ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)',
                background: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(10px)',
                border: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
                '&:hover': {
                  background: isDarkMode ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.1)',
                  color: isDarkMode ? '#fff' : '#000',
                  transform: 'translateY(-1px)',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                },
                transition: 'all 0.2s ease'
              }}
            >
              {isDarkMode ? <LightMode /> : <DarkMode />}
            </IconButton>
          </Tooltip>

          <Tooltip title="Dashboard">
            <IconButton
              onClick={() => navigate('/dashboard')}
              sx={{
                color: isDarkMode ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)',
                background: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(10px)',
                border: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
                '&:hover': {
                  background: isDarkMode ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.1)',
                  color: isDarkMode ? '#fff' : '#000',
                  transform: 'translateY(-1px)',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                },
                transition: 'all 0.2s ease'
              }}
            >
              <Dashboard />
            </IconButton>
          </Tooltip>

          <Tooltip title="Logout">
            <IconButton
              onClick={logout}
              sx={{
                color: isDarkMode ? 'rgba(239, 68, 68, 0.8)' : 'rgba(239, 68, 68, 0.8)',
                background: isDarkMode ? 'rgba(239, 68, 68, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                backdropFilter: 'blur(10px)',
                border: `1px solid ${isDarkMode ? 'rgba(239, 68, 68, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`,
                '&:hover': {
                  background: 'rgba(239, 68, 68, 0.2)',
                  color: '#ef4444',
                  transform: 'translateY(-1px)',
                  boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)'
                },
                transition: 'all 0.2s ease'
              }}
            >
              <Logout />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Main Chat Area */}
      <Box
        sx={{
          flex: 1,
          overflow: 'hidden',
          position: 'relative',
          zIndex: 5,
          display: 'flex',
          flexDirection: 'column',
          minHeight: 0 // Ensure flex child doesn't overflow
        }}
      >
        {/* Messages Container */}
        <Box
          sx={{
            flex: 1,
            overflow: 'auto',
            px: { xs: 2, sm: 4, md: 6 },
            py: 3,
            minHeight: 0, // Ensure proper flex behavior
            '&::-webkit-scrollbar': {
              width: '8px',
            },
            '&::-webkit-scrollbar-track': {
              background: 'transparent',
            },
            '&::-webkit-scrollbar-thumb': {
              background: isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)',
              borderRadius: '4px',
              '&:hover': {
                background: isDarkMode ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)',
              },
            },
          }}
        >
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            style={{ 
              maxWidth: 900, 
              margin: '0 auto',
              minHeight: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: messages.length === 0 ? 'center' : 'flex-start',
              paddingBottom: '20px' // Add bottom padding to prevent overlap
            }}
          >
            {messages.length === 0 ? (
              <motion.div
                variants={itemVariants}
                style={{
                  textAlign: 'center',
                  padding: '4rem 2rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: '60vh'
                }}
              >
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                >
                  <Box
                    sx={{
                      width: 140,
                      height: 140,
                      margin: '0 auto 2rem',
                      background: isDarkMode 
                        ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(147, 51, 234, 0.15) 50%, rgba(236, 72, 153, 0.15) 100%)'
                        : 'linear-gradient(135deg, rgba(59, 130, 246, 0.08) 0%, rgba(147, 51, 234, 0.08) 50%, rgba(236, 72, 153, 0.08) 100%)',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: `3px solid ${isDarkMode ? 'rgba(59, 130, 246, 0.3)' : 'rgba(59, 130, 246, 0.2)'}`,
                      boxShadow: isDarkMode 
                        ? '0 20px 40px rgba(59, 130, 246, 0.2)' 
                        : '0 20px 40px rgba(59, 130, 246, 0.1)',
                      position: 'relative',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: -2,
                        left: -2,
                        right: -2,
                        bottom: -2,
                        background: 'linear-gradient(135deg, #3b82f6, #8b5cf6, #ec4899)',
                        borderRadius: '50%',
                        zIndex: -1,
                        opacity: 0.3,
                        animation: 'pulse 2s infinite'
                      }
                    }}
                  >
                    <ChatIcon 
                      sx={{ 
                        fontSize: 56, 
                        color: isDarkMode ? '#3b82f6' : '#2563eb',
                        filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2))'
                      }} 
                    />
                  </Box>
                </motion.div>
                
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
                >
                  <Typography
                    variant="h3"
                    sx={{
                      fontWeight: 900,
                      mb: 2,
                      background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #ec4899 100%)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      textAlign: 'center',
                      fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                      letterSpacing: '-1px'
                    }}
                  >
                    Welcome to ThinkLy!
                  </Typography>
                </motion.div>
                
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
                >
                  <Typography
                    variant="body1"
                    sx={{
                      color: isDarkMode ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)',
                      maxWidth: 600,
                      lineHeight: 1.7,
                      mb: 4,
                      fontSize: '1.2rem',
                      textAlign: 'center',
                      fontWeight: 400
                    }}
                  >
                    Start a conversation with {getModelDisplayName(selectedModel)}. Ask questions, get creative, or just chat! 
                    Your AI assistant is ready to help you explore ideas and solve problems.
                  </Typography>
                </motion.div>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      gap: 2,
                      justifyContent: 'center',
                      flexWrap: 'wrap',
                      maxWidth: 800,
                      mx: 'auto'
                    }}
                  >
                    {[
                      "What can you help me with?",
                      "Tell me a joke",
                      "Explain quantum physics",
                      "Write a poem",
                      "Help me code",
                      "Plan my day"
                    ].map((suggestion, index) => (
                      <motion.div
                        key={index}
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Chip
                          label={suggestion}
                          onClick={() => {
                            setInputMessage(suggestion);
                            setTimeout(focusInput, 0);
                          }}
                          sx={{
                            background: isDarkMode 
                              ? 'rgba(255, 255, 255, 0.1)' 
                              : 'rgba(255, 255, 255, 0.9)',
                            color: isDarkMode ? '#fff' : '#000',
                            border: `2px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)'}`,
                            backdropFilter: 'blur(10px)',
                            fontSize: '0.95rem',
                            fontWeight: 500,
                            px: 2,
                            py: 1,
                            '&:hover': {
                              background: isDarkMode 
                                ? 'rgba(59, 130, 246, 0.3)' 
                                : 'rgba(59, 130, 246, 0.2)',
                              border: `2px solid ${isDarkMode ? '#3b82f6' : '#2563eb'}`,
                              cursor: 'pointer',
                              boxShadow: '0 8px 20px rgba(59, 130, 246, 0.3)'
                            },
                            transition: 'all 0.3s ease'
                          }}
                        />
                      </motion.div>
                    ))}
                  </Box>
                </motion.div>
              </motion.div>
            ) : (
              <Box sx={{ width: '100%' }}>
                <AnimatePresence>
                  {messages.map((message, index) => (
                    <motion.div
                      key={message.id}
                      variants={itemVariants}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      transition={{ delay: index * 0.1 }}
                      style={{ marginBottom: '16px' }} // Ensure consistent spacing
                    >
                      <Message
                        message={message}
                        isDarkMode={isDarkMode}
                        modelName={getModelDisplayName(message.model)}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </Box>
            )}
            
            {isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  marginTop: '2rem',
                  marginBottom: '1rem' // Add bottom margin
                }}
              >
                <LoadingSpinner isDarkMode={isDarkMode} />
              </motion.div>
            )}
            
            <div ref={messagesEndRef} style={{ height: '20px' }} />
          </motion.div>
        </Box>
      </Box>

      {/* Enhanced Input Area - Fixed at bottom */}
      <Box
        sx={{
          position: 'relative',
          zIndex: 10,
          background: isDarkMode 
            ? 'rgba(10, 10, 10, 0.85)' 
            : 'rgba(240, 249, 255, 0.85)',
          backdropFilter: 'blur(25px)',
          borderTop: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.08)'}`,
          px: { xs: 2, sm: 4, md: 6 },
          py: 4,
          display: 'flex',
          justifyContent: 'center',
          flexShrink: 0,
          minHeight: 'fit-content',
          boxShadow: isDarkMode 
            ? '0 -4px 20px rgba(0, 0, 0, 0.3)' 
            : '0 -4px 20px rgba(0, 0, 0, 0.05)'
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'flex-end',
            gap: 2,
            maxWidth: 900,
            width: '100%',
            background: isDarkMode 
              ? 'rgba(255, 255, 255, 0.08)' 
              : 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(25px)',
            border: `2px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.1)'}`,
            borderRadius: 28,
            p: 3,
            boxShadow: isDarkMode 
              ? '0 25px 50px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)' 
              : '0 25px 50px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:focus-within': {
              boxShadow: isDarkMode 
                ? '0 30px 60px rgba(0, 0, 0, 0.5), 0 0 0 2px rgba(59, 130, 246, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)' 
                : '0 30px 60px rgba(0, 0, 0, 0.2), 0 0 0 2px rgba(59, 130, 246, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
              transform: 'translateY(-3px)',
              border: `2px solid ${isDarkMode ? 'rgba(59, 130, 246, 0.4)' : 'rgba(59, 130, 246, 0.4)'}`
            }
          }}
        >
          <TextField
            inputRef={el => {
              inputRef.current = el;
              if (el) el.focus();
            }}
            autoFocus
            tabIndex={-1}
            multiline
            maxRows={4}
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={`Message ${getModelDisplayName(selectedModel)}...`}
            disabled={isLoading}
            variant="standard"
            sx={{
              flex: 1,
              '& .MuiInput-root': {
                fontSize: '16px',
                color: isDarkMode ? '#ffffff' : '#1a1a1a',
                '&::before': {
                  borderBottom: 'none'
                },
                '&::after': {
                  borderBottom: 'none'
                },
                '&:hover::before': {
                  borderBottom: 'none'
                },
                '&.Mui-focused::after': {
                  borderBottom: 'none'
                }
              },
              '& .MuiInputBase-input': {
                padding: '16px 20px',
                borderRadius: 24,
                background: isDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.6)',
                border: `2px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.1)'}`,
                fontSize: '16px',
                fontWeight: 400,
                '&::placeholder': {
                  color: isDarkMode ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)',
                  opacity: 1,
                  fontSize: '16px',
                  fontWeight: 400
                },
                '&:focus': {
                  background: isDarkMode ? 'rgba(255, 255, 255, 0.12)' : 'rgba(255, 255, 255, 0.9)',
                  border: `2px solid ${isDarkMode ? '#3b82f6' : '#2563eb'}`,
                  boxShadow: `0 0 0 4px ${isDarkMode ? 'rgba(59, 130, 246, 0.2)' : 'rgba(37, 99, 235, 0.2)'}`
                },
                transition: 'all 0.3s ease'
              }
            }}
          />
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}
          >
            <motion.div 
              whileHover={{ scale: 1.05 }} 
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <Button
                onClick={sendMessageHandler}
                disabled={!inputMessage.trim() || isLoading}
                variant="contained"
                sx={{
                  minWidth: 60,
                  height: 60,
                  borderRadius: 24,
                  background: inputMessage.trim() && !isLoading
                    ? 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #ec4899 100%)'
                    : isDarkMode 
                      ? 'rgba(255, 255, 255, 0.1)' 
                      : 'rgba(0, 0, 0, 0.1)',
                  color: inputMessage.trim() && !isLoading ? 'white' : isDarkMode ? '#94a3b8' : '#64748b',
                  boxShadow: inputMessage.trim() && !isLoading
                    ? '0 12px 32px rgba(59, 130, 246, 0.4), 0 4px 8px rgba(147, 51, 234, 0.3)'
                    : 'none',
                  border: inputMessage.trim() && !isLoading
                    ? '2px solid rgba(255, 255, 255, 0.2)'
                    : '2px solid transparent',
                  '&:hover': {
                    background: inputMessage.trim() && !isLoading
                      ? 'linear-gradient(135deg, #2563eb 0%, #7c3aed 50%, #db2777 100%)'
                      : isDarkMode 
                        ? 'rgba(255, 255, 255, 0.15)' 
                        : 'rgba(0, 0, 0, 0.15)',
                    boxShadow: inputMessage.trim() && !isLoading
                      ? '0 16px 40px rgba(59, 130, 246, 0.5), 0 6px 12px rgba(147, 51, 234, 0.4)'
                      : 'none',
                    transform: inputMessage.trim() && !isLoading ? 'translateY(-2px)' : 'none'
                  },
                  '&:disabled': {
                    background: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
                    color: isDarkMode ? '#64748b' : '#94a3b8',
                    boxShadow: 'none',
                    border: '2px solid transparent'
                  },
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
              >
                {isLoading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <Refresh sx={{ fontSize: 24 }} />
                  </motion.div>
                ) : (
                  <Send sx={{ fontSize: 24 }} />
                )}
              </Button>
            </motion.div>
          </Box>
        </Box>
      </Box>

      {/* Sidebar */}
      <Drawer
        variant="temporary"
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        ModalProps={{
          keepMounted: true, // Better mobile performance
        }}
        sx={{
          width: sidebarWidth,
          flexShrink: 0,
          zIndex: 1300,
          '& .MuiDrawer-paper': {
            width: sidebarWidth,
            background: isDarkMode 
              ? '#1a1a2e'
              : '#f8fafc',
            borderRight: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
            boxSizing: 'border-box',
            zIndex: 1300,
          },
          '& .MuiBackdrop-root': {
            zIndex: 1299,
          }
        }}
      >
        <Box sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              ThinkLy
            </Typography>
          </Box>

          <TextField
            fullWidth
            placeholder="Search conversations..."
            variant="outlined"
            size="small"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
            }}
            sx={{
              mb: 2,
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                background: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(10px)',
              }
            }}
          />

          <Tabs
            value={activeTab}
            onChange={(e, newValue) => setActiveTab(newValue)}
            sx={{ mb: 2 }}
          >
            <Tab label="Chats" icon={<ChatIcon />} />
            <Tab label="Favorites" icon={<Star />} />
            <Tab label="History" icon={<History />} />
          </Tabs>

          <List>
            {activeTab === 0 && (
              <ListItem button>
                <ListItemIcon>
                  <ChatIcon />
                </ListItemIcon>
                <ListItemText 
                  primary="Current Chat" 
                  secondary={`${messages.length} messages`}
                />
                <Chip label="Active" size="small" color="primary" />
              </ListItem>
            )}
            
            {activeTab === 1 && (
              <ListItem button>
                <ListItemIcon>
                  <Star sx={{ color: '#ffd700' }} />
                </ListItemIcon>
                <ListItemText primary="No favorites yet" />
              </ListItem>
            )}
            
            {activeTab === 2 && (
              <ListItem button>
                <ListItemIcon>
                  <History />
                </ListItemIcon>
                <ListItemText primary="No history yet" />
              </ListItem>
            )}
          </List>

          <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
            <Tooltip title="Refresh data">
              <IconButton>
                <Refresh />
              </IconButton>
            </Tooltip>
            <Tooltip title="Export data">
              <IconButton>
                <Download />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </Drawer>

      {/* Settings Drawer */}
      <Drawer
        anchor="right"
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        sx={{
          '& .MuiDrawer-paper': {
            width: 400,
            background: isDarkMode 
              ? 'linear-gradient(180deg, #1a1a2e 0%, #16213e 100%)'
              : 'linear-gradient(180deg, #f8fafc 0%, #e2e8f0 100%)',
            borderLeft: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
          },
        }}
      >
        <Box sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 700 }}>
            Settings
          </Typography>
          
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography>Chat Settings</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <FormControlLabel
                control={
                  <Switch
                    checked={autoScroll}
                    onChange={(e) => setAutoScroll(e.target.checked)}
                  />
                }
                label="Auto-scroll to new messages"
              />
            </AccordionDetails>
          </Accordion>
          
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography>Model Settings</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <ModelSelector
                selectedModel={selectedModel}
                onModelChange={handleModelChange}
                isDarkMode={isDarkMode}
              />
            </AccordionDetails>
          </Accordion>
        </Box>
      </Drawer>
    </Box>
  );
};

export default Chat;