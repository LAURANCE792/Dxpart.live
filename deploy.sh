#!/bin/bash

# DXPart.live - Production Deployment Script
# This script automates the deployment process

set -e

echo "🚀 DXPart.live Production Deployment"
echo "====================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed${NC}"
    echo "Install from: https://nodejs.org"
    exit 1
fi

echo -e "${GREEN}✅ Node.js detected: $(node --version)${NC}"

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo -e "${YELLOW}📦 Installing Vercel CLI...${NC}"
    npm install -g vercel
fi

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo -e "${YELLOW}📦 Installing Railway CLI...${NC}"
    npm install -g @railway/cli
fi

echo ""
echo -e "${YELLOW}Step 1: Install Dependencies${NC}"
echo "Installing backend dependencies..."
cd backend
npm install
cd ..

echo "Installing frontend dependencies..."
cd frontend
npm install
cd ..

echo -e "${GREEN}✅ Dependencies installed${NC}"
echo ""

echo -e "${YELLOW}Step 2: Build Frontend${NC}"
cd frontend
npm run build
cd ..
echo -e "${GREEN}✅ Frontend built${NC}"
echo ""

echo -e "${YELLOW}Step 3: Build Backend${NC}"
cd backend
npm run build
cd ..
echo -e "${GREEN}✅ Backend built${NC}"
echo ""

echo -e "${YELLOW}Step 4: Push to GitHub${NC}"
read -p "Have you committed changes? (y/n) " -n 1 -r
echo 
if [[ $REPLY =~ ^[Yy]$ ]]; then
    git push origin develop
    echo -e "${GREEN}✅ Pushed to GitHub${NC}"
else
    echo "Please commit and push changes manually"
fi
echo ""

echo -e "${YELLOW}Step 5: Deploy Frontend to Vercel${NC}"
echo "Deploying frontend..."
cd frontend
vercel --prod
cd ..
echo -e "${GREEN}✅ Frontend deployed to Vercel${NC}"
echo ""

echo -e "${YELLOW}Step 6: Deploy Backend to Railway${NC}"
echo "1. Go to https://railway.app"
echo "2. Create new project from GitHub"
echo "3. Connect your repository"
echo "4. Set environment variables from .env"
echo "5. Deploy"
read -p "Press Enter once backend is deployed on Railway..."
echo ""

echo -e "${YELLOW}Step 7: Configure Domain${NC}"
echo "1. Go to https://namecheap.com"
echo "2. Buy your domain (e.g., dxpart.live)"
echo "3. Add Vercel nameservers:"
echo "   - ns1.vercel-dns.com"
echo "   - ns2.vercel-dns.com"
echo "   - ns3.vercel-dns.com"
read -p "Press Enter once domain is configured..."
echo ""

echo -e "${GREEN}✅ Deployment Complete!${NC}"
echo ""
echo "Your platform is now live!"
echo ""
echo "Next steps:"
echo "1. Visit your domain in browser"
echo "2. Test sign up and login"
echo "3. Create a bot"
echo "4. Monitor trading activity"
echo ""
echo "For more info, see PUBLIC_DEPLOYMENT_GUIDE.md"
echo ""
