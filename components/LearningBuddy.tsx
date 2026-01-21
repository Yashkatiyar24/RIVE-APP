import React, { useRef, useImperativeHandle, forwardRef } from 'react';
import { View, StyleSheet, Pressable, Platform, Animated, Text } from 'react-native';

// Conditionally import Rive only on native platforms
let Rive: any = null;
let RiveRef: any = null;
let Fit: any = null;
let Alignment: any = null;

try {
  if (Platform.OS !== 'web') {
    const RiveModule = require('rive-react-native');
    Rive = RiveModule.default;
    RiveRef = RiveModule.RiveRef;
    Fit = RiveModule.Fit;
    Alignment = RiveModule.Alignment;
  }
} catch (e) {
  console.log('Rive not available, using placeholder');
}

/**
 * LearningBuddy - Interactive Rive Learning Character
 * 
 * A friendly animated character that responds to user interactions.
 * Uses Rive animation when available, falls back to animated placeholder.
 */

export type Mood = 'happy' | 'focused' | 'excited' | 'thinking';

export interface LearningBuddyRef {
  setMood: (mood: Mood) => void;
  fireTap: () => void;
  fireWink: () => void;
  fireCelebrate: () => void;
  fireThinking: () => void;
}

interface LearningBuddyProps {
  mood?: Mood;
  progress?: number;
  streakCount?: number;
  size?: 'tiny' | 'small' | 'medium' | 'large';
  onTap?: () => void;
}

const LearningBuddy = forwardRef<LearningBuddyRef, LearningBuddyProps>(
  ({ mood = 'happy', progress = 0, streakCount = 0, size = 'medium', onTap }, ref) => {
    const riveRef = useRef<any>(null);
    const pulseAnim = useRef(new Animated.Value(1)).current;
    const bounceAnim = useRef(new Animated.Value(0)).current;
    const [currentMood, setCurrentMood] = React.useState<Mood>(mood);
    const [isAnimating, setIsAnimating] = React.useState(false);
    const stateMachineName = 'BuddyMachine';

    const sizeMap = {
      tiny: { width: 50, height: 50 },
      small: { width: 80, height: 80 },
      medium: { width: 120, height: 120 },
      large: { width: 200, height: 200 },
    };

    const triggerPulse = () => {
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.15,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    };

    const triggerBounce = () => {
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: -10,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 5,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 0,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();
    };

    const safeFireTrigger = (triggerName: string) => {
      if (riveRef.current) {
        try {
          riveRef.current.fireState(stateMachineName, triggerName);
        } catch (e) {
          console.log(`Trigger ${triggerName} not found`);
        }
      }
      // Animate placeholder
      setIsAnimating(true);
      triggerPulse();
      setTimeout(() => setIsAnimating(false), 500);
    };

    const safeSetInput = (inputName: string, value: number | boolean | string) => {
      if (riveRef.current) {
        try {
          riveRef.current.setInputState(stateMachineName, inputName, value);
        } catch (e) {
          console.log(`Input ${inputName} not found`);
        }
      }
    };

    useImperativeHandle(ref, () => ({
      setMood: (newMood: Mood) => {
        setCurrentMood(newMood);
        const moodValue = { happy: 0, focused: 1, excited: 2, thinking: 3 }[newMood];
        safeSetInput('mood', moodValue);
      },
      fireTap: () => {
        safeFireTrigger('tap');
        triggerPulse();
      },
      fireWink: () => {
        safeFireTrigger('wink');
        triggerPulse();
      },
      fireCelebrate: () => {
        safeFireTrigger('celebrate');
        triggerBounce();
      },
      fireThinking: () => {
        safeFireTrigger('think');
        setCurrentMood('thinking');
      },
    }));

    const handleTap = () => {
      safeFireTrigger('tap');
      triggerPulse();
      onTap?.();
    };

    // Check if Rive is available
    const shouldUseRive = Rive && Platform.OS !== 'web';
    const dimensions = sizeMap[size];

    if (shouldUseRive) {
      return (
        <Pressable onPress={handleTap} style={dimensions}>
          <Rive
            ref={riveRef}
            resourceName="learning_buddy"
            stateMachineName={stateMachineName}
            fit={Fit?.Contain}
            alignment={Alignment?.Center}
            style={styles.rive}
          />
        </Pressable>
      );
    }

    // Fallback placeholder - Animated friendly character
    const getMoodEmoji = () => {
      const emojis = {
        happy: '😊',
        focused: '🧐',
        excited: '🎉',
        thinking: '🤔',
      };
      return emojis[currentMood];
    };

    const getMoodColor = () => {
      const colors = {
        happy: '#FCD34D',
        focused: '#60A5FA',
        excited: '#F472B6',
        thinking: '#A78BFA',
      };
      return colors[currentMood];
    };

    return (
      <Pressable onPress={handleTap}>
        <Animated.View
          style={[
            styles.buddyContainer,
            dimensions,
            {
              backgroundColor: getMoodColor(),
              transform: [
                { scale: pulseAnim },
                { translateY: bounceAnim },
              ],
            },
          ]}
        >
          {/* Progress ring */}
          {progress > 0 && size !== 'tiny' && (
            <View style={styles.progressRing}>
              <View
                style={[
                  styles.progressFill,
                  {
                    transform: [{ rotate: `${(progress / 100) * 360}deg` }],
                  },
                ]}
              />
            </View>
          )}
          
          {/* Buddy face */}
          <View style={styles.faceContainer}>
            <Text style={[styles.emoji, size === 'tiny' && styles.emojiTiny]}>
              {getMoodEmoji()}
            </Text>
          </View>

          {/* Streak indicator */}
          {streakCount > 0 && size !== 'tiny' && (
            <View style={styles.streakBadge}>
              <Text style={styles.streakText}>🔥{streakCount}</Text>
            </View>
          )}
          
          {/* Animation effect overlay */}
          {isAnimating && (
            <View style={styles.animationOverlay}>
              <Text style={styles.sparkle}>✨</Text>
            </View>
          )}
        </Animated.View>
      </Pressable>
    );
  }
);

const styles = StyleSheet.create({
  rive: {
    width: '100%',
    height: '100%',
  },
  buddyContainer: {
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    position: 'relative',
  },
  progressRing: {
    position: 'absolute',
    top: -3,
    left: -3,
    right: -3,
    bottom: -3,
    borderRadius: 100,
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    overflow: 'hidden',
  },
  progressFill: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 100,
    borderWidth: 3,
    borderColor: '#F59E0B',
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
  },
  faceContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 48,
  },
  emojiTiny: {
    fontSize: 24,
  },
  streakBadge: {
    position: 'absolute',
    bottom: -5,
    right: -5,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  streakText: {
    fontSize: 12,
    fontWeight: '700',
  },
  animationOverlay: {
    position: 'absolute',
    top: -10,
    right: -10,
  },
  sparkle: {
    fontSize: 20,
  },
});

LearningBuddy.displayName = 'LearningBuddy';

export default LearningBuddy;
