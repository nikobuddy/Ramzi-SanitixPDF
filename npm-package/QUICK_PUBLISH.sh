#!/bin/bash

# Quick Publish Script for @nikobuddy/duplicate-detector
# This script automates the publishing process

set -e  # Exit on error

echo "=========================================="
echo "NPM Package Publishing Script"
echo "=========================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}Error: package.json not found. Please run this script from the npm-package directory.${NC}"
    exit 1
fi

# Step 1: Install dependencies
echo -e "${YELLOW}Step 1: Installing dependencies...${NC}"
npm install

# Step 2: Build package
echo -e "${YELLOW}Step 2: Building package...${NC}"
npm run build

# Step 3: Check if build was successful
if [ ! -d "lib" ] || [ ! -f "lib/index.js" ]; then
    echo -e "${RED}Error: Build failed. lib/ directory or index.js not found.${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Build successful!${NC}"

# Step 4: Check if logged in
echo -e "${YELLOW}Step 3: Checking NPM login status...${NC}"
if ! npm whoami &> /dev/null; then
    echo -e "${YELLOW}Not logged in. Please login to NPM:${NC}"
    echo ""
    echo -e "${RED}⚠ IMPORTANT: NPM requires 2FA for publishing!${NC}"
    echo ""
    echo "If you haven't enabled 2FA yet:"
    echo "  1. Visit: https://www.npmjs.com/settings/YOUR_USERNAME/security"
    echo "  2. Enable 2FA (use Authenticator App)"
    echo "  3. Then run: npm login"
    echo ""
    echo "When you run 'npm login', you'll be asked for:"
    echo "  - Username"
    echo "  - Password"
    echo "  - One-Time Password (OTP) from your authenticator app"
    echo "  - Email"
    echo ""
    npm login
else
    echo -e "${GREEN}✓ Logged in as: $(npm whoami)${NC}"
fi

# Step 5: Dry run
echo -e "${YELLOW}Step 4: Running dry-run (preview what will be published)...${NC}"
npm publish --dry-run --access public

# Step 6: Confirm before publishing
echo ""
read -p "Do you want to publish to NPM? (y/n) " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}Publishing cancelled.${NC}"
    exit 0
fi

# Step 7: Publish
echo -e "${YELLOW}Step 5: Publishing to NPM...${NC}"
echo -e "${YELLOW}Note: You may be prompted for 2FA OTP during publish${NC}"
npm publish --access public

echo ""
echo -e "${GREEN}=========================================="
echo "✅ Package published successfully!"
echo "==========================================${NC}"
echo ""
echo "Package URL: https://www.npmjs.com/package/@nikobuddy/duplicate-detector"
echo ""
echo "Users can now install with:"
echo "  npm install @nikobuddy/duplicate-detector"
echo ""

