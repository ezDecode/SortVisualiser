# Deployment Guide

This guide will help you deploy the Sorting Algorithm Visualizer to GitHub and a hosting platform like Heroku.

## Deploying to GitHub

1. Create a new repository on GitHub
2. Initialize the local repository and push your code:

```bash
# Make sure you're in the project directory
cd c:/Users/Admin/Desktop/SortVisualiser

# Add all files to git
git add .

# Commit the changes
git commit -m "Initial commit"

# Add your GitHub repository as a remote
git remote add origin https://github.com/yourusername/sorting-visualizer.git

# Push to GitHub
git push -u origin main
```

## Deploying to Heroku

1. Create a Heroku account if you don't have one: https://signup.heroku.com/

2. Install the Heroku CLI: https://devcenter.heroku.com/articles/heroku-cli

3. Login to Heroku from the command line:

```bash
heroku login
```

4. Create a new Heroku app:

```bash
heroku create your-app-name
```

5. Push your code to Heroku:

```bash
git push heroku main
```

6. Open your deployed app:

```bash
heroku open
```

## Deploying to Render

Render is another excellent platform for hosting Node.js applications:

1. Create a Render account: https://render.com/

2. Create a new Web Service

   - Connect your GitHub repository
   - Select the branch to deploy
   - Set the build command: `npm install`
   - Set the start command: `node server/server.js`
   - Choose an appropriate plan (Free tier is available)

3. Click "Create Web Service"

## Deploying to Railway

Railway is a modern platform that makes deployment simple:

1. Create a Railway account: https://railway.app/

2. Create a new project

   - Connect your GitHub repository
   - Railway will automatically detect your Node.js app
   - Set the start command if needed: `node server/server.js`

3. Your app will be deployed automatically

## Environment Variables

If you need to set environment variables for production:

- On Heroku:

```bash
heroku config:set KEY=value
```

- On Render and Railway:
  - Use their web interface to add environment variables

## Custom Domain

All these platforms support custom domains. Follow their specific documentation to set up your domain:

- [Heroku Custom Domains](https://devcenter.heroku.com/articles/custom-domains)
- [Render Custom Domains](https://render.com/docs/custom-domains)
- [Railway Custom Domains](https://docs.railway.app/deploy/exposing-your-app#adding-a-custom-domain)
