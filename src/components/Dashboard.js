import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  Typography, 
  Box, 
  Grid, 
  Card, 
  CardContent,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  IconButton,
  Tooltip
} from '@mui/material';
import { 
  TrendingUp, 
  Message, 
  Timer, 
  Speed,
  Chat as ChatIcon,
  Code,
  Translate,
  LightMode,
  DarkMode,
  Logout
} from '@mui/icons-material';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
  ArcElement,
  Filler,
  BarElement
} from 'chart.js';
import { Line, Doughnut, Bar } from 'react-chartjs-2';
import GoldenRetrieverLogo from './GoldenRetrieverLogo';
import { useChat } from '../contexts/ChatContext';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  ChartTooltip,
  Legend,
  ArcElement,
  Filler,
  BarElement
);

const Dashboard = ({ isDarkMode, toggleTheme }) => {
  const { messages } = useChat();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const calculateStats = useMemo(() => {
    const totalMessages = messages.length;
    const userMessages = messages.filter(msg => msg.role === 'user').length;
    const assistantMessages = messages.filter(msg => msg.role === 'assistant').length;
    const errorMessages = messages.filter(msg => msg.role === 'error').length;

    // Calculate model usage
    const modelUsage = messages.reduce((acc, msg) => {
      const model = msg.model || 'unknown';
      acc[model] = (acc[model] || 0) + 1;
      return acc;
    }, {});

    // Calculate message types (code, text, etc.)
    const messageTypes = {
      text: 0,
      code: 0,
      error: errorMessages
    };

    messages.forEach(msg => {
      if (msg.content.includes('```')) {
        messageTypes.code++;
      } else {
        messageTypes.text++;
      }
    });

    // Calculate total tokens (rough estimation)
    const totalTokens = messages.reduce((acc, msg) => {
      return acc + Math.ceil(msg.content.length / 4); // Rough estimation
    }, 0);

    // Calculate hourly activity
    const hourlyActivity = Array.from({ length: 24 }, (_, hour) => {
      const hourMessages = messages.filter(msg => {
        const msgHour = new Date(msg.timestamp).getHours();
        return msgHour === hour;
      });
      return {
        hour: `${hour}:00`,
        messages: hourMessages.length
      };
    });

    // Calculate average response time (mock data for now)
    const averageResponseTime = totalMessages > 0 ? Math.random() * 3 + 1 : 0;

    return {
      totalMessages,
      userMessages,
      assistantMessages,
      errorMessages,
      totalTokens,
      averageResponseTime,
      modelUsage,
      messageTypes,
      hourlyActivity
    };
  }, [messages]);

  const chartColors = {
    primary: '#667eea',
    secondary: '#764ba2',
    success: '#10b981',
    error: '#ef4444',
    info: '#3b82f6',
    warning: '#f59e0b',
    purple: '#8b5cf6',
    pink: '#ec4899',
    indigo: '#6366f1',
    teal: '#14b8a6'
  };

  const pieData = [
    { name: 'Text Messages', value: calculateStats.messageTypes.text, color: chartColors.primary },
    { name: 'Code Messages', value: calculateStats.messageTypes.code, color: chartColors.secondary },
    { name: 'Error Messages', value: calculateStats.messageTypes.error, color: chartColors.error }
  ].filter(item => item.value > 0);

  const modelUsageData = Object.entries(calculateStats.modelUsage).map(([model, count]) => ({
    name: model.charAt(0).toUpperCase() + model.slice(1),
    value: count,
    color: model === 'gemini' ? chartColors.primary : 
           model === 'mistral' ? chartColors.secondary : chartColors.purple
  }));

  // Chart.js data preparation
  const lineChartData = {
    labels: calculateStats.hourlyActivity.map(item => item.hour),
    datasets: [
      {
        label: 'Messages',
        data: calculateStats.hourlyActivity.map(item => item.messages),
        borderColor: chartColors.primary,
        backgroundColor: isDarkMode 
          ? 'rgba(102, 126, 234, 0.1)' 
          : 'rgba(102, 126, 234, 0.05)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: chartColors.primary,
        pointBorderColor: isDarkMode ? '#1a1a2e' : '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
        pointHoverBackgroundColor: chartColors.secondary,
        pointHoverBorderColor: isDarkMode ? '#1a1a2e' : '#ffffff',
        pointHoverBorderWidth: 3
      }
    ]
  };

  const doughnutChartData = {
    labels: pieData.map(item => item.name),
    datasets: [
      {
        data: pieData.map(item => item.value),
        backgroundColor: pieData.map(item => item.color),
        borderColor: isDarkMode ? '#1a1a2e' : '#ffffff',
        borderWidth: 3,
        hoverBorderColor: isDarkMode ? '#1a1a2e' : '#ffffff',
        hoverBorderWidth: 4
      }
    ]
  };

  // Chart options
  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: isDarkMode ? '#1a1a2e' : '#ffffff',
        titleColor: isDarkMode ? '#ffffff' : '#000000',
        bodyColor: isDarkMode ? '#ffffff' : '#000000',
        borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          title: (context) => `Hour: ${context[0].label}`,
          label: (context) => `Messages: ${context.parsed.y}`
        }
      }
    },
    scales: {
      x: {
        grid: {
          color: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
          drawBorder: false
        },
        ticks: {
          color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)',
          font: {
            size: 12
          }
        }
      },
      y: {
        grid: {
          color: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
          drawBorder: false
        },
        ticks: {
          color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)',
          font: {
            size: 12
          },
          beginAtZero: true
        }
      }
    },
    interaction: {
      intersect: false,
      mode: 'index'
    },
    elements: {
      point: {
        hoverRadius: 8
      }
    }
  };

  const doughnutChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: isDarkMode ? '#1a1a2e' : '#ffffff',
        titleColor: isDarkMode ? '#ffffff' : '#000000',
        bodyColor: isDarkMode ? '#ffffff' : '#000000',
        borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        borderWidth: 1,
        cornerRadius: 8,
        callbacks: {
          label: (context) => {
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((context.parsed / total) * 100).toFixed(1);
            return `${context.label}: ${context.parsed} (${percentage}%)`;
          }
        }
      }
    },
    cutout: '60%',
    radius: '90%'
  };

  // Bar chart data for model usage
  const barChartData = {
    labels: modelUsageData.map(item => item.name),
    datasets: [
      {
        label: 'Messages',
        data: modelUsageData.map(item => item.value),
        backgroundColor: modelUsageData.map(item => item.color),
        borderColor: modelUsageData.map(item => item.color),
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
        hoverBackgroundColor: modelUsageData.map(item => `${item.color}CC`),
        hoverBorderColor: modelUsageData.map(item => item.color),
        hoverBorderWidth: 3
      }
    ]
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: isDarkMode ? '#1a1a2e' : '#ffffff',
        titleColor: isDarkMode ? '#ffffff' : '#000000',
        bodyColor: isDarkMode ? '#ffffff' : '#000000',
        borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          title: (context) => `Model: ${context[0].label}`,
          label: (context) => `Messages: ${context.parsed.y}`
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)',
          font: {
            size: 12,
            weight: '600'
          }
        }
      },
      y: {
        grid: {
          color: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
          drawBorder: false
        },
        ticks: {
          color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)',
          font: {
            size: 12
          },
          beginAtZero: true
        }
      }
    },
    interaction: {
      intersect: false,
      mode: 'index'
    }
  };

  return (
    <Box sx={{ 
      height: '100vh', 
      overflow: 'hidden',
      background: isDarkMode 
        ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(168, 85, 247, 0.08) 50%, rgba(236, 72, 153, 0.08) 100%)'
        : 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(168, 85, 247, 0.15) 50%, rgba(236, 72, 153, 0.15) 100%)',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Top bar with Chat navigation */}
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
        {/* Chat navigation on the left */}
        <Tooltip title="Back to Chat">
          <IconButton 
            onClick={() => navigate('/chat')}
            sx={{
              color: location.pathname === '/chat' 
                ? (isDarkMode ? '#667eea' : '#4a5fd8')
                : (isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)'),
              '&:hover': {
                color: isDarkMode ? '#8b9df0' : '#667eea',
              }
            }}
          >
            <ChatIcon />
          </IconButton>
        </Tooltip>
        
        {/* Theme toggle on the right */}
        <Tooltip title={`Switch to ${isDarkMode ? 'Light' : 'Dark'} Mode`}>
          <IconButton onClick={toggleTheme} size="small">
            {isDarkMode ? <LightMode /> : <DarkMode />}
          </IconButton>
        </Tooltip>
        
        {/* Logout button */}
        <Tooltip title="Logout">
          <IconButton onClick={logout} size="small">
            <Logout />
          </IconButton>
        </Tooltip>
      </Box>
      
      {/* Dashboard Content */}
      <Box sx={{ 
        p: 4, 
        flex: 1,
        overflow: 'auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        background: isDarkMode 
          ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(168, 85, 247, 0.08) 50%, rgba(236, 72, 153, 0.08) 100%)'
          : 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(168, 85, 247, 0.15) 50%, rgba(236, 72, 153, 0.15) 100%)'
      }}>
        <Box sx={{ maxWidth: 1400, width: '100%' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Header */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 6, justifyContent: 'center' }}>
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
              >
                <Box
                  sx={{
                    width: 64,
                    height: 64,
                    borderRadius: 4,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 12px 40px rgba(102, 126, 234, 0.4)'
                  }}
                >
                  <GoldenRetrieverLogo size={48} isDarkMode={isDarkMode} />
                </Box>
              </motion.div>
              
              <Box sx={{ textAlign: 'center' }}>
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 800,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    mb: 1
                  }}
                >
                  ThinkLy Dashboard
                </Typography>
                <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 400 }}>
                  Analytics and insights for your AI conversations
                </Typography>
              </Box>
            </Box>

            {/* Stats Cards - Compact Single Row */}
            <Grid container spacing={3} sx={{ mb: 4, justifyContent: 'center' }}>
              <Grid item xs={12} sm={6} md={3}>
                <motion.div whileHover={{ scale: 1.02, y: -2 }}>
                  <Card
                    sx={{
                      height: 140,
                      minHeight: 140,
                      background: isDarkMode 
                        ? 'linear-gradient(135deg, rgba(102, 126, 234, 0.15) 0%, rgba(118, 75, 162, 0.15) 100%)'
                        : 'linear-gradient(135deg, rgba(102, 126, 234, 0.08) 0%, rgba(118, 75, 162, 0.08) 100%)',
                      border: `2px solid ${isDarkMode ? 'rgba(102, 126, 234, 0.3)' : 'rgba(102, 126, 234, 0.2)'}`,
                      borderRadius: 3,
                      boxShadow: isDarkMode 
                        ? '0 6px 24px rgba(102, 126, 234, 0.2)' 
                        : '0 6px 24px rgba(102, 126, 234, 0.1)',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <CardContent sx={{ p: 2, textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: 2,
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          margin: '0 auto 1rem',
                          boxShadow: '0 4px 16px rgba(102, 126, 234, 0.4)'
                        }}
                      >
                        <Message sx={{ color: 'white', fontSize: 20 }} />
                      </Box>
                      <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5 }}>
                        {calculateStats.totalMessages}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                        Total Messages
                      </Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <motion.div whileHover={{ scale: 1.02, y: -2 }}>
                  <Card
                    sx={{
                      height: 140,
                      minHeight: 140,
                      background: isDarkMode 
                        ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(20, 184, 166, 0.15) 100%)'
                        : 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(20, 184, 166, 0.08) 100%)',
                      border: `2px solid ${isDarkMode ? 'rgba(16, 185, 129, 0.3)' : 'rgba(16, 185, 129, 0.2)'}`,
                      borderRadius: 3,
                      boxShadow: isDarkMode 
                        ? '0 6px 24px rgba(16, 185, 129, 0.2)' 
                        : '0 6px 24px rgba(16, 185, 129, 0.1)',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <CardContent sx={{ p: 2, textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: 2,
                          background: 'linear-gradient(135deg, #10b981 0%, #14b8a6 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          margin: '0 auto 1rem',
                          boxShadow: '0 4px 16px rgba(16, 185, 129, 0.4)'
                        }}
                      >
                        <TrendingUp sx={{ color: 'white', fontSize: 20 }} />
                      </Box>
                      <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5 }}>
                        {calculateStats.totalTokens.toLocaleString()}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                        Total Tokens
                      </Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <motion.div whileHover={{ scale: 1.02, y: -2 }}>
                  <Card
                    sx={{
                      height: 140,
                      minHeight: 140,
                      background: isDarkMode 
                        ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(99, 102, 241, 0.15) 100%)'
                        : 'linear-gradient(135deg, rgba(59, 130, 246, 0.08) 0%, rgba(99, 102, 241, 0.08) 100%)',
                      border: `2px solid ${isDarkMode ? 'rgba(59, 130, 246, 0.3)' : 'rgba(59, 130, 246, 0.2)'}`,
                      borderRadius: 3,
                      boxShadow: isDarkMode 
                        ? '0 6px 24px rgba(59, 130, 246, 0.2)' 
                        : '0 6px 24px rgba(59, 130, 246, 0.1)',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <CardContent sx={{ p: 2, textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: 2,
                          background: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          margin: '0 auto 1rem',
                          boxShadow: '0 4px 16px rgba(59, 130, 246, 0.4)'
                        }}
                      >
                        <Timer sx={{ color: 'white', fontSize: 20 }} />
                      </Box>
                      <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5 }}>
                        {calculateStats.averageResponseTime.toFixed(1)}s
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                        Avg Response Time
                      </Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <motion.div whileHover={{ scale: 1.02, y: -2 }}>
                  <Card
                    sx={{
                      height: 140,
                      minHeight: 140,
                      background: isDarkMode 
                        ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(236, 72, 153, 0.15) 100%)'
                        : 'linear-gradient(135deg, rgba(139, 92, 246, 0.08) 0%, rgba(236, 72, 153, 0.08) 100%)',
                      border: `2px solid ${isDarkMode ? 'rgba(139, 92, 246, 0.3)' : 'rgba(139, 92, 246, 0.2)'}`,
                      borderRadius: 3,
                      boxShadow: isDarkMode 
                        ? '0 6px 24px rgba(139, 92, 246, 0.2)' 
                        : '0 6px 24px rgba(139, 92, 246, 0.1)',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <CardContent sx={{ p: 2, textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: 2,
                          background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          margin: '0 auto 1rem',
                          boxShadow: '0 4px 16px rgba(139, 92, 246, 0.4)'
                        }}
                      >
                        <Speed sx={{ color: 'white', fontSize: 20 }} />
                      </Box>
                      <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5 }}>
                        {Object.keys(calculateStats.modelUsage).length}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                        Models Used
                      </Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            </Grid>

            {/* Charts Section - Single Row with Uniform Heights */}
            <Grid container spacing={3} sx={{ mb: 4, justifyContent: 'center' }}>
              {/* Activity Chart */}
              <Grid item xs={12} md={4}>
                <motion.div whileHover={{ scale: 1.01 }}>
                  <Card
                    sx={{
                      height: 320,
                      background: isDarkMode 
                        ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.04) 100%)'
                        : 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.7) 100%)',
                      border: `2px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.1)'}`,
                      borderRadius: 3,
                      boxShadow: isDarkMode 
                        ? '0 8px 32px rgba(0, 0, 0, 0.2)' 
                        : '0 8px 32px rgba(0, 0, 0, 0.1)',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                      <Typography variant="h6" sx={{ mb: 2, fontWeight: 700, textAlign: 'center' }}>
                        Hourly Activity
                      </Typography>
                      <Box sx={{ flex: 1, position: 'relative' }}>
                        <Line data={lineChartData} options={lineChartOptions} />
                      </Box>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>

              {/* Message Types Doughnut Chart */}
              <Grid item xs={12} md={4}>
                <motion.div whileHover={{ scale: 1.01 }}>
                  <Card
                    sx={{
                      height: 320,
                      background: isDarkMode 
                        ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.04) 100%)'
                        : 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.7) 100%)',
                      border: `2px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.1)'}`,
                      borderRadius: 3,
                      boxShadow: isDarkMode 
                        ? '0 8px 32px rgba(0, 0, 0, 0.2)' 
                        : '0 8px 32px rgba(0, 0, 0, 0.1)',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                      <Typography variant="h6" sx={{ mb: 2, fontWeight: 700, textAlign: 'center' }}>
                        Message Types
                      </Typography>
                      {pieData.length > 0 ? (
                        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                          <Box sx={{ flex: 1, width: '100%', position: 'relative', minHeight: 200 }}>
                            <Doughnut data={doughnutChartData} options={doughnutChartOptions} />
                          </Box>
                          <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 1, width: '100%' }}>
                            {pieData.map((item, index) => (
                              <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                <Box
                                  sx={{
                                    width: 12,
                                    height: 12,
                                    borderRadius: '50%',
                                    background: item.color,
                                    boxShadow: `0 2px 6px ${item.color}40`
                                  }}
                                />
                                <Typography variant="caption" sx={{ fontWeight: 500, flex: 1 }}>
                                  {item.name}
                                </Typography>
                                <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                                  {item.value}
                                </Typography>
                              </Box>
                            ))}
                          </Box>
                        </Box>
                      ) : (
                        <Box sx={{ 
                          flex: 1,
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center', 
                          color: 'text.secondary'
                        }}>
                          <Typography variant="body2">No data available</Typography>
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>

              {/* Model Usage Bar Chart */}
              <Grid item xs={12} md={4}>
                <motion.div whileHover={{ scale: 1.01 }}>
                  <Card
                    sx={{
                      height: 320,
                      background: isDarkMode 
                        ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.04) 100%)'
                        : 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.7) 100%)',
                      border: `2px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.1)'}`,
                      borderRadius: 3,
                      boxShadow: isDarkMode 
                        ? '0 8px 32px rgba(0, 0, 0, 0.2)' 
                        : '0 8px 32px rgba(0, 0, 0, 0.1)',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                      <Typography variant="h6" sx={{ mb: 2, fontWeight: 700, textAlign: 'center' }}>
                        Model Usage
                      </Typography>
                      {modelUsageData.length > 0 ? (
                        <Box sx={{ flex: 1, position: 'relative' }}>
                          <Bar data={barChartData} options={barChartOptions} />
                        </Box>
                      ) : (
                        <Box sx={{ 
                          flex: 1,
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center', 
                          color: 'text.secondary'
                        }}>
                          <Typography variant="body2">No model usage data</Typography>
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            </Grid>

            {/* Model Usage and Recent Activity */}
            <Grid container spacing={4} sx={{ mb: 4, justifyContent: 'center' }}>
              {/* Recent Activity - Full Width and Centered */}
              <Grid item xs={12}>
                <motion.div whileHover={{ scale: 1.01 }}>
                  <Card
                    sx={{
                      height: 400,
                      background: isDarkMode 
                        ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.04) 100%)'
                        : 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.7) 100%)',
                      border: `2px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.1)'}`,
                      borderRadius: 3,
                      boxShadow: isDarkMode 
                        ? '0 8px 32px rgba(0, 0, 0, 0.2)' 
                        : '0 8px 32px rgba(0, 0, 0, 0.1)',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <CardContent sx={{ p: 4, height: '100%', display: 'flex', flexDirection: 'column' }}>
                      <Typography variant="h5" sx={{ mb: 3, fontWeight: 700, textAlign: 'center' }}>
                        Recent Activity
                      </Typography>
                      {messages.length > 0 ? (
                        <Box sx={{ flex: 1, overflow: 'auto' }}>
                          <List>
                            {messages.slice(-10).reverse().map((message, index) => (
                              <React.Fragment key={message.id}>
                                <ListItem sx={{ px: 0, py: 1.5 }}>
                                  <ListItemIcon>
                                    {message.role === 'user' ? (
                                      <ChatIcon sx={{ color: chartColors.info, fontSize: 24 }} />
                                    ) : message.role === 'assistant' ? (
                                      <Code sx={{ color: chartColors.primary, fontSize: 24 }} />
                                    ) : (
                                      <Translate sx={{ color: chartColors.error, fontSize: 24 }} />
                                    )}
                                  </ListItemIcon>
                                  <ListItemText 
                                    primary={
                                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                        {message.content.substring(0, 100) + (message.content.length > 100 ? '...' : '')}
                                      </Typography>
                                    }
                                    secondary={new Date(message.timestamp).toLocaleString()}
                                  />
                                  <Chip 
                                    label={message.model || 'unknown'} 
                                    size="small"
                                    sx={{ 
                                      background: message.model === 'gemini' ? chartColors.primary : 
                                               message.model === 'mistral' ? chartColors.secondary : chartColors.purple,
                                      color: 'white',
                                      fontWeight: 600,
                                      boxShadow: `0 2px 8px ${message.model === 'gemini' ? chartColors.primary : 
                                                    message.model === 'mistral' ? chartColors.secondary : chartColors.purple}40`
                                    }}
                                  />
                                </ListItem>
                                {index < Math.min(9, messages.length - 1) && <Divider />}
                              </React.Fragment>
                            ))}
                          </List>
                        </Box>
                      ) : (
                        <Box sx={{ 
                          flex: 1,
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center', 
                          color: 'text.secondary'
                        }}>
                          <Typography variant="h6">No recent activity</Typography>
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            </Grid>
          </motion.div>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard; 