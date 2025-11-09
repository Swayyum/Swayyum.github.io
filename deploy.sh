#!/bin/bash
# Copyright © 2025 Sam Analytic Solutions
# All rights reserved.

# Automated git deploy script

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}🚀 Starting deployment...${NC}"

# Check if there are changes to commit
if [ -z "$(git status --porcelain)" ]; then
    echo -e "${YELLOW}⚠️  No changes to commit${NC}"
    exit 0
fi

# Get commit message from argument or use default
COMMIT_MSG="${1:-Update portfolio site}"

echo -e "${GREEN}📦 Adding all changes...${NC}"
git add .

echo -e "${GREEN}💾 Committing changes...${NC}"
git commit -m "$COMMIT_MSG"

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Commit failed${NC}"
    exit 1
fi

echo -e "${GREEN}📤 Pushing to GitHub...${NC}"
git push origin main

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Successfully deployed to GitHub!${NC}"
    echo -e "${YELLOW}⏳ Wait 2-3 minutes for GitHub Pages to rebuild${NC}"
else
    echo -e "${RED}❌ Push failed. You may need to pull first:${NC}"
    echo -e "${YELLOW}   git pull --rebase origin main${NC}"
    exit 1
fi

