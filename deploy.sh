#!/bin/bash

# Thinkly AI Deployment Script
echo "🚀 Starting Thinkly AI deployment..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the project
echo "🔨 Building the project..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo "📁 Build files created in the 'build' directory"
    echo ""
    echo "🎯 Next steps:"
    echo "1. Push your code to GitHub/GitLab/Bitbucket"
    echo "2. Go to https://netlify.com"
    echo "3. Click 'New site from Git'"
    echo "4. Connect your repository"
    echo "5. Set build command: npm run build"
    echo "6. Set publish directory: build"
    echo "7. Add your API keys in Environment Variables:"
    echo "   - REACT_APP_OPENAI_API_KEY"
    echo "   - REACT_APP_GEMINI_API_KEY"
    echo ""
    echo "📖 See DEPLOYMENT.md for detailed instructions"
else
    echo "❌ Build failed! Please check the error messages above."
    exit 1
fi 