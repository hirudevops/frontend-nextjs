#!/bin/bash

# Configuration
TARGET_DIR="./src"
PROCESS_NAME="next-server"

echo "👀 Monitoring changes in $TARGET_DIR..."

# inotifywait diye file change track kora
# Script-er bhitore ei line-ta eibhabe thik koro:
inotifywait -m -r --exclude 'node_modules|.next' -e modify,create,delete "$TARGET_DIR" --format '%w%f' | while read FILE
do
    echo "------------------------------------------"
    echo "⚡ Change detected in: $FILE"
    echo "🏗️  Starting build process..."

    # ১. Build shuru koro
    npm run build

    # ২. Build successful holei kebol process refresh hobe
    if [ $? -eq 0 ]; then
        echo "✅ Build successful! Refreshing PM2 process..."
        
        # ৩. Purano process thakle sheta purapuri kill/delete koro
        pm2 delete "$PROCESS_NAME" 2>/dev/null
        
        # ৪. Notun kore start koro
        pm2 start npm --name "$PROCESS_NAME" -- start
        
        # ৫. PM2 list save koro jeno reboot-e auto-start hoy
        pm2 save
        
        echo "🚀 $PROCESS_NAME is now fresh and running!"
    else
        echo "❌ Build failed! Please check errors. Process kill/start skipped."
    fi
    echo "------------------------------------------"
done
