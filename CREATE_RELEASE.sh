#!/bin/bash

# GitHub Release Creation Script
# This script helps create a GitHub release tag for v1.0.0

set -e

echo "=========================================="
echo "GitHub Release Creation Script"
echo "=========================================="
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Check if git is available
if ! command -v git &> /dev/null; then
    echo -e "${RED}Error: git is not installed${NC}"
    exit 1
fi

# Check if we're in a git repository
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo -e "${RED}Error: Not in a git repository${NC}"
    exit 1
fi

# Check if there are uncommitted changes
if ! git diff-index --quiet HEAD --; then
    echo -e "${YELLOW}⚠ Warning: You have uncommitted changes${NC}"
    echo ""
    echo "You should commit your changes first:"
    echo "  git add ."
    echo "  git commit -m 'Fix linting errors and update README with NPM package'"
    echo ""
    read -p "Continue anyway? (y/n) " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 0
    fi
fi

# Check if tag already exists
if git rev-parse v1.0.0 >/dev/null 2>&1; then
    echo -e "${YELLOW}⚠ Tag v1.0.0 already exists${NC}"
    read -p "Delete and recreate? (y/n) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        git tag -d v1.0.0
        git push origin :refs/tags/v1.0.0 2>/dev/null || true
    else
        exit 0
    fi
fi

# Create the tag
echo -e "${YELLOW}Creating tag v1.0.0...${NC}"
git tag -a v1.0.0 -m "Release v1.0.0: Initial release with NPM package

Features:
- NPM package published: @nikobuddy/duplicate-detector
- React hooks for duplicate PDF detection
- Python web interface and CLI
- Content-based duplicate detection
- Production ready

NPM Package: https://www.npmjs.com/package/@nikobuddy/duplicate-detector"

echo -e "${GREEN}✓ Tag created${NC}"

# Ask to push
echo ""
read -p "Push tag to GitHub? (y/n) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}Pushing tag to GitHub...${NC}"
    git push origin v1.0.0
    echo -e "${GREEN}✓ Tag pushed${NC}"
    echo ""
    echo -e "${GREEN}=========================================="
    echo "✅ Release tag created successfully!"
    echo "==========================================${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Go to: https://github.com/nikobuddy/Ramzi-SanitixPDF/releases/new"
    echo "2. Select tag: v1.0.0"
    echo "3. Title: Release v1.0.0"
    echo "4. Copy content from RELEASE_NOTES.md"
    echo "5. Click 'Publish release'"
    echo ""
else
    echo -e "${YELLOW}Tag created locally. Push manually with:${NC}"
    echo "  git push origin v1.0.0"
fi

