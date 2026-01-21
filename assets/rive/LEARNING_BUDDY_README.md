# Learning Buddy Rive Animation

## Required File
Place your `learning_buddy.riv` file in this directory.

## State Machine Configuration

The RiveBuddy component expects a state machine named **"BuddyMachine"** with the following inputs:

### Number Inputs
- `mood` (0-5): Controls the buddy's emotional state
  - 0 = idle
  - 1 = happy
  - 2 = sad
  - 3 = focused
  - 4 = thinking
  - 5 = excited

- `progress` (0-100): Shows learning progress
- `streakCount` (0+): Shows current streak

### Boolean Inputs (Alternative to mood number)
If you prefer boolean inputs instead of a mood number:
- `isIdle`
- `isHappy`
- `isSad`
- `isFocused`
- `isThinking`
- `isExcited`

### Triggers
- `celebrate` or `tapCelebrate`: Celebration animation
- `thinking` or `think`: Start thinking loop
- `tap` or `click`: Quick reaction animation
- `wink` or `blink`: Eye wink animation

## Fallback Behavior

The RiveBuddy component has adaptive input detection. If a specific input or trigger is not found, it will:
1. Log a warning to help debug
2. Continue working with available inputs
3. Fall back to an emoji-based placeholder on web

## Animation Tips

For best results, your Rive animation should:
1. Have an idle loop that plays by default (autoplay)
2. Smoothly transition between mood states
3. Have clear, distinct celebration and thinking animations
4. Be optimized for mobile performance (< 500KB recommended)

## Example Rive Community Files

You can use or adapt animations from:
- https://rive.app/community/
- Search for "character", "buddy", "mascot", or "avatar"
