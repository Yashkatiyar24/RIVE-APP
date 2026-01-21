# Rive Assets

This directory should contain the Rive animation files for the Learning Buddy character.

## Required File

Place your Rive file here:
```
assets/rive/learning_buddy.riv
```

## State Machine Configuration

The app expects a state machine named **"BuddyMachine"** with the following inputs:

### Number Inputs

| Input Name   | Type   | Range      | Description                     |
|--------------|--------|------------|---------------------------------|
| `mood`       | Number | 0-3        | 0=idle, 1=happy, 2=sad, 3=focused |
| `progress`   | Number | 0-100      | Learning progress percentage    |
| `streakCount`| Number | 0+         | Current learning streak count   |

### Triggers

| Trigger Name | Description                              |
|--------------|------------------------------------------|
| `celebrate`  | Play celebration animation (level up, enroll) |
| `thinking`   | Play thinking/processing animation       |
| `tap`        | Play tap/wave reaction animation         |
| `wink`       | Play wink/fun interaction animation (optional) |

## Mood States

```javascript
const moodMap = {
  idle: 0,      // Default neutral state
  happy: 1,     // Positive feedback, celebrations
  sad: 2,       // Errors, wrong answers
  focused: 3,   // Learning mode, processing
};
```

## Usage in App

The `LearningBuddy` component automatically:
1. Sets mood based on screen context
2. Updates progress from store
3. Fires triggers on user interactions

### Study Guide Screen
- Small buddy in header
- `focused` mood when Learning mode
- `happy` mood when Practicing mode
- `tap` trigger on grade selection
- `celebrate` trigger on "Add" subject

### Course Detail Screen  
- Large buddy in hero area
- `focused` mood on load
- `celebrate` trigger on enroll

### AI Assistant Screen
- Large buddy with owl theme
- `focused` mood when AI thinking
- `thinking` trigger on message send
- `happy` mood when response received
- `celebrate` trigger on response complete

## Fallback Behavior

If inputs or triggers don't exist in your .riv file, the component gracefully ignores them and logs a warning. This allows for incremental development of the animation.

## Creating Your Rive File

1. Go to [rive.app](https://rive.app)
2. Create a new file
3. Design your character with multiple states
4. Add a State Machine named "BuddyMachine"
5. Configure inputs as listed above
6. Export as .riv format
7. Place in this directory as `learning_buddy.riv`

## Native Build Required

Since rive-react-native requires native code:

```bash
# Install dev client
npx expo install expo-dev-client

# Prebuild native projects
npx expo prebuild

# Run on device/simulator
npx expo run:ios
# or
npx expo run:android
```
