import React from 'react';
import { 
  Typography, 
  Box, 
  Chip, 
  IconButton,
  Tooltip
} from '@mui/material';
import { 
  ContentCopy,
  CheckCircle
} from '@mui/icons-material';
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { TypeAnimation } from 'react-type-animation';

const Message = ({ message, isDarkMode, modelName }) => {
  const [copiedCode, setCopiedCode] = useState({});

  const copyCodeToClipboard = async (code, index) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(prev => ({ ...prev, [index]: true }));
      setTimeout(() => {
        setCopiedCode(prev => ({ ...prev, [index]: false }));
      }, 2000);
    } catch (err) {
      console.error('Failed to copy code: ', err);
    }
  };

  const isUser = message.role === 'user';

  // Function to detect and extract code blocks
  const extractCodeBlocks = (content) => {
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
    const inlineCodeRegex = /`([^`]+)`/g;
    
    const parts = [];
    let lastIndex = 0;
    let match;
    let blockIndex = 0;

    // Find code blocks
    while ((match = codeBlockRegex.exec(content)) !== null) {
      // Add text before code block
      if (match.index > lastIndex) {
        parts.push({
          type: 'text',
          content: content.slice(lastIndex, match.index)
        });
      }

      // Add code block
      parts.push({
        type: 'code',
        language: match[1] || 'text',
        content: match[2].trim(),
        index: blockIndex++
      });

      lastIndex = match.index + match[0].length;
    }

    // Add remaining text
    if (lastIndex < content.length) {
      parts.push({
        type: 'text',
        content: content.slice(lastIndex)
      });
    }

    // Process inline code in text parts
    return parts.map(part => {
      if (part.type === 'text') {
        const textParts = [];
        let textLastIndex = 0;
        let textMatch;

        while ((textMatch = inlineCodeRegex.exec(part.content)) !== null) {
          // Add text before inline code
          if (textMatch.index > textLastIndex) {
            textParts.push({
              type: 'text',
              content: part.content.slice(textLastIndex, textMatch.index)
            });
          }

          // Add inline code
          textParts.push({
            type: 'inlineCode',
            content: textMatch[1]
          });

          textLastIndex = textMatch.index + textMatch[0].length;
        }

        // Add remaining text
        if (textLastIndex < part.content.length) {
          textParts.push({
            type: 'text',
            content: part.content.slice(textLastIndex)
          });
        }

        return textParts.length > 1 ? textParts : part;
      }
      return part;
    }).flat();
  };

  const getLanguageIcon = (language) => {
    const icons = {
      javascript: 'JS',
      js: 'JS',
      typescript: 'TS',
      ts: 'TS',
      python: 'PY',
      py: 'PY',
      java: 'Java',
      cpp: 'C++',
      c: 'C',
      html: 'HTML',
      css: 'CSS',
      sql: 'SQL',
      json: 'JSON',
      xml: 'XML',
      bash: 'Bash',
      shell: 'Shell',
      php: 'PHP',
      ruby: 'Ruby',
      go: 'Go',
      rust: 'Rust',
      swift: 'Swift',
      kotlin: 'Kotlin'
    };
    return icons[language.toLowerCase()] || language.toUpperCase();
  };

  const contentParts = extractCodeBlocks(message.content);

  // ChatGPT-style bubble
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        mb: 3,
        animation: 'fadeInUp 0.5s ease-out'
      }}
    >
      {/* Enhanced Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          mb: 1.5
        }}
      >
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '16px',
            fontWeight: 700,
            color: isUser ? '#000' : '#fff',
            background: isUser 
              ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
              : 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
            border: `2px solid ${isUser ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.2)'}`,
            position: 'relative',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: -2,
              left: -2,
              right: -2,
              bottom: -2,
              background: isUser 
                ? 'linear-gradient(135deg, #667eea, #764ba2)'
                : 'linear-gradient(135deg, #f093fb, #f5576c)',
              borderRadius: '50%',
              zIndex: -1,
              opacity: 0.3
            }
          }}
        >
          {isUser ? 'U' : 'AI'}
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 0.5
          }}
        >
          <Typography
            variant="subtitle2"
            sx={{
              fontWeight: 700,
              color: isUser ? 'rgba(255, 255, 255, 0.95)' : 'rgba(0, 0, 0, 0.9)',
              fontSize: '1rem',
              letterSpacing: '-0.2px'
            }}
          >
            {isUser ? 'You' : modelName || 'AI Assistant'}
          </Typography>
          <Typography
            variant="caption"
            sx={{
              color: isUser ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)',
              fontSize: '0.75rem',
              fontWeight: 400
            }}
          >
            {new Date(message.timestamp).toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </Typography>
        </Box>
      </Box>

      {/* Enhanced Content */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          background: isUser 
            ? 'rgba(255, 255, 255, 0.1)' 
            : 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(20px)',
          border: `1px solid ${isUser ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.1)'}`,
          borderRadius: 3,
          p: 3,
          boxShadow: isDarkMode 
            ? '0 8px 32px rgba(0, 0, 0, 0.2)' 
            : '0 8px 32px rgba(0, 0, 0, 0.1)',
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: isDarkMode 
              ? '0 12px 40px rgba(0, 0, 0, 0.3)' 
              : '0 12px 40px rgba(0, 0, 0, 0.15)',
            transform: 'translateY(-2px)'
          }
        }}
      >
        {contentParts.map((part, index) => {
          if (part.type === 'code') {
            return (
              <Box
                key={index}
                sx={{
                  position: 'relative',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  background: isDarkMode ? '#1a1a2e' : '#f8fafc',
                  border: `2px solid ${isDarkMode ? '#2d2d2d' : '#e9ecef'}`,
                  boxShadow: isDarkMode 
                    ? '0 12px 40px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)' 
                    : '0 12px 40px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
                  mb: 3,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: isDarkMode 
                      ? '0 16px 50px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1)' 
                      : '0 16px 50px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.8)'
                  }
                }}
              >
                {/* Enhanced Code Header */}
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    px: 3,
                    py: 2,
                    background: isDarkMode 
                      ? 'linear-gradient(135deg, #2d2d2d 0%, #404040 100%)' 
                      : 'linear-gradient(135deg, #e9ecef 0%, #f8f9fa 100%)',
                    borderBottom: `2px solid ${isDarkMode ? '#404040' : '#dee2e6'}`,
                    position: 'relative',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '2px',
                      background: 'linear-gradient(135deg, #3b82f6, #8b5cf6, #ec4899)'
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box
                      sx={{
                        display: 'flex',
                        gap: 0.5
                      }}
                    >
                      <Box
                        sx={{
                          width: 12,
                          height: 12,
                          borderRadius: '50%',
                          background: '#ef4444',
                          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
                        }}
                      />
                      <Box
                        sx={{
                          width: 12,
                          height: 12,
                          borderRadius: '50%',
                          background: '#f59e0b',
                          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
                        }}
                      />
                      <Box
                        sx={{
                          width: 12,
                          height: 12,
                          borderRadius: '50%',
                          background: '#10b981',
                          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
                        }}
                      />
                    </Box>
                    <Chip
                      label={getLanguageIcon(part.language)}
                      size="small"
                      sx={{
                        height: 24,
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        background: isDarkMode ? '#404040' : '#fff',
                        color: isDarkMode ? '#fff' : '#333',
                        border: `2px solid ${isDarkMode ? '#555' : '#ddd'}`,
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                        '& .MuiChip-label': {
                          px: 1.5
                        }
                      }}
                    />
                  </Box>
                  <Tooltip title={copiedCode[index] ? "Copied!" : "Copy code"}>
                    <IconButton
                      size="small"
                      onClick={() => copyCodeToClipboard(part.content, index)}
                      sx={{
                        color: copiedCode[index] ? '#4caf50' : (isDarkMode ? '#fff' : '#666'),
                        background: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
                        border: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)'}`,
                        '&:hover': {
                          background: isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)',
                          transform: 'scale(1.1)'
                        },
                        transition: 'all 0.2s ease'
                      }}
                    >
                      {copiedCode[index] ? <CheckCircle fontSize="small" /> : <ContentCopy fontSize="small" />}
                    </IconButton>
                  </Tooltip>
                </Box>

                {/* Enhanced Code Content with Typewriter Effect */}
                <Box sx={{ p: 0, position: 'relative' }}>
                  <TypeAnimation
                    sequence={[part.content]}
                    speed={50}
                    cursor={false}
                    style={{
                      display: 'block',
                      padding: '20px',
                      margin: 0,
                      fontSize: '14px',
                      lineHeight: 1.6,
                      fontFamily: '"Fira Code", "Consolas", "Monaco", "Courier New", monospace',
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word',
                      overflowWrap: 'break-word',
                      background: 'transparent',
                      color: isDarkMode ? '#e5e7eb' : '#1f2937'
                    }}
                    wrapper="pre"
                  />
                </Box>
              </Box>
            );
          } else {
            return (
              <Box key={index}>
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    h1: ({ children }) => (
                      <Typography variant="h4" component="h1" sx={{ 
                        fontWeight: 700, 
                        mb: 2, 
                        mt: 3,
                        color: 'inherit',
                        fontSize: '1.5rem',
                        lineHeight: 1.3
                      }}>
                        {children}
                      </Typography>
                    ),
                    h2: ({ children }) => (
                      <Typography variant="h5" component="h2" sx={{ 
                        fontWeight: 600, 
                        mb: 1.5, 
                        mt: 2.5,
                        color: 'inherit',
                        fontSize: '1.3rem',
                        lineHeight: 1.3
                      }}>
                        {children}
                      </Typography>
                    ),
                    h3: ({ children }) => (
                      <Typography variant="h6" component="h3" sx={{ 
                        fontWeight: 600, 
                        mb: 1, 
                        mt: 2,
                        color: 'inherit',
                        fontSize: '1.1rem',
                        lineHeight: 1.3
                      }}>
                        {children}
                      </Typography>
                    ),
                    h4: ({ children }) => (
                      <Typography variant="subtitle1" component="h4" sx={{ 
                        fontWeight: 600, 
                        mb: 1, 
                        mt: 1.5,
                        color: 'inherit',
                        fontSize: '1rem',
                        lineHeight: 1.3
                      }}>
                        {children}
                      </Typography>
                    ),
                    h5: ({ children }) => (
                      <Typography variant="subtitle2" component="h5" sx={{ 
                        fontWeight: 600, 
                        mb: 0.5, 
                        mt: 1,
                        color: 'inherit',
                        fontSize: '0.95rem',
                        lineHeight: 1.3
                      }}>
                        {children}
                      </Typography>
                    ),
                    h6: ({ children }) => (
                      <Typography variant="body1" component="h6" sx={{ 
                        fontWeight: 600, 
                        mb: 0.5, 
                        mt: 1,
                        color: 'inherit',
                        fontSize: '0.9rem',
                        lineHeight: 1.3
                      }}>
                        {children}
                      </Typography>
                    ),
                    p: ({ children }) => (
                      <Typography component="p" sx={{ 
                        mb: 1.5, 
                        lineHeight: 1.6,
                        color: 'inherit',
                        fontSize: 'inherit',
                        wordWrap: 'break-word',
                        overflowWrap: 'break-word'
                      }}>
                        {children}
                      </Typography>
                    ),
                    strong: ({ children }) => (
                      <Box component="span" sx={{ 
                        fontWeight: 700, 
                        color: 'inherit'
                      }}>
                        {children}
                      </Box>
                    ),
                    em: ({ children }) => (
                      <Box component="span" sx={{ 
                        fontStyle: 'italic', 
                        color: 'inherit'
                      }}>
                        {children}
                      </Box>
                    ),
                    ul: ({ children }) => (
                      <Box component="ul" sx={{ 
                        mb: 1.5, 
                        pl: 2.5,
                        color: 'inherit',
                        '& li': {
                          mb: 0.5,
                          lineHeight: 1.6
                        }
                      }}>
                        {children}
                      </Box>
                    ),
                    ol: ({ children }) => (
                      <Box component="ol" sx={{ 
                        mb: 1.5, 
                        pl: 2.5,
                        color: 'inherit',
                        '& li': {
                          mb: 0.5,
                          lineHeight: 1.6
                        }
                      }}>
                        {children}
                      </Box>
                    ),
                    li: ({ children }) => (
                      <Typography component="li" sx={{ 
                        mb: 0.5, 
                        lineHeight: 1.6,
                        color: 'inherit',
                        fontSize: 'inherit'
                      }}>
                        {children}
                      </Typography>
                    ),
                    blockquote: ({ children }) => (
                      <Box
                        component="blockquote"
                        sx={{
                          borderLeft: `3px solid ${isUser ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.2)'}`,
                          pl: 2,
                          ml: 0,
                          mr: 0,
                          mb: 1.5,
                          background: isUser ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
                          borderRadius: '4px',
                          py: 1,
                          fontStyle: 'italic'
                        }}
                      >
                        {children}
                      </Box>
                    ),
                    a: ({ href, children }) => (
                      <Box
                        component="a"
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{
                          color: isUser ? 'rgba(255, 255, 255, 0.9)' : (isDarkMode ? '#60a5fa' : '#3b82f6'),
                          textDecoration: 'underline',
                          textDecorationColor: isUser ? 'rgba(255, 255, 255, 0.5)' : 'rgba(59, 130, 246, 0.5)',
                          '&:hover': {
                            textDecorationColor: isUser ? 'rgba(255, 255, 255, 0.8)' : 'rgba(59, 130, 246, 0.8)'
                          }
                        }}
                      >
                        {children}
                      </Box>
                    ),
                    code: ({ children, className }) => {
                      // Handle inline code
                      if (!className) {
                        return (
                          <Box
                            component="code"
                            sx={{
                              background: isUser 
                                ? 'rgba(255, 255, 255, 0.15)' 
                                : (isDarkMode ? 'rgba(0, 0, 0, 0.15)' : 'rgba(0, 0, 0, 0.08)'),
                              color: 'inherit',
                              padding: '2px 6px',
                              borderRadius: '4px',
                              fontSize: '0.9em',
                              fontFamily: 'Consolas, Monaco, "Courier New", monospace',
                              display: 'inline-block',
                              wordBreak: 'break-word'
                            }}
                          >
                            {children}
                          </Box>
                        );
                      }
                      // For code blocks, return null as we handle them separately
                      return null;
                    },
                    pre: ({ children }) => {
                      // Return null for pre tags as we handle code blocks separately
                      return null;
                    }
                  }}
                >
                  {part.content}
                </ReactMarkdown>
              </Box>
            );
          }
        })}
      </Box>
    </Box>
  );
};

export default Message; 