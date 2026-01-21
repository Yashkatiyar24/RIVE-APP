#!/bin/bash

# RIVE Learning App - Setup Verification Script
# This script checks if everything is properly configured

echo "🔍 RIVE Learning App - Setup Verification"
echo "=========================================="
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check counters
PASSED=0
FAILED=0
WARNINGS=0

# Function to print status
print_status() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✓${NC} $2"
        ((PASSED++))
    else
        echo -e "${RED}✗${NC} $2"
        ((FAILED++))
    fi
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
    ((WARNINGS++))
}

echo "📁 Checking Project Structure..."
echo "-----------------------------------"

# Check for essential files
[ -f "package.json" ] && print_status 0 "package.json exists" || print_status 1 "package.json missing"
[ -f "app.json" ] && print_status 0 "app.json exists" || print_status 1 "app.json missing"
[ -f "tsconfig.json" ] && print_status 0 "tsconfig.json exists" || print_status 1 "tsconfig.json missing"

# Check for app directory
[ -d "app" ] && print_status 0 "app/ directory exists" || print_status 1 "app/ directory missing"

# Check for screens
[ -f "app/index.tsx" ] && print_status 0 "Launcher screen exists" || print_status 1 "Launcher screen missing"
[ -f "app/study-guide.tsx" ] && print_status 0 "Study Guide screen exists" || print_status 1 "Study Guide screen missing"
[ -f "app/course.tsx" ] && print_status 0 "Course screen exists" || print_status 1 "Course screen missing"
[ -f "app/assistant.tsx" ] && print_status 0 "Assistant screen exists" || print_status 1 "Assistant screen missing"

# Check for components
[ -f "components/LearningBuddy.tsx" ] && print_status 0 "LearningBuddy component exists" || print_status 1 "LearningBuddy component missing"

# Check for store
[ -f "store/useAppStore.ts" ] && print_status 0 "Zustand store exists" || print_status 1 "Zustand store missing"

echo ""
echo "📦 Checking Dependencies..."
echo "-----------------------------------"

# Check if node_modules exists
if [ -d "node_modules" ]; then
    print_status 0 "node_modules/ directory exists"
    
    # Check for key dependencies
    [ -d "node_modules/expo" ] && print_status 0 "Expo installed" || print_status 1 "Expo not installed"
    [ -d "node_modules/expo-router" ] && print_status 0 "Expo Router installed" || print_status 1 "Expo Router not installed"
    [ -d "node_modules/zustand" ] && print_status 0 "Zustand installed" || print_status 1 "Zustand not installed"
    [ -d "node_modules/rive-react-native" ] && print_status 0 "RIVE React Native installed" || print_status 1 "RIVE React Native not installed"
    [ -d "node_modules/expo-dev-client" ] && print_status 0 "Expo Dev Client installed" || print_status 1 "Expo Dev Client not installed"
else
    print_status 1 "node_modules/ directory missing - Run 'npm install'"
fi

echo ""
echo "🎨 Checking Assets..."
echo "-----------------------------------"

# Check assets directory
if [ -d "assets" ]; then
    print_status 0 "assets/ directory exists"
    
    # Check for RIVE file
    if [ -f "assets/buddy.riv" ]; then
        print_status 0 "buddy.riv file found"
        
        # Check file size (should be > 1KB for valid RIVE file)
        FILE_SIZE=$(wc -c < "assets/buddy.riv")
        if [ $FILE_SIZE -gt 1024 ]; then
            print_status 0 "buddy.riv appears to be valid (>1KB)"
        else
            print_warning "buddy.riv is very small - might be placeholder"
        fi
    else
        print_status 1 "buddy.riv file NOT FOUND"
        echo -e "    ${YELLOW}→${NC} You need to add your RIVE animation file at: assets/buddy.riv"
    fi
else
    print_status 1 "assets/ directory missing"
fi

echo ""
echo "🔨 Checking Build Status..."
echo "-----------------------------------"

# Check for prebuild
if [ -d "android" ] || [ -d "ios" ]; then
    print_status 0 "Native projects exist (prebuild completed)"
    [ -d "android" ] && echo "    → Android project found"
    [ -d "ios" ] && echo "    → iOS project found"
else
    print_warning "Native projects not found - Run 'npx expo prebuild'"
fi

echo ""
echo "📚 Checking Documentation..."
echo "-----------------------------------"

[ -f "README.md" ] && print_status 0 "README.md exists" || print_status 1 "README.md missing"
[ -f "QUICKSTART.md" ] && print_status 0 "QUICKSTART.md exists" || print_status 1 "QUICKSTART.md missing"
[ -f "RIVE_INTEGRATION.md" ] && print_status 0 "RIVE_INTEGRATION.md exists" || print_status 1 "RIVE_INTEGRATION.md missing"
[ -f "PROJECT_SUMMARY.md" ] && print_status 0 "PROJECT_SUMMARY.md exists" || print_status 1 "PROJECT_SUMMARY.md missing"

echo ""
echo "=========================================="
echo "📊 Verification Summary"
echo "=========================================="
echo -e "${GREEN}Passed:${NC} $PASSED"
echo -e "${RED}Failed:${NC} $FAILED"
echo -e "${YELLOW}Warnings:${NC} $WARNINGS"
echo ""

# Final status
if [ $FAILED -eq 0 ]; then
    if [ $WARNINGS -eq 0 ]; then
        echo -e "${GREEN}✨ All checks passed! Your project is ready.${NC}"
    else
        echo -e "${YELLOW}⚠️  All essential checks passed, but there are some warnings.${NC}"
    fi
    echo ""
    echo "🚀 Next Steps:"
    echo "   1. Ensure buddy.riv is in assets/ folder"
    echo "   2. Run: npx expo prebuild"
    echo "   3. Run: npx expo run:android (or ios)"
    echo "   4. Run: npx expo start --dev-client"
else
    echo -e "${RED}❌ Some checks failed. Please fix the issues above.${NC}"
    echo ""
    echo "🔧 Common Fixes:"
    echo "   • Missing dependencies: Run 'npm install'"
    echo "   • Missing files: Check if all files were created"
    echo "   • Missing RIVE file: Add buddy.riv to assets/ folder"
fi

echo ""
