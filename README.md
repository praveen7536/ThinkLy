# Rinku AI Chat App

A modern, fully functional React-based chat application with OpenAI integration, featuring a clean UI, authentication system, and real-time AI conversations.

## 🚀 Features

- **🔐 Secure Authentication**: Login system with hardcoded credentials (admin/password123)
- **💬 Real-time Chat**: Interactive chat interface with OpenAI GPT integration
- **🎨 Modern UI**: Clean, responsive design built with Tailwind CSS
- **📱 Mobile Responsive**: Optimized for all device sizes
- **🔄 Session Persistence**: Login state persists using localStorage
- **⚡ Loading States**: Smooth loading indicators and error handling
- **🛡️ Protected Routes**: React Router protection for authenticated users
- **🌐 Netlify Ready**: Optimized for deployment on Netlify

## 🛠️ Tech Stack

- **React 18** - Modern React with functional components and hooks
- **React Router v6** - Client-side routing and navigation
- **Tailwind CSS** - Utility-first CSS framework for styling
- **Axios** - HTTP client for API requests
- **OpenAI API** - GPT model integration for AI responses
- **LocalStorage** - Session management and persistence

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd rinku-chat-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` and add your OpenAI API key:
   ```env
   REACT_APP_OPENAI_API_KEY=your_openai_api_key_here
   REACT_APP_OPENAI_MODEL=gpt-3.5-turbo
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## 🔑 Authentication

The app uses hardcoded credentials for demo purposes:

- **Username**: `admin`
- **Password**: `password123`

⚠️ **Note**: In a production environment, you should implement proper authentication with a backend server.

## 🌐 OpenAI API Setup

1. **Get an API Key**: Visit [OpenAI Platform](https://platform.openai.com/api-keys) to create an account and get your API key.

2. **Configure Environment**: Add your API key to the `.env` file:
   ```env
   REACT_APP_OPENAI_API_KEY=sk-your-actual-api-key-here
   ```

3. **Optional**: Customize the model by changing `REACT_APP_OPENAI_MODEL` in your `.env` file.

## 🚀 Deployment to Netlify

### Option 1: Deploy via Netlify UI

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy to Netlify**
   - Go to [Netlify](https://netlify.com)
   - Drag and drop the `build` folder to deploy
   - Or connect your GitHub repository for automatic deployments

3. **Set Environment Variables**
   - In your Netlify dashboard, go to Site Settings > Environment Variables
   - Add `REACT_APP_OPENAI_API_KEY` with your OpenAI API key
   - Optionally add `REACT_APP_OPENAI_MODEL` if you want to customize the model

### Option 2: Deploy via Git

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Connect to Netlify**
   - Connect your GitHub repository to Netlify
   - Set build command: `npm run build`
   - Set publish directory: `build`
   - Add environment variables in Netlify dashboard

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── Chat.js         # Main chat interface
│   ├── Login.js        # Authentication screen
│   ├── Message.js      # Individual message component
│   └── LoadingSpinner.js # Loading indicator
├── contexts/           # React contexts
│   └── AuthContext.js  # Authentication state management
├── services/           # API services
│   └── openaiService.js # OpenAI API integration
├── App.js             # Main app component with routing
├── index.js           # App entry point
└── index.css          # Global styles and Tailwind imports
```

## 🎨 Customization

### Styling
The app uses Tailwind CSS for styling. You can customize the design by:
- Modifying `tailwind.config.js` for theme customization
- Updating component classes in the JSX files
- Adding custom CSS in `src/index.css`

### OpenAI Configuration
- Change the model in `.env` file
- Modify API parameters in `src/services/openaiService.js`
- Customize the system prompt for different AI personalities

## 🔧 Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run test suite
- `npm run eject` - Eject from Create React App (irreversible)

## 🐛 Troubleshooting

### Common Issues

1. **API Key Not Working**
   - Ensure your OpenAI API key is valid and has sufficient credits
   - Check that the environment variable is set correctly
   - Verify the API key format starts with `sk-`

2. **Build Errors**
   - Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`
   - Check for syntax errors in your code
   - Ensure all environment variables are properly set

3. **Netlify Deployment Issues**
   - Verify environment variables are set in Netlify dashboard
   - Check build logs for any errors
   - Ensure the build command and publish directory are correct

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

If you encounter any issues or have questions, please open an issue on the repository. 