#!/bin/bash

# Get the latest changes from development branch
git pull origin development

# Check if Vercel CLI is installed globally
if ! command -v vercel &> /dev/null; then
    echo "Installing Vercel CLI..."
    npm install -g vercel
fi

# Deploy to Vercel
echo "Deploying to Vercel..."
vercel --prod

# Check deployment status
if [ $? -eq 0 ]; then
    echo "✅ Deployment successful!"
else
    echo "❌ Deployment failed. Please check the logs above."
fi
