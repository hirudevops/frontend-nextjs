#!/bin/bash

# Configuration
PROCESS_NAME="next-server"

echo "🚀 Starting Manual Deployment Process..."
echo "------------------------------------------"

# 1. Lockfile-er dependency install koro
echo "📦 Step 1: Installing locked dependencies (npm ci)..."
npm ci

if [ $? -ne 0 ]; then
    echo "------------------------------------------"
    echo "❌ ERROR: Dependency installation failed. Deployment aborted."
    exit 1
fi

# 2. Build shuru koro
echo "🏗️  Step 2: Building the project (npm run build)..."
npm run build

# 2. Build successful holei kebol process refresh hobe
if [ $? -eq 0 ]; then
    echo "✅ Build successful! Refreshing PM2 process..."

    # ৪. Purano process thakle sheta purapuri kill/delete koro
    echo "🗑️  Step 3: Removing old process..."
    pm2 delete "$PROCESS_NAME" 2>/dev/null

    # ৫. Notun kore start koro
    echo "🚀 Step 4: Starting new process..."
    pm2 start npm --name "$PROCESS_NAME" -- start

    # ৬. PM2 list save koro jeno reboot-e auto-start hoy
    echo "💾 Step 5: Saving PM2 state..."
    pm2 save

    echo "------------------------------------------"
    echo "🎉 SUCCESS: $PROCESS_NAME is now fresh and running!"
else
    echo "------------------------------------------"
    echo "❌ ERROR: Build failed! Deployment aborted."
    exit 1
fi
