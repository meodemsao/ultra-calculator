#!/bin/bash

# ===================================================
# Calculator Ultra - Cloudflare Pages Deploy Script
# ===================================================
# Using wrangler v4.x+ with best practices

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_NAME="calculator-ultra"
BUILD_DIR="dist"
BRANCH="${1:-main}"

echo -e "${BLUE}╔════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║     Calculator Ultra - Cloudflare Deploy       ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════╝${NC}"
echo ""

# Check wrangler version
echo -e "${BLUE}📦 Checking wrangler version...${NC}"
WRANGLER_VERSION=$(npx wrangler --version 2>/dev/null | head -1)
echo -e "   ${GREEN}$WRANGLER_VERSION${NC}"
echo ""

# Check if logged in to Cloudflare
echo -e "${BLUE}🔐 Checking Cloudflare authentication...${NC}"
if ! npx wrangler whoami &> /dev/null; then
    echo -e "${YELLOW}⚠️  Not logged in to Cloudflare. Please login:${NC}"
    npx wrangler login
fi
echo -e "${GREEN}✅ Authenticated!${NC}"
echo ""

# Run tests
echo -e "${BLUE}🧪 Running tests...${NC}"
npm test -- --run
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Tests failed! Aborting deployment.${NC}"
    exit 1
fi
echo -e "${GREEN}✅ All tests passed!${NC}"
echo ""

# Build the project
echo -e "${BLUE}🔨 Building project...${NC}"
npm run build
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Build failed! Aborting deployment.${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Build successful!${NC}"
echo ""

# Check if dist folder exists
if [ ! -d "$BUILD_DIR" ]; then
    echo -e "${RED}❌ Build directory '$BUILD_DIR' not found!${NC}"
    exit 1
fi

# Deploy to Cloudflare Pages
echo -e "${BLUE}🚀 Deploying to Cloudflare Pages...${NC}"
echo ""

# Deploy using wrangler
npx wrangler pages deploy "$BUILD_DIR" --project-name "$PROJECT_NAME" --branch "$BRANCH"

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}╔════════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║         🎉 Deployment Successful! 🎉           ║${NC}"
    echo -e "${GREEN}╚════════════════════════════════════════════════╝${NC}"
    echo ""
    echo -e "${BLUE}Your app is live at:${NC}"
    echo -e "${GREEN}  https://$PROJECT_NAME.pages.dev${NC}"
    echo ""
    if [ "$BRANCH" != "main" ]; then
        echo -e "${BLUE}Preview URL:${NC}"
        echo -e "${GREEN}  https://$BRANCH.$PROJECT_NAME.pages.dev${NC}"
        echo ""
    fi
else
    echo -e "${RED}❌ Deployment failed!${NC}"
    exit 1
fi
