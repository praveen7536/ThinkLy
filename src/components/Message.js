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
  const isError = message.role === 'error';

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
              <Typography
                key={index}
                component="span"
                sx={{
                  fontSize: 'inherit',
                  lineHeight: 1.6,
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word'
                }}
              >
                {part.content}
              </Typography>
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