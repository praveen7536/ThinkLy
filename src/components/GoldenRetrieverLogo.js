import React from 'react';
import { motion } from 'framer-motion';
import { Box } from '@mui/material';

const GoldenRetrieverLogo = ({ size = 40, isDarkMode = false }) => {
  const logoVariants = {
    idle: {
      rotate: [0, -2, 2, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    },
    hover: {
      scale: 1.1,
      rotate: [0, -5, 5, 0],
      transition: {
        duration: 0.6,
        ease: "easeInOut"
      }
    },
    tap: {
      scale: 0.95,
      transition: {
        duration: 0.1
      }
    }
  };

  const tailVariants = {
    wag: {
      rotate: [-10, 10, -10],
      transition: {
        duration: 0.8,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const earVariants = {
    wiggle: {
      rotate: [0, -3, 3, 0],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <motion.div
      variants={logoVariants}
      initial="idle"
      whileHover="hover"
      whileTap="tap"
      style={{
        width: size,
        height: size,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <Box
        component="svg"
        viewBox="0 0 100 100"
        sx={{
          width: '100%',
          height: '100%',
          filter: isDarkMode ? 'drop-shadow(0 4px 8px rgba(102, 126, 234, 0.3))' : 'drop-shadow(0 4px 8px rgba(102, 126, 234, 0.2))'
        }}
      >
        {/* Background circle with gradient */}
        <defs>
          <radialGradient id="goldenGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#667eea" />
            <stop offset="50%" stopColor="#764ba2" />
            <stop offset="100%" stopColor="#5a3a7a" />
          </radialGradient>
          <radialGradient id="goldenGradientDark" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#667eea" />
            <stop offset="50%" stopColor="#8b9df0" />
            <stop offset="100%" stopColor="#764ba2" />
          </radialGradient>
        </defs>

        {/* Background circle */}
        <circle
          cx="50"
          cy="50"
          r="45"
          fill={isDarkMode ? "url(#goldenGradientDark)" : "url(#goldenGradient)"}
          stroke={isDarkMode ? "#667eea" : "#5a3a7a"}
          strokeWidth="2"
        />

        {/* Golden Retriever Face */}
        <g transform="translate(50, 50)">
          {/* Main head shape */}
          <ellipse
            cx="0"
            cy="0"
            rx="25"
            ry="20"
            fill="#667eea"
            stroke="#4a5fd8"
            strokeWidth="1"
          />

          {/* Snout */}
          <ellipse
            cx="0"
            cy="8"
            rx="12"
            ry="8"
            fill="#8b9df0"
            stroke="#4a5fd8"
            strokeWidth="1"
          />

          {/* Nose */}
          <ellipse
            cx="0"
            cy="12"
            rx="2"
            ry="1.5"
            fill="#2C2C2C"
          />

          {/* Eyes */}
          <circle
            cx="-8"
            cy="-5"
            r="3"
            fill="#2C2C2C"
          />
          <circle
            cx="8"
            cy="-5"
            r="3"
            fill="#2C2C2C"
          />
          
          {/* Eye highlights */}
          <circle
            cx="-7"
            cy="-6"
            r="1"
            fill="#FFFFFF"
          />
          <circle
            cx="9"
            cy="-6"
            r="1"
            fill="#FFFFFF"
          />

          {/* Ears */}
          <motion.g variants={earVariants} animate="wiggle">
            {/* Left ear */}
            <ellipse
              cx="-18"
              cy="-15"
              rx="6"
              ry="8"
              fill="#764ba2"
              stroke="#4a5fd8"
              strokeWidth="1"
              transform="rotate(-20)"
            />
            {/* Right ear */}
            <ellipse
              cx="18"
              cy="-15"
              rx="6"
              ry="8"
              fill="#764ba2"
              stroke="#4a5fd8"
              strokeWidth="1"
              transform="rotate(20)"
            />
          </motion.g>

          {/* Mouth */}
          <path
            d="M -5 5 Q 0 8 5 5"
            stroke="#2C2C2C"
            strokeWidth="1"
            fill="none"
            strokeLinecap="round"
          />

          {/* Tongue */}
          <ellipse
            cx="0"
            cy="8"
            rx="3"
            ry="2"
            fill="#FF6B6B"
            opacity="0.8"
          />

          {/* Cheeks */}
          <circle
            cx="-15"
            cy="0"
            r="4"
            fill="#FFB347"
            opacity="0.6"
          />
          <circle
            cx="15"
            cy="0"
            r="4"
            fill="#FFB347"
            opacity="0.6"
          />
        </g>

        {/* Tail */}
        <motion.g
          variants={tailVariants}
          animate="wag"
          transform="translate(75, 60)"
        >
          <path
            d="M 0 0 Q 10 -10 15 -5 Q 20 0 15 5 Q 10 10 0 0"
            fill="#FFD700"
            stroke="#DAA520"
            strokeWidth="1"
          />
        </motion.g>

        {/* Paws */}
        <g transform="translate(35, 75)">
          <circle cx="0" cy="0" r="3" fill="#FFE4B5" stroke="#DAA520" strokeWidth="1" />
          <circle cx="6" cy="0" r="3" fill="#FFE4B5" stroke="#DAA520" strokeWidth="1" />
          <circle cx="12" cy="0" r="3" fill="#FFE4B5" stroke="#DAA520" strokeWidth="1" />
        </g>
        <g transform="translate(65, 75)">
          <circle cx="0" cy="0" r="3" fill="#FFE4B5" stroke="#DAA520" strokeWidth="1" />
          <circle cx="6" cy="0" r="3" fill="#FFE4B5" stroke="#DAA520" strokeWidth="1" />
          <circle cx="12" cy="0" r="3" fill="#FFE4B5" stroke="#DAA520" strokeWidth="1" />
        </g>

        {/* Sparkle effect */}
        <motion.g
          animate={{
            opacity: [0.3, 1, 0.3],
            scale: [0.8, 1.2, 0.8]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <circle cx="20" cy="20" r="1" fill="#FFFFFF" />
          <circle cx="80" cy="25" r="1" fill="#FFFFFF" />
          <circle cx="15" cy="80" r="1" fill="#FFFFFF" />
          <circle cx="85" cy="75" r="1" fill="#FFFFFF" />
        </motion.g>
      </Box>
    </motion.div>
  );
};

export default GoldenRetrieverLogo; 