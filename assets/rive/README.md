# Rive Animation Setup Guide

This guide explains how to integrate your Rive animation files into the E-Craft Learning app.

## Current Rive Files

| File | Purpose | Status |
|------|---------|--------|
| `assets/rive/learning_buddy.riv` | Main buddy character (hero, headers) | ⚠️ Placeholder (272 bytes) |
| `assets/rive/owl.riv` | AI Assistant owl character | ⚠️ Empty (needs real file) |

## How to Add Your Rive Files

### Step 1: Export from Rive Editor

1. Open your animation in [Rive Editor](https://rive.app)
2. Click **Export** → **For Runtime**
3. Ensure "Include all artboards and state machines" is checked
4. Download the `.riv` file

### Step 2: Place Files in Assets

Copy your exported `.riv` files to:
```
assets/rive/
├── learning_buddy.riv   # For RiveBuddy component
├── owl.riv              # For RiveAIOwl component  
└── cat_professor.riv    # For RiveCatProfessor component (optional)
```

### Step 3: Note Your State Machine Names

Check your Rive file's **State Machine name**. Common examples:
- `State Machine 1` (Rive default)
- `MainStateMachine`
- Custom names like `BuddyMachine`, `OwlMachine`

The components will try to auto-detect common names, but you can update them in the component files if needed.

### Step 4: Note Your Input/Trigger Names

The components look for these inputs (case-insensitive):

**For RiveBuddy:**
- `mood` (Number: 0=idle, 1=happy, 2=sad, 3=focused, 4=thinking, 5=excited)
- `progress` (Number: 0-100)
- `streakCount` (Number)
- `isThinking` (Boolean)
- `celebrate` (Trigger)

**For RiveAIOwl:**
- `isThinking` / `thinking` (Boolean)
- `mood` (Number)
- `think` (Trigger)
- `respond` / `reply` (Trigger)
- `blink` (Trigger)

**For RiveCatProfessor:**
- `mood` (Number: 0=idle, 1=happy, 2=teaching, 3=excited)
- `isTeaching` (Boolean)
- `wave` (Trigger)
- `explain` (Trigger)
- `celebrate` (Trigger)

## Testing on Native

Rive animations **only work on iOS/Android** (not web). To test:

```bash
# For iOS (requires Mac with Xcode)
npx expo run:ios

# For Android (requires Android Studio)
npx expo run:android
```

## Web Fallback

On web, the app uses premium CSS-animated placeholder characters that mimic the Rive style:
- Floating/bobbing animation
- Expressive eyes with blinking
- Mood-based colors
- Particle effects on celebrations

## Troubleshooting

### "Rive file not found" on native
- Ensure the file is in `assets/rive/`
- Run `npx expo prebuild --clean` to regenerate native projects
- Rebuild with `npx expo run:ios` or `npx expo run:android`

### Animations not responding to inputs
- Check your state machine name matches what the component expects
- Verify input/trigger names in Rive Editor
- Look at console logs for "[RiveBuddy]" or "[RiveAIOwl]" warnings

### Empty or corrupted .riv file
- Re-export from Rive Editor
- Ensure the file is at least a few KB in size
- Don't rename the file extension manually

## Component Files Reference

| Component | File | Rive Resource Name |
|-----------|------|-------------------|
| RiveBuddy | `components/RiveBuddy.tsx` | `learning_buddy` |
| RiveAIOwl | `components/RiveAIOwl.tsx` | `owl` |
| RiveCatProfessor | `components/RiveCatProfessor.tsx` | `cat_professor` |
