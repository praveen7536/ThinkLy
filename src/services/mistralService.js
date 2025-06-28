const MISTRAL_API_KEY = 'nrQwamq6T5y7LyCHVhn7ao7f8bvTzHWg';
const MISTRAL_API_URL = 'https://api.mistral.ai/v1/chat/completions';

export const sendMessageToMistral = async (message, conversationHistory = []) => {
  try {
    const messages = [
      ...conversationHistory.map(msg => ({
        role: msg.role,
        content: msg.content
      })),
      {
        role: 'user',
        content: message
      }
    ];

    const response = await fetch(MISTRAL_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${MISTRAL_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'mistral-large-latest',
        messages: messages,
        max_tokens: 1000,
        temperature: 0.7,
        stream: false
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error?.message || 
        `Mistral API error: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error('Invalid response format from Mistral API');
    }

    return {
      success: true,
      message: data.choices[0].message.content,
      usage: data.usage || null
    };
  } catch (error) {
    console.error('Mistral API Error:', error);
    throw new Error(`Mistral API Error: ${error.message}`);
  }
};

export const getMistralModels = () => {
  return [
    {
      id: 'mistral-large-latest',
      name: 'Mistral Large',
      description: 'Most capable model for complex reasoning',
      maxTokens: 32768
    },
    {
      id: 'mistral-medium-latest',
      name: 'Mistral Medium',
      description: 'Balanced performance and speed',
      maxTokens: 32768
    },
    {
      id: 'mistral-small-latest',
      name: 'Mistral Small',
      description: 'Fast and efficient for simple tasks',
      maxTokens: 32768
    }
  ];
}; 