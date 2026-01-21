# RIVE Animation Integration Guide

## 🎯 Overview

This app uses **RIVE animations** to bring the learning buddy character to life across three screens:

1. **Study Guide** - Small buddy in header, reacts to mode toggles and grade selections
2. **Study Craft (Course)** - Large buddy in hero area, focused mood on load
3. **AI Assistant** - Large buddy with thinking animations during AI processing

---

## 📋 Prerequisites

### Required Tools:
- **RIVE Editor** (https://rive.app/community/files) - to create/export .riv files
- **Expo Dev Client** - RIVE does NOT work with Expo Go
- **Physical device or emulator** - for testing

### Required Dependencies (Already Installed):
```json
{
  "expo-dev-client": "~5.0.0",
  "rive-react-native": "^8.0.0"
}
```

---

## 🎨 RIVE File Specification

### File Location:
```
/assets/rive/learning_buddy.riv
```

### State Machine Requirements:

#### Name: `"BuddyMachine"`

#### Inputs (Type: Number):

| Input Name | Type | Range | Purpose |
|------------|------|-------|---------|
| `mood` | Number | 0-3 | Character emotion state |
| `progress` | Number | 0-100 | Learning progress percentage |
| `streakCount` | Number | 0+ | Days streak counter |

#### Mood Values:
```typescript
0 = idle    // Default resting state
1 = happy   // Positive, cheerful, practicing mode
2 = sad     // Disappointed, errors
3 = focused // Concentrating, learning mode, AI thinking
```

#### Triggers (Type: Boolean):

| Trigger Name | When to Fire | Use Case |
|--------------|--------------|----------|
| `tap` | User taps character | Interactive wave/reaction |
| `celebrate` | User enrolls/levels up | Celebration animation |
| `thinking` | AI processing message | Thinking/processing animation |
| `wink` | Fun interaction (optional) | Playful wink animation |

---

## 🛠️ Implementation Examples

### Basic Usage with Ref:

```typescript
import LearningBuddy, { LearningBuddyRef } from '../components/LearningBuddy';

const buddyRef = useRef<LearningBuddyRef>(null);

<LearningBuddy
  ref={buddyRef}
  mood="happy"
  progress={65}
  streakCount={5}
  size="large"
  onTap={() => console.log('Buddy tapped!')}
/>

// Fire triggers programmatically
buddyRef.current?.fireCelebrate();
buddyRef.current?.fireThinking();
buddyRef.current?.setMood('focused');
```

### Study Guide Screen Integration:

```typescript
// Small buddy in header with mode-based reactions
const buddyMood = activeMode === 'Learning' ? 'focused' : 'happy';

<LearningBuddy
  ref={buddyRef}
  mood={buddyMood}
  progress={totalProgress}
  size="tiny"
  onTap={() => buddyRef.current?.fireWink()}
/>

// On mode toggle
const handleModeChange = (mode) => {
  setActiveMode(mode);
  if (mode === 'Learning') {
    buddyRef.current?.setMood('focused');
  } else {
    buddyRef.current?.setMood('happy');
    buddyRef.current?.fireTap();
  }
};

// On grade selection
const handleGradeSelect = (grade) => {
  setActiveGrade(grade);
  buddyRef.current?.fireTap();
};

// On Add subject
const handleAddSubject = () => {
  buddyRef.current?.setMood('happy');
  buddyRef.current?.fireCelebrate();
};
```

### Course Screen (Study Craft):

```typescript
// Large hero buddy with focused mood
const buddyRef = useRef<LearningBuddyRef>(null);

// On mount - set initial mood
useEffect(() => {
  if (buddyRef.current) {
    buddyRef.current.setMood('focused');
    setTimeout(() => buddyRef.current?.fireTap(), 500);
  }
}, []);

<LearningBuddy
  ref={buddyRef}
  mood="focused"
  progress={65}
  streakCount={5}
  size="large"
  onTap={() => buddyRef.current?.fireWink()}
/>

// On enroll button press
const handleEnroll = () => {
  buddyRef.current?.setMood('happy');
  buddyRef.current?.fireCelebrate();
};
```

### AI Assistant Screen:

```typescript
// Dynamic mood based on AI thinking state
const buddyRef = useRef<LearningBuddyRef>(null);
const { isThinking } = useAppStore();

// React to thinking state changes
useEffect(() => {
  if (buddyRef.current) {
    if (isThinking) {
      buddyRef.current.setMood('focused');
      buddyRef.current.fireThinking();
    } else {
      buddyRef.current.setMood('happy');
    }
  }
}, [isThinking]);

<LearningBuddy
  ref={buddyRef}
  mood={isThinking ? 'focused' : 'happy'}
  progress={45}
  streakCount={3}
  size="large"
  onTap={() => !isThinking && buddyRef.current?.fireWink()}
/>

// On send message
const handleSend = () => {
  setIsThinking(true);
  buddyRef.current?.setMood('focused');
  buddyRef.current?.fireThinking();
  
  // After AI responds
  setTimeout(() => {
    setIsThinking(false);
    buddyRef.current?.setMood('happy');
    buddyRef.current?.fireCelebrate();
  }, 2000);
};
```

---

## 🔧 LearningBuddy Component API

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `mood` | Mood | 'idle' | Current mood state |
| `progress` | number | 0 | Progress 0-100 |
| `streakCount` | number | 0 | Streak counter |
| `size` | 'tiny' \| 'small' \| 'medium' \| 'large' | 'large' | Display size |
| `onTap` | () => void | - | Tap callback |
| `style` | ViewStyle | - | Custom styles |
| `stateMachineName` | string | 'BuddyMachine' | Rive state machine name |

### Ref Methods

| Method | Description |
|--------|-------------|
| `fireCelebrate()` | Fire celebrate trigger |
| `fireThinking()` | Fire thinking trigger |
| `fireTap()` | Fire tap trigger |
| `fireWink()` | Fire wink trigger |
| `setMood(mood)` | Set mood programmatically |
| `setProgress(n)` | Set progress programmatically |
| `setStreakCount(n)` | Set streak count programmatically |

### Size Dimensions

| Size | Width | Height |
|------|-------|--------|
| tiny | 60px | 60px |
| small | 100px | 100px |
| medium | 180px | 180px |
| large | 280px | 280px |

---

## 🔧 Customizing for Your RIVE File

If your `.riv` file has **different input/trigger names**, the component will gracefully handle missing inputs by logging warnings.

To use a different state machine name:

```typescript
<LearningBuddy
  stateMachineName="YourStateMachineName"
  mood="happy"
/>
```

---

## 🎭 Mood State Transitions

### Recommended Flows:

**Learning Journey:**
```
idle → focus (start lesson)
focus → happy (correct answer)
focus → sad (wrong answer)
happy → excited (level up!)
```

**Course Exploration:**
```
idle → happy (viewing course)
happy → excited (tap interaction)
excited → happy (after animation)
```

**AI Chat:**
```
happy → focus (user sends message)
focus → happy (AI responds)
```

---

## 🚀 Advanced Usage

### Exposing Trigger Methods:

To fire triggers from parent components, you can expose methods using refs:

```typescript
// In parent component:
const buddyRef = useRef<any>(null);

const handleCorrectAnswer = () => {
  buddyRef.current?.fireCorrect();
};

<LearningBuddy
  ref={buddyRef}
  mood="focus"
/>
```

### Dynamic Mood Based on State:

```typescript
const getMoodForProgress = (progress: number): Mood => {
  if (progress === 0) return 'idle';
  if (progress < 30) return 'focus';
  if (progress < 70) return 'happy';
  return 'excited';
};

<LearningBuddy
  mood={getMoodForProgress(userProgress)}
  progress={userProgress}
/>
```

---

## 🐛 Troubleshooting

### Issue: "Rive file not found"
**Solution:** Ensure `learning_buddy.riv` is in `/assets/rive/` and run `npx expo prebuild`

### Issue: "State machine not found"
**Solution:** Verify your RIVE file has a state machine named exactly `"BuddyMachine"`

### Issue: "Input not found"
**Solution:** Check your RIVE file's input names match: `mood`, `progress`, `streakCount`. The component logs warnings for missing inputs.

### Issue: "Trigger not firing"
**Solution:** 
1. Verify trigger names in RIVE file: `celebrate`, `thinking`, `tap`, `wink`
2. Check console logs for errors
3. Ensure triggers are configured correctly in RIVE state machine

### Issue: "Animation not playing in Expo Go"
**Solution:** RIVE requires Expo Dev Client. Run:
```bash
npx expo run:ios
# or
npx expo run:android
```

---

## 📚 Resources

- **RIVE Documentation:** https://rive.app/community/doc/overview/docvlgMh4VA
- **RIVE React Native:** https://github.com/rive-app/rive-react-native
- **Expo Dev Client:** https://docs.expo.dev/develop/development-builds/introduction/
- **Community RIVE Files:** https://rive.app/community/

---

## ✅ Checklist

Before running the app, ensure:

- [ ] `learning_buddy.riv` file is in `/assets/rive/` folder
- [ ] RIVE file has `BuddyMachine` state machine
- [ ] Inputs exist: `mood` (0-3), `progress` (0-100), `streakCount` (0+)
- [ ] Triggers exist: `celebrate`, `thinking`, `tap`, `wink` (optional)
- [ ] Expo Dev Client is installed: `npx expo install expo-dev-client`
- [ ] Project is prebuilt: `npx expo prebuild`
- [ ] Running with dev client: `npx expo run:ios` or `npx expo run:android`

---

**Happy animating! 🎨✨**
