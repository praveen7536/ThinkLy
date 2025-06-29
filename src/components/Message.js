import React from 'react';
import { motion } from 'framer-motion';
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
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

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

  const codeBlockVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3, delay: 0.1 }
    }
  };

  // Custom components for ReactMarkdown
  const markdownComponents = {
    h1: ({ children }) => (
      <Typography variant="h4" component="h1" sx={{ 
        fontWeight: 700, 
        mb: 2, 
        mt: 3,
        color: isDarkMode ? '#fff' : '#222'
      }}>
        {children}
      </Typography>
    ),
    h2: ({ children }) => (
      <Typography variant="h5" component="h2" sx={{ 
        fontWeight: 600, 
        mb: 1.5, 
        mt: 2.5,
        color: isDarkMode ? '#fff' : '#222'
      }}>
        {children}
      </Typography>
    ),
    h3: ({ children }) => (
      <Typography variant="h6" component="h3" sx={{ 
        fontWeight: 600, 
        mb: 1, 
        mt: 2,
        color: isDarkMode ? '#fff' : '#222'
      }}>
        {children}
      </Typography>
    ),
    h4: ({ children }) => (
      <Typography variant="subtitle1" component="h4" sx={{ 
        fontWeight: 600, 
        mb: 1, 
        mt: 1.5,
        color: isDarkMode ? '#fff' : '#222'
      }}>
        {children}
      </Typography>
    ),
    h5: ({ children }) => (
      <Typography variant="subtitle2" component="h5" sx={{ 
        fontWeight: 600, 
        mb: 0.5, 
        mt: 1,
        color: isDarkMode ? '#fff' : '#222'
      }}>
        {children}
      </Typography>
    ),
    h6: ({ children }) => (
      <Typography variant="body1" component="h6" sx={{ 
        fontWeight: 600, 
        mb: 0.5, 
        mt: 1,
        color: isDarkMode ? '#fff' : '#222'
      }}>
        {children}
      </Typography>
    ),
    p: ({ children }) => (
      <Typography component="p" sx={{ 
        mb: 1.5, 
        lineHeight: 1.6,
        color: isDarkMode ? '#fff' : '#222'
      }}>
        {children}
      </Typography>
    ),
    strong: ({ children }) => (
      <Box component="span" sx={{ fontWeight: 700, color: isDarkMode ? '#fff' : '#222' }}>
        {children}
      </Box>
    ),
    em: ({ children }) => (
      <Box component="span" sx={{ fontStyle: 'italic', color: isDarkMode ? '#fff' : '#222' }}>
        {children}
      </Box>
    ),
    ul: ({ children }) => (
      <Box component="ul" sx={{ 
        mb: 1.5, 
        pl: 3,
        color: isDarkMode ? '#fff' : '#222'
      }}>
        {children}
      </Box>
    ),
    ol: ({ children }) => (
      <Box component="ol" sx={{ 
        mb: 1.5, 
        pl: 3,
        color: isDarkMode ? '#fff' : '#222'
      }}>
        {children}
      </Box>
    ),
    li: ({ children }) => (
      <Typography component="li" sx={{ 
        mb: 0.5, 
        lineHeight: 1.6,
        color: isDarkMode ? '#fff' : '#222'
      }}>
        {children}
      </Typography>
    ),
    blockquote: ({ children }) => (
      <Box
        component="blockquote"
        sx={{
          borderLeft: `4px solid ${isDarkMode ? '#4285f4' : '#1976d2'}`,
          pl: 2,
          ml: 0,
          mr: 0,
          mb: 1.5,
          background: isDarkMode ? 'rgba(66, 133, 244, 0.1)' : 'rgba(25, 118, 210, 0.1)',
          borderRadius: 1,
          py: 1
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
          color: isDarkMode ? '#4285f4' : '#1976d2',
          textDecoration: 'none',
          '&:hover': {
            textDecoration: 'underline'
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
              background: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
              color: isDarkMode ? '#e6f3ff' : '#d63384',
              padding: '2px 6px',
              borderRadius: 1,
              fontSize: '0.9em',
              fontFamily: 'Consolas, Monaco, "Courier New", monospace',
              border: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)'}`
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
  };

  const contentParts = extractCodeBlocks(message.content);

  // ChatGPT-style bubble
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: isUser ? 'flex-end' : 'flex-start',
        mb: 2,
      }}
    >
      <Box
        sx={{
          background: isUser
            ? (isDarkMode ? '#23272f' : '#f4f6fa')
            : (isDarkMode ? '#282c34' : '#e9eaf0'),
          color: isDarkMode ? '#fff' : '#222',
          borderRadius: 3,
          p: 2,
          maxWidth: '75%',
          boxShadow: 1,
          fontSize: 16,
          whiteSpace: 'pre-line',
        }}
      >
        {contentParts.map((part, index) => {
          if (part.type === 'text') {
            return (
              <Box key={index}>
                <ReactMarkdown 
                  remarkPlugins={[remarkGfm]}
                  components={markdownComponents}
                >
                  {part.content}
                </ReactMarkdown>
              </Box>
            );
          }

          if (part.type === 'inlineCode') {
            return (
              <Box
                key={index}
                component="code"
                sx={{
                  background: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                  color: isDarkMode ? '#e6f3ff' : '#d63384',
                  padding: '2px 6px',
                  borderRadius: 1,
                  fontSize: '0.9em',
                  fontFamily: 'Consolas, Monaco, "Courier New", monospace',
                  border: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)'}`
                }}
              >
                {part.content}
              </Box>
            );
          }

          if (part.type === 'code') {
            return (
              <motion.div
                key={index}
                variants={codeBlockVariants}
                initial="hidden"
                animate="visible"
                style={{ margin: '12px 0' }}
              >
                <Box
                  sx={{
                    background: isDarkMode ? '#1e1e1e' : '#f8f9fa',
                    border: `1px solid ${isDarkMode ? '#404040' : '#e1e4e8'}`,
                    borderRadius: 2,
                    overflow: 'hidden',
                    boxShadow: isDarkMode 
                      ? '0 4px 12px rgba(0, 0, 0, 0.3)' 
                      : '0 2px 8px rgba(0, 0, 0, 0.1)'
                  }}
                >
                  {/* Code Header */}
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      background: isDarkMode ? '#2d2d30' : '#f1f3f4',
                      borderBottom: `1px solid ${isDarkMode ? '#404040' : '#e1e4e8'}`,
                      px: 2,
                      py: 1,
                      minHeight: 36
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box
                        sx={{
                          width: 12,
                          height: 12,
                          borderRadius: '50%',
                          background: '#ff5f56',
                          boxShadow: '0 0 0 1px rgba(0,0,0,0.1)'
                        }}
                      />
                      <Box
                        sx={{
                          width: 12,
                          height: 12,
                          borderRadius: '50%',
                          background: '#ffbd2e',
                          boxShadow: '0 0 0 1px rgba(0,0,0,0.1)'
                        }}
                      />
                      <Box
                        sx={{
                          width: 12,
                          height: 12,
                          borderRadius: '50%',
                          background: '#27ca3f',
                          boxShadow: '0 0 0 1px rgba(0,0,0,0.1)'
                        }}
                      />
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Chip
                        label={getLanguageIcon(part.language)}
                        size="small"
                        sx={{
                          background: isDarkMode ? '#404040' : '#e1e4e8',
                          color: isDarkMode ? '#fff' : '#586069',
                          fontSize: '0.75rem',
                          height: 20,
                          '& .MuiChip-label': {
                            px: 1
                          }
                        }}
                      />
                      <Tooltip title={copiedCode[part.index] ? "Copied!" : "Copy code"}>
                        <IconButton
                          size="small"
                          onClick={() => copyCodeToClipboard(part.content, part.index)}
                          sx={{
                            color: isDarkMode ? '#8b949e' : '#586069',
                            '&:hover': {
                              color: isDarkMode ? '#fff' : '#24292e',
                              background: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'
                            }
                          }}
                        >
                          {copiedCode[part.index] ? <CheckCircle fontSize="small" /> : <ContentCopy fontSize="small" />}
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>

                  {/* Code Content */}
                  <Box sx={{ position: 'relative' }}>
                    <SyntaxHighlighter
                      language={part.language}
                      style={isDarkMode ? oneDark : oneLight}
                      customStyle={{
                        margin: 0,
                        padding: '16px',
                        background: 'transparent',
                        fontSize: '14px',
                        lineHeight: 1.5,
                        fontFamily: '"Fira Code", "Consolas", "Monaco", "Courier New", monospace'
                      }}
                      showLineNumbers={true}
                      lineNumberStyle={{
                        color: isDarkMode ? '#6a737d' : '#959da5',
                        minWidth: '2.5em',
                        paddingRight: '1em',
                        textAlign: 'right',
                        userSelect: 'none'
                      }}
                    >
                      {part.content}
                    </SyntaxHighlighter>
                  </Box>
                </Box>
              </motion.div>
            );
          }

          return null;
        })}
      </Box>
    </Box>
  );
};

export default Message; 