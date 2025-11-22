# Deploying Melvin's World to Vercel

This guide will walk you through deploying your app to Vercel and securing your API key.

## Prerequisites

- A GitHub account with your repository
- A Vercel account (free tier works great)
- Your OpenAI API key

## Step 1: Push Your Code to GitHub

If you haven't already, make sure your code is pushed to GitHub:

```bash
git add .
git commit -m "Secure API implementation"
git push origin main
```

## Step 2: Deploy to Vercel

### Option A: Via Vercel Dashboard (Recommended)

1. **Go to Vercel**: Visit [vercel.com](https://vercel.com) and sign in (or create an account)

2. **Import Your Project**:
   - Click "Add New..." → "Project"
   - Import your GitHub repository
   - Select the `MelvinsWorld` repository

3. **Configure Project**:
   - **Framework Preset**: Other (or leave as default)
   - **Root Directory**: `./` (root)
   - **Build Command**: Leave empty (static site)
   - **Output Directory**: Leave empty

4. **Add Environment Variable**:
   - In the "Environment Variables" section, click "Add"
   - **Name**: `OPENAI_API_KEY`
   - **Value**: Paste your OpenAI API key (starts with `sk-proj-...`)
   - **Environment**: Select all (Production, Preview, Development)
   - Click "Save"

5. **Deploy**:
   - Click "Deploy"
   - Wait for deployment to complete (usually 1-2 minutes)

6. **Your Site is Live!**:
   - Vercel will provide you with a URL like `melvins-world.vercel.app`
   - You can also add a custom domain if you want

### Option B: Via Vercel CLI

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Login**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   vercel
   ```
   Follow the prompts to link your project.

4. **Set Environment Variable**:
   ```bash
   vercel env add OPENAI_API_KEY
   ```
   Paste your API key when prompted.

5. **Redeploy**:
   ```bash
   vercel --prod
   ```

## Step 3: Verify Security

After deployment, verify that your API key is secure:

1. **Check the deployed site**: Visit your Vercel URL
2. **View Page Source**: Right-click → "View Page Source"
3. **Search for "sk-proj"**: Your API key should NOT appear anywhere
4. **Test the Chat**: Try chatting with Melvin to ensure the API works

## Step 4: Update Environment Variables (if needed)

If you need to update your API key later:

1. Go to your Vercel project dashboard
2. Navigate to "Settings" → "Environment Variables"
3. Edit or add the `OPENAI_API_KEY` variable
4. Redeploy your project

## Security Best Practices ✅

- ✅ **API key is stored server-side** (in Vercel environment variables)
- ✅ **API key is never exposed** in client-side code
- ✅ **All API calls go through** your secure `/api/chat` endpoint
- ✅ **Environment variables are encrypted** by Vercel
- ✅ **`.env` file is in `.gitignore`** (never committed)

## Troubleshooting

### API calls failing?

1. **Check Environment Variable**:
   - Go to Vercel Dashboard → Your Project → Settings → Environment Variables
   - Verify `OPENAI_API_KEY` is set correctly

2. **Check Function Logs**:
   - Go to Vercel Dashboard → Your Project → Functions
   - Click on `/api/chat` to see logs
   - Look for error messages

3. **Test Locally** (optional):
   - Create a `.env` file with `OPENAI_API_KEY=your_key`
   - Run `vercel dev` to test locally

### Build errors?

- Make sure your `api/chat.js` file is in the `api/` folder
- Check that all file paths are correct
- Verify your GitHub repo structure matches your local files

## Next Steps

- **Custom Domain**: Add your own domain in Vercel project settings
- **Analytics**: Enable Vercel Analytics to track usage
- **Monitoring**: Set up alerts for API errors

## Support

If you run into issues:
- Check [Vercel Documentation](https://vercel.com/docs)
- Review your function logs in the Vercel dashboard
- Make sure your OpenAI API key is valid and has credits

---

**Your API is now secure!** 🎉 The key is stored server-side and never exposed to users.

