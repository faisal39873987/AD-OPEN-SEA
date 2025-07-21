#!/bin/bash

# AD PLUS Assistant Setup Script

echo "🚀 Setting up AD PLUS Assistant..."

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the project
echo "🔨 Building the project..."
npm run build

# Start the development server
echo "🌟 Starting development server..."
npm run dev

echo "✅ Setup complete! Visit http://localhost:3000 to see your AD PLUS Assistant"
