#!/bin/bash

# RIVE Learning App - Complete Setup Script
# Run this script to set up the entire project

echo "🚀 Starting RIVE Learning App Setup..."
echo ""

# Step 1: Install dependencies
echo "📦 Step 1: Installing dependencies..."
npm install
echo "✅ Dependencies installed"
echo ""

# Step 2: Install Expo Dev Client (REQUIRED for RIVE)
echo "📱 Step 2: Installing Expo Dev Client..."
npx expo install expo-dev-client
echo "✅ Expo Dev Client installed"
echo ""

# Step 3: Install RIVE React Native
echo "🎨 Step 3: Installing RIVE React Native..."
npm i rive-react-native
echo "✅ RIVE React Native installed"
echo ""

# Step 4: Check for RIVE file
echo "🔍 Step 4: Checking for RIVE animation file..."
if [ -f "./assets/buddy.riv" ]; then
    echo "✅ buddy.riv found!"
else
    echo "⚠️  WARNING: buddy.riv not found in assets folder"
    echo "   Please add your RIVE file at: ./assets/buddy.riv"
    echo "   See assets/README.md for RIVE file requirements"
fi
echo ""

# Step 5: Prebuild
echo "🔨 Step 5: Prebuilding native projects..."
echo "   This will generate Android and iOS native folders"
npx expo prebuild
echo "✅ Prebuild complete"
echo ""

echo "✨ Setup Complete!"
echo ""
echo "📋 Next Steps:"
echo ""
echo "For Android:"
echo "  npx expo run:android"
echo ""
echo "For iOS:"
echo "  npx expo run:ios"
echo ""
echo "Or start dev client:"
echo "  npx expo start --dev-client"
echo ""
echo "⚠️  IMPORTANT: Do NOT use 'expo start' alone - you MUST use dev client!"
echo "   RIVE animations will NOT work with Expo Go"
echo ""
echo "📖 For more info, see README.md"
