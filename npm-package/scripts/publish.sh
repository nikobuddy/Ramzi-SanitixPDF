#!/bin/bash

# NPM Package Publishing Script with 2FA Support
# This script helps you publish @nikobuddy/duplicate-detector to NPM

set -e

echo "=========================================="
echo "NPM Package Publishing Script"
echo "=========================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo -e "${RED}Error: npm is not installed${NC}"
    exit 1
fi

# Check if logged in
echo "Step 1: Checking NPM login status..."
if npm whoami &> /dev/null; then
    USER=$(npm whoami)
    echo -e "${GREEN}✓ Logged in as: $USER${NC}"
else
    echo -e "${YELLOW}⚠ Not logged in${NC}"
    echo ""
    echo "Please login to NPM:"
    echo "  npm login"
    echo ""
    echo "If you haven't enabled 2FA yet, you'll need to:"
    echo "  1. Visit: https://www.npmjs.com/settings/YOUR_USERNAME/security"
    echo "  2. Enable 2FA"
    echo "  3. Then run: npm login"
    echo ""
    read -p "Press ENTER after logging in, or Ctrl+C to cancel..."
    
    if ! npm whoami &> /dev/null; then
        echo -e "${RED}Error: Still not logged in. Please login first.${NC}"
        exit 1
    fi
fi

# Fix package.json
echo ""
echo "Step 2: Verifying package.json..."
npm pkg fix
echo -e "${GREEN}✓ package.json verified${NC}"

# Build package
echo ""
echo "Step 3: Building package..."
npm run build
echo -e "${GREEN}✓ Build successful!${NC}"

# Check if package name is available (optional)
echo ""
echo "Step 4: Checking package availability..."
PACKAGE_NAME="@nikobuddy/duplicate-detector"
if npm view "$PACKAGE_NAME" version &> /dev/null; then
    CURRENT_VERSION=$(npm view "$PACKAGE_NAME" version)
    LOCAL_VERSION=$(node -p "require('./package.json').version")
    echo -e "${YELLOW}⚠ Package already exists on NPM${NC}"
    echo "  Current NPM version: $CURRENT_VERSION"
    echo "  Local version: $LOCAL_VERSION"
    
    if [ "$CURRENT_VERSION" == "$LOCAL_VERSION" ]; then
        echo -e "${RED}Error: Version $LOCAL_VERSION already published!${NC}"
        echo "Please update version in package.json before publishing."
        exit 1
    fi
else
    echo -e "${GREEN}✓ Package name is available${NC}"
fi

# Dry run
echo ""
echo "Step 5: Running dry-run (preview what will be published)..."
npm publish --dry-run --access public
echo ""
read -p "Do you want to publish to NPM? (y/n) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Publishing cancelled."
    exit 0
fi

# Publish
echo ""
echo "Step 6: Publishing to NPM..."
echo -e "${YELLOW}Note: You may be prompted for 2FA OTP${NC}"
npm publish --access public

echo ""
echo -e "${GREEN}=========================================="
echo "✓ Package published successfully!"
echo "==========================================${NC}"
echo ""
echo "Package URL: https://www.npmjs.com/package/$PACKAGE_NAME"
echo ""
echo "To install:"
echo "  npm install $PACKAGE_NAME"
echo ""

