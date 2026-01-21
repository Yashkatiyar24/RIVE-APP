# RIVE Learning App

## 🚀 Setup Instructions

### Prerequisites
1. Node.js installed
2. Expo CLI: `npm install -g expo-cli`
3. **RIVE Animation File**: Place your `buddy.riv` file in `assets/buddy.riv`

### Installation

```bash
# Install dependencies
npm install

# Install Expo Dev Client (REQUIRED for RIVE)
npx expo install expo-dev-client

# Install RIVE React Native
npm i rive-react-native

# Prebuild native projects
npx expo prebuild

# Run on Android
npx expo run:android

# Run on iOS
npx expo run:ios

# Start with Dev Client
npx expo start --dev-client
```

### ⚠️ Important Notes

- **DO NOT use Expo Go** - RIVE requires Expo Dev Client
- Place `buddy.riv` file at: `assets/buddy.riv`
- The RIVE file should have a state machine named `MainStateMachine`
- Required inputs in RIVE state machine:
  - `mood` (number: 0=idle, 1=happy, 2=sad, 3=focus, 4=excited)
  - `progress` (number: 0-100)
  - `streakCount` (number)
  - `energy` (number: 0-1)
- Required triggers:
  - `tap`
  - `correct`
  - `wrong`
  - `levelUp`

### 📁 Project Structure

```
/app
  /app                    # Expo Router screens
    _layout.tsx          # Root layout
    index.tsx            # Launcher screen
    study-guide.tsx      # Study Guide screen
    course.tsx           # Study Craft screen
    assistant.tsx        # AI Assistant screen
  /components
    LearningBuddy.tsx    # RIVE animation component
  /store
    useAppStore.ts       # Zustand state management
  /assets
    buddy.riv            # RIVE animation file (YOU NEED TO ADD THIS)
```

### 🎨 Features

- 3 main screens with Expo Router navigation
- RIVE animations with mood states and triggers
- Zustand for state management
- Pastel design system with soft shadows
- Interactive elements with data-testid attributes

### 🔧 Customizing RIVE Inputs

If your `.riv` file has different input names, update the mapping in `components/LearningBuddy.tsx`:

```typescript
// Change these to match your RIVE file's input names
riveRef.current.setInputState('MainStateMachine', 'mood', moodNumber);
riveRef.current.setInputState('MainStateMachine', 'progress', progress);
```