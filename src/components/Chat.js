import React, { useState, useRef, useEffect } from 'react';
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
  Logout
} from '@mui/icons-material';
import { sendMessage as sendMessageGemini } from '../services/geminiService';
import { sendMessageToMistral } from '../services/mistralService';
import Message from './Message';
import LoadingSpinner from './LoadingSpinner';
import ModelSelector from './ModelSelector';
import { useChat } from '../contexts/ChatContext';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

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
  const navigate = useNavigate();
  const location = useLocation();
  
  const [inputMessage, setInputMessage] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [autoScroll, setAutoScroll] = useState(true);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (autoScroll) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages, autoScroll]);

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
      height: '100%', 
      overflow: 'hidden',
      flexDirection: 'column',
      background: isDarkMode ? '#0f172a' : '#ffffff'
    }}>
      {/* Top bar with Model Selector and Clear Chat */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: { xs: 2, sm: 4 },
          py: 2,
          borderBottom: isDarkMode
            ? '1px solid #334155'
            : '1px solid #e2e8f0',
          background: isDarkMode ? '#1e293b' : '#ffffff',
          flexShrink: 0,
          minHeight: 64
        }}
      >
        {/* Left side - Model Selector and Dashboard */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <ModelSelector
            selectedModel={selectedModel}
            onModelChange={handleModelChange}
            isDarkMode={isDarkMode}
          />
          <Tooltip title="Dashboard">
            <IconButton 
              onClick={() => navigate('/dashboard')}
              sx={{
                color: location.pathname === '/dashboard' 
                  ? (isDarkMode ? '#667eea' : '#4a5fd8')
                  : (isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)'),
                '&:hover': {
                  color: isDarkMode ? '#8b9df0' : '#667eea',
                }
              }}
            >
              <Dashboard />
            </IconButton>
          </Tooltip>
        </Box>
        
        {/* Center - Theme toggle */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Tooltip title={`Switch to ${isDarkMode ? 'Light' : 'Dark'} Mode`}>
            <IconButton onClick={toggleTheme} size="small">
              {isDarkMode ? <LightMode /> : <DarkMode />}
            </IconButton>
          </Tooltip>
        </Box>
        
        {/* Right side - Clear button and Logout */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Button
            onClick={clearMessages}
            variant="outlined"
            size="small"
            sx={{
              color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)',
              borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)',
              '&:hover': {
                borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.4)',
                background: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
              }
            }}
          >
            Clear
          </Button>
          
          {/* Logout button */}
          <Tooltip title="Logout">
            <IconButton onClick={logout} size="small">
              <Logout />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
      {/* Main chat area starts here */}
      {/* Messages Area */}
      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          background: isDarkMode 
            ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(168, 85, 247, 0.08) 50%, rgba(236, 72, 153, 0.08) 100%)'
            : 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(168, 85, 247, 0.15) 50%, rgba(236, 72, 153, 0.15) 100%)',
          px: { xs: 2, sm: 4 },
          py: 3,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <Box
          sx={{
            flex: 1,
            overflowY: 'auto',
            pb: 2,
            '&::-webkit-scrollbar': {
              width: 8
            },
            '&::-webkit-scrollbar-track': {
              background: 'transparent'
            },
            '&::-webkit-scrollbar-thumb': {
              background: isDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)',
              borderRadius: 4
            }
          }}
        >
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {messages.length === 0 ? (
              <motion.div
                variants={itemVariants}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100%',
                  textAlign: 'center',
                  minHeight: '60vh'
                }}
              >
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 700,
                    mb: 2,
                    color: isDarkMode ? 'white' : 'text.primary',
                    background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}
                >
                  Welcome to ThinkLy!
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'text.secondary',
                    maxWidth: 400,
                    lineHeight: 1.6,
                    mb: 3
                  }}
                >
                  Start a conversation with {getModelDisplayName(selectedModel)}. 
                  Ask questions, get creative, or just chat!
                </Typography>
              </motion.div>
            ) : (
              <AnimatePresence>
                {messages.map((message, index) => (
                  <motion.div
                    key={message.id}
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    transition={{ delay: index * 0.1 }}
                  >
                    <Message
                      message={message}
                      isDarkMode={isDarkMode}
                      modelName={getModelDisplayName(message.model)}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
            
            {isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}
              >
                <LoadingSpinner isDarkMode={isDarkMode} />
              </motion.div>
            )}
            
            <div ref={messagesEndRef} />
          </motion.div>
        </Box>
      </Box>

      {/* Input Area */}
      <Box
        sx={{
          background: isDarkMode ? '#1e293b' : '#ffffff',
          borderTop: isDarkMode
            ? '1px solid #334155'
            : '1px solid #e2e8f0',
          px: { xs: 2, sm: 4 },
          py: 3,
          display: 'flex',
          justifyContent: 'center',
          flexShrink: 0
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'flex-end',
            gap: 2,
            maxWidth: 900,
            width: '100%',
            background: isDarkMode ? '#334155' : '#f8fafc',
            border: isDarkMode
              ? '1px solid #475569'
              : '1px solid #e2e8f0',
            borderRadius: 12,
            p: 3,
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
          }}
        >
          <TextField
            ref={inputRef}
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
                fontSize: '15px',
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
                padding: '8px 0',
                '&::placeholder': {
                  color: isDarkMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)',
                  opacity: 1,
                  fontSize: '15px'
                }
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
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={sendMessageHandler}
                disabled={!inputMessage.trim() || isLoading}
                variant="contained"
                sx={{
                  minWidth: 48,
                  height: 48,
                  borderRadius: 8,
                  background: inputMessage.trim() && !isLoading
                    ? '#3b82f6'
                    : isDarkMode 
                      ? '#475569' 
                      : '#e2e8f0',
                  color: inputMessage.trim() && !isLoading ? 'white' : isDarkMode ? '#94a3b8' : '#64748b',
                  boxShadow: 'none',
                  '&:hover': {
                    background: inputMessage.trim() && !isLoading
                      ? '#2563eb'
                      : isDarkMode 
                        ? '#64748b' 
                        : '#cbd5e1',
                    boxShadow: inputMessage.trim() && !isLoading
                      ? '0 4px 12px rgba(59, 130, 246, 0.3)'
                      : 'none',
                    transform: inputMessage.trim() && !isLoading ? 'translateY(-1px)' : 'none'
                  },
                  '&:disabled': {
                    background: isDarkMode ? '#334155' : '#f1f5f9',
                    color: isDarkMode ? '#64748b' : '#94a3b8',
                    boxShadow: 'none'
                  },
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
              >
                {isLoading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <Refresh sx={{ fontSize: 18 }} />
                  </motion.div>
                ) : (
                  <Send sx={{ fontSize: 18 }} />
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