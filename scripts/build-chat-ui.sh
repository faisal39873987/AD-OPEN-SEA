#!/bin/bash

# Build script for the new AD PLUS Assistant UI
echo "🔨 Building AD PLUS Assistant with new chat-based UI..."

# Install dependencies if needed
if [ "$1" == "--install" ]; then
  echo "📦 Installing dependencies..."
  npm install
fi

# Run optimizations and build
echo "🖼️ Optimizing images..."
npm run optimize-images

echo "🏗️ Building production version..."
npm run build

echo "✅ Build complete! The new AD PLUS Assistant chat UI is ready."
echo "🚀 To start the application, run: npm start"
