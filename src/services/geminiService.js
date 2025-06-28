import axios from 'axios';

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

// Rate limiting - track last request time
let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 1000; // 1 second between requests

// Get API key from environment variables
const getApiKey = () => {
  const apiKey = process.env.REACT_APP_GEMINI_API_KEY || 'AIzaSyDys3TibsASIWfgNaaGcYIbWvxkTKMrqfM';
  
  if (!apiKey) {
    throw new Error('Gemini API key not found. Please set REACT_APP_GEMINI_API_KEY in your .env file.');
  }
  return apiKey;
};

// Rate limiting function
const waitForRateLimit = async () => {
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;
  
  if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
    const waitTime = MIN_REQUEST_INTERVAL - timeSinceLastRequest;
    console.log(`Rate limiting: waiting ${waitTime}ms before next request`);
    await new Promise(resolve => setTimeout(resolve, waitTime));
  }
  
  lastRequestTime = Date.now();
};

export const sendMessage = async (message, conversationHistory = []) => {
  try {
    console.log('Starting sendMessage function with Gemini...');
    
    // Apply rate limiting
    await waitForRateLimit();
    
    const apiKey = getApiKey();
    
    console.log('Message:', message);
    console.log('Conversation history length:', conversationHistory.length);

    // Prepare conversation history for Gemini API
    const contents = [];
    
    // Add conversation history
    conversationHistory.forEach(msg => {
      contents.push({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }]
      });
    });
    
    // Add current message
    contents.push({
      role: 'user',
      parts: [{ text: message }]
    });

    const requestBody = {
      contents: contents,
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1000,
      },
      safetySettings: [
        {
          category: "HARM_CATEGORY_HARASSMENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_HATE_SPEECH",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_DANGEROUS_CONTENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        }
      ]
    };

    console.log('Sending request to Gemini with payload:', requestBody);

    const response = await axios.post(
      `${GEMINI_API_URL}?key=${apiKey}`,
      requestBody,
      {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 30000 // 30 second timeout
      }
    );

    console.log('Gemini response received:', response.data);

    if (response.data && response.data.candidates && response.data.candidates[0] && response.data.candidates[0].content) {
      const generatedText = response.data.candidates[0].content.parts[0].text;
      return {
        success: true,
        message: generatedText,
        usage: { 
          total_tokens: response.data.usageMetadata?.totalTokenCount || generatedText.length 
        }
      };
    } else {
      throw new Error('Invalid response format from Gemini API');
    }

  } catch (error) {
    console.error('Gemini API Error Details:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      statusText: error.response?.statusText
    });
    
    if (error.response) {
      // Server responded with error status
      const status = error.response.status;
      const data = error.response.data;
      
      console.error('Error response data:', data);
      
      switch (status) {
        case 400:
          throw new Error('Invalid request to Gemini API. Please check your input.');
        case 401:
          throw new Error('Invalid API key. Please check your Gemini API key.');
        case 429:
          throw new Error('Rate limit exceeded. Please wait a moment and try again.');
        case 500:
          throw new Error('Gemini server error. Please try again later.');
        default:
          throw new Error(data?.error?.message || `API Error (${status}): ${data?.error?.code || 'Unknown error'}`);
      }
    } else if (error.request) {
      // Network error
      console.error('Network error details:', error.request);
      throw new Error('Network error. Please check your internet connection.');
    } else {
      // Other errors
      console.error('Other error:', error);
      throw error;
    }
  }
};

export const validateApiKey = async () => {
  try {
    console.log('Starting Gemini API key validation...');
    
    // Apply rate limiting
    await waitForRateLimit();
    
    const apiKey = getApiKey();
    
    console.log('Making validation request to Gemini...');
    
    // Make a simple test call to validate the API key
    const response = await axios.post(
      `${GEMINI_API_URL}?key=${apiKey}`,
      {
        contents: [{
          role: 'user',
          parts: [{ text: 'Hello' }]
        }],
        generationConfig: {
          maxOutputTokens: 5
        }
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log('Gemini API key validation successful:', response.data);
    return { valid: true };
  } catch (error) {
    console.error('Gemini API key validation failed:', error.response?.data || error.message);
    
    if (error.response && error.response.status === 401) {
      return { valid: false, error: 'Invalid API key' };
    } else if (error.response && error.response.status === 429) {
      return { valid: false, error: 'Rate limit exceeded. Please wait a moment and try again.' };
    }
    
    return { valid: false, error: 'Unable to validate API key' };
  }
}; 