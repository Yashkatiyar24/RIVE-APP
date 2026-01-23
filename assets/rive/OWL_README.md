# AI Owl Rive Animation

## Required File
The `owl.riv` file is used for the AI Owl character in the Assistant screen.

## File Location
- **Source**: `assets/rive/owl.riv`
- **Android**: Copied to `android/app/src/main/res/raw/owl.riv`
- **iOS**: Added to Xcode project bundle resources (after running `npx expo prebuild`)

## Usage in Components

The owl animation is used in two components:

### 1. `AIOwl.tsx` (Simple Component)
A straightforward implementation that displays the owl with autoplay.

```tsx
import AIOwl from '../components/AIOwl';

<AIOwl size="large" isThinking={false} />
```

### 2. `RiveAIOwl.tsx` (Advanced Component)
Full-featured component with state machine control and triggers.

```tsx
import RiveAIOwl, { RiveAIOwlRef } from '../components/RiveAIOwl';

const owlRef = useRef<RiveAIOwlRef>(null);

<RiveAIOwl
  ref={owlRef}
  size="large"
  isThinking={isThinking}
  onTap={() => console.log('tapped!')}
/>

// Control the owl
owlRef.current?.setThinking(true);
owlRef.current?.fireThink();
owlRef.current?.fireRespond();
```

## State Machine Detection

The `RiveAIOwl` component automatically tries to detect common state machine names:
- "State Machine 1"
- "State Machine"
- "OwlMachine"
- "MainStateMachine"
- "Main"
- "Owl"

### Detected Inputs
- `isThinking` / `thinking` (Boolean): Controls thinking state
- `mood` (Number): 0=idle, 1=happy, 2=thinking, 3=excited

### Detected Triggers
- `think` / `thinking`: Start thinking animation
- `respond` / `reply`: Response ready animation
- `blink` / `wink`: Blink animation

## Platform Support

| Platform | Support | Implementation |
|----------|---------|----------------|
| iOS | ✅ Native Rive | Uses `rive-react-native` |
| Android | ✅ Native Rive | Uses `rive-react-native` |
| Web | ⚠️ Placeholder | Animated owl placeholder (Rive web not bundled) |

## Setup for Native

### Android
The `.riv` file must be in `android/app/src/main/res/raw/`:
```bash
cp assets/rive/owl.riv android/app/src/main/res/raw/
```

### iOS
After running `npx expo prebuild`, add the `.riv` file to the Xcode project:
1. Open `ios/[AppName].xcworkspace` in Xcode
2. Drag `assets/rive/owl.riv` to the project navigator
3. Ensure "Copy items if needed" is checked
4. Add to target

## Fallback Behavior

When Rive is not available (web platform), the component displays:
- An animated CSS owl placeholder
- Visual feedback for thinking state
- Labels indicating owl state

## Integration with BuddyStore

The owl can be connected to the global buddy store for synchronized animations:

```tsx
import { useBuddy } from '../context/BuddyProvider';

const buddy = useBuddy();

// Trigger reactions
buddy.onChatThinkingStart(); // Sets thinking state
buddy.onChatReply();         // Celebrates and resets thinking
```

## Performance Tips

1. Keep animations optimized (< 500KB recommended)
2. Use `autoplay={true}` for idle animations
3. Minimize state machine inputs for better performance
4. Consider using smaller size prop for list views
