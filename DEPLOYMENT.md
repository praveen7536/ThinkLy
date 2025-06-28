# Deploy Thinkly AI to Netlify

This guide will help you deploy your Thinkly AI chat application to Netlify.

## Prerequisites

- A GitHub, GitLab, or Bitbucket account
- Your Thinkly AI project ready for deployment
- API keys for the AI services you want to use

## Step 1: Prepare Your Repository

1. **Push your code to GitHub/GitLab/Bitbucket**
   ```bash
   git add .
   git commit -m "Prepare for Netlify deployment"
   git push origin main
   ```

2. **Ensure your repository contains:**
   - `package.json` with build scripts
   - `netlify.toml` configuration file
   - `.gitignore` file
   - All source code in the `src/` directory

## Step 2: Deploy to Netlify

### Option A: Deploy via Netlify UI (Recommended)

1. **Go to [Netlify](https://netlify.com)** and sign up/login
2. **Click "New site from Git"**
3. **Connect your Git provider** (GitHub, GitLab, or Bitbucket)
4. **Select your repository**
5. **Configure build settings:**
   - **Build command:** `npm run build`
   - **Publish directory:** `build`
   - **Node version:** `18` (or your preferred version)
6. **Click "Deploy site"**

### Option B: Deploy via Netlify CLI

1. **Install Netlify CLI:**
   ```bash
   npm install -g netlify-cli
   ```

2. **Login to Netlify:**
   ```bash
   netlify login
   ```

3. **Deploy your site:**
   ```bash
   netlify deploy --prod --dir=build
   ```

## Step 3: Configure Environment Variables

After deployment, you need to add your API keys:

1. **Go to your Netlify dashboard**
2. **Navigate to Site settings > Environment variables**
3. **Add the following variables:**

   ```
   REACT_APP_OPENAI_API_KEY=your_openai_api_key_here
   REACT_APP_GEMINI_API_KEY=your_gemini_api_key_here
   REACT_APP_OPENAI_MODEL=gpt-3.5-turbo
   ```

4. **Trigger a new deployment** by going to the Deploys tab and clicking "Trigger deploy"

## Step 4: Get Your API Keys

### OpenAI API Key
1. Go to [OpenAI Platform](https://platform.openai.com/api-keys)
2. Sign up or log in
3. Click "Create new secret key"
4. Copy the key and add it to Netlify environment variables

### Google Gemini API Key
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the key and add it to Netlify environment variables

## Step 5: Custom Domain (Optional)

1. **Go to Site settings > Domain management**
2. **Click "Add custom domain"**
3. **Follow the DNS configuration instructions**

## Troubleshooting

### Common Issues:

1. **Build fails:**
   - Check that all dependencies are in `package.json`
   - Ensure Node.js version is compatible
   - Check build logs in Netlify dashboard

2. **Routing issues:**
   - The `netlify.toml` file should handle this automatically
   - If issues persist, check that the redirect rule is correct

3. **API calls fail:**
   - Verify environment variables are set correctly
   - Check that API keys are valid
   - Ensure CORS is not blocking requests

4. **Environment variables not working:**
   - Redeploy after adding environment variables
   - Check variable names (must start with `REACT_APP_`)

### Build Optimization:

Your current build size is:
- **JavaScript:** 517.26 kB (gzipped)
- **CSS:** 2.73 kB (gzipped)

To optimize further:
- Consider code splitting
- Optimize images
- Remove unused dependencies

## Security Notes

- **Never commit API keys** to your repository
- **Use environment variables** for all sensitive data
- **Enable HTTPS** (Netlify does this automatically)
- **Consider rate limiting** for API calls

## Support

If you encounter issues:
1. Check the Netlify build logs
2. Verify your environment variables
3. Test locally with `npm run build`
4. Check the Netlify documentation

Your Thinkly AI app should now be live on Netlify! 🚀 