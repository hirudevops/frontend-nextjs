#!/bin/bash

# Configuration
PROCESS_NAME="next-server"

echo "🚀 Starting Manual Deployment Process..."
echo "------------------------------------------"

# ১. Build shuru koro
echo "🏗️  Step 1: Building the project (npm run build)..."
npm run build

# ২. Build successful holei kebol process refresh hobe
if [ $? -eq 0 ]; then
    echo "✅ Build successful! Refreshing PM2 process..."

    # ৩. Purano process thakle sheta purapuri kill/delete koro
    echo "🗑️  Step 2: Removing old process..."
    pm2 delete "$PROCESS_NAME" 2>/dev/null

    # ৪. Notun kore start koro
    echo "🚀 Step 3: Starting new process..."
    pm2 start npm --name "$PROCESS_NAME" -- start

    # ৫. PM2 list save koro jeno reboot-e auto-start hoy
    echo "💾 Step 4: Saving PM2 state..."
    pm2 save

    echo "------------------------------------------"
    echo "🎉 SUCCESS: $PROCESS_NAME is now fresh and running!"
else
    echo "------------------------------------------"
    echo "❌ ERROR: Build failed! Deployment aborted."
    exit 1
fi
