# 🚀 QUICK START GUIDE

## Prerequisites
- Node.js installed
- npm or yarn installed
- Android Studio (for Android) or Xcode (for iOS)

## 5-Minute Setup

### 1️⃣ Install Dependencies
```bash
npm install
```

### 2️⃣ Install RIVE Support
```bash
npx expo install expo-dev-client
npm i rive-react-native
```

### 3️⃣ Add Your RIVE File
Place your `buddy.riv` file in the `/assets/` folder:
```
/assets/buddy.riv  ← Your RIVE animation file goes here
```

**RIVE File Must Have:**
- State Machine: `MainStateMachine`
- Inputs: `mood`, `progress`, `streakCount`, `energy`
- Triggers: `tap`, `correct`, `wrong`, `levelUp`

### 4️⃣ Prebuild Native Projects
```bash
npx expo prebuild
```

### 5️⃣ Run the App
**Android:**
```bash
npx expo run:android
```

**iOS:**
```bash
npx expo run:ios
```

**Or use Dev Client:**
```bash
npx expo start --dev-client
```

---

## ⚠️ Important Notes

### ❌ DO NOT:
- Use `expo start` alone (missing `--dev-client`)
- Use Expo Go app (doesn't support RIVE)
- Forget to add `buddy.riv` file

### ✅ DO:
- Use `npx expo start --dev-client`
- Test on a physical device or emulator
- Check `assets/buddy.riv` exists before running

---

## 📱 App Structure

### Screens:
1. **Launcher** (`/app/index.tsx`) - Choose which screen to view
2. **Study Guide** (`/app/study-guide.tsx`) - Learning plan with subjects
3. **Study Craft** (`/app/course.tsx`) - Course details with RIVE buddy
4. **AI Assistant** (`/app/assistant.tsx`) - Chat with RIVE buddy

### Key Components:
- `LearningBuddy.tsx` - RIVE animation wrapper
- `useAppStore.ts` - Zustand state management

---

## 🎨 RIVE Integration

The RIVE buddy appears on:
- **Course screen** (center, mood: happy)
- **Assistant screen** (top, mood: focus when thinking)

**Tap the buddy** to trigger animations!

---

## 🐛 Troubleshooting

### "Cannot find buddy.riv"
→ Add your `.riv` file to `/assets/buddy.riv`

### "Expo Go doesn't support RIVE"
→ Use: `npx expo run:android --dev-client`

### "State machine not found"
→ Ensure your RIVE file has state machine named `MainStateMachine`

### Need more help?
→ See `RIVE_INTEGRATION.md` for detailed guide
→ See `PROJECT_SUMMARY.md` for complete overview

---

## 📚 Documentation

- **README.md** - Full setup guide
- **RIVE_INTEGRATION.md** - RIVE implementation details
- **PROJECT_SUMMARY.md** - Complete project overview
- **assets/README.md** - Asset requirements

---

## ✅ Verify Setup

Run this checklist:
- [ ] `node_modules/` folder exists
- [ ] `buddy.riv` file in `/assets/`
- [ ] Expo Dev Client installed
- [ ] Project prebuilt (`android/` or `ios/` folder exists)
- [ ] Running with `--dev-client` flag

---

**Ready to build! 🎉**

For detailed documentation, see:
- Full Guide: `README.md`
- RIVE Guide: `RIVE_INTEGRATION.md`
- Project Info: `PROJECT_SUMMARY.md`
