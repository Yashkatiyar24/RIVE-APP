import React, { useRef, useEffect, useMemo, memo, useCallback } from 'react';
import { View, StyleSheet, Pressable, Platform, Animated, Easing, Text } from 'react-native';
import { useBuddyStore, BuddyMood } from '../store/buddyStore';

// Conditionally import Rive only on native
let Rive: any = null;
let Fit: any = null;
let Alignment: any = null;
let isRiveAvailable = false;

try {
  if (Platform.OS !== 'web') {
    const RiveModule = require('rive-react-native');
    Rive = RiveModule.default;
    Fit = RiveModule.Fit;
    Alignment = RiveModule.Alignment;
    isRiveAvailable = true;
  }
} catch (e) {
  console.warn('[RiveBuddy] Rive not available, using animated placeholder');
}

/**
 * RiveBuddy Component - Premium Animated Character
 * 
 * Features:
 * - Uses actual Rive animation on native (when file is available)
 * - Premium animated placeholder fallback
 * - Mood-based expressions and colors
 * - Smooth floating/bobbing animation
 * - Particle effects on celebrations
 */

export type BuddySize = 'tiny' | 'small' | 'medium' | 'large' | 'hero';

interface RiveBuddyProps {
  size?: BuddySize;
  onTap?: () => void;
  style?: any;
  showProgress?: boolean;
  showStreak?: boolean;
  pointerEvents?: 'auto' | 'none' | 'box-none' | 'box-only';
}

const SIZE_MAP: Record<BuddySize, { width: number; height: number; scale: number }> = {
  tiny: { width: 50, height: 50, scale: 0.4 },
  small: { width: 80, height: 80, scale: 0.6 },
  medium: { width: 120, height: 120, scale: 0.8 },
  large: { width: 180, height: 180, scale: 1.0 },
  hero: { width: 240, height: 240, scale: 1.2 },
};

const MOOD_COLORS: Record<BuddyMood, { primary: string; secondary: string; glow: string }> = {
  idle: { primary: '#FFD93D', secondary: '#FF9500', glow: 'rgba(255,217,61,0.4)' },
  happy: { primary: '#6EE7B7', secondary: '#10B981', glow: 'rgba(110,231,183,0.4)' },
  sad: { primary: '#93C5FD', secondary: '#3B82F6', glow: 'rgba(147,197,253,0.4)' },
  focused: { primary: '#C4B5FD', secondary: '#8B5CF6', glow: 'rgba(196,181,253,0.4)' },
  thinking: { primary: '#FDA4AF', secondary: '#F43F5E', glow: 'rgba(253,164,175,0.4)' },
  excited: { primary: '#FCD34D', secondary: '#F59E0B', glow: 'rgba(252,211,77,0.5)' },
};

const MOOD_NUMBER_MAP: Record<BuddyMood, number> = {
  idle: 0,
  happy: 1,
  sad: 2,
  focused: 3,
  thinking: 4,
  excited: 5,
};

// Particle component for celebration effects
const Particle = memo(({ delay, startX, startY }: { delay: number; startX: number; startY: number }) => {
  const position = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const angle = Math.random() * Math.PI * 2;
    const distance = 40 + Math.random() * 60;
    const targetX = Math.cos(angle) * distance;
    const targetY = Math.sin(angle) * distance;

    Animated.sequence([
      Animated.delay(delay),
      Animated.parallel([
        Animated.timing(position, {
          toValue: { x: targetX, y: targetY },
          duration: 800,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.timing(opacity, { toValue: 1, duration: 100, useNativeDriver: true }),
          Animated.timing(opacity, { toValue: 0, duration: 700, useNativeDriver: true }),
        ]),
        Animated.sequence([
          Animated.timing(scale, { toValue: 1.5, duration: 200, useNativeDriver: true }),
          Animated.timing(scale, { toValue: 0, duration: 600, useNativeDriver: true }),
        ]),
      ]),
    ]).start();
  }, [delay, position, opacity, scale]);

  const emojis = ['✨', '⭐', '💫', '🌟'];
  const emoji = emojis[Math.floor(Math.random() * emojis.length)];

  return (
    <Animated.View
      style={[
        styles.particle,
        {
          left: startX,
          top: startY,
          opacity,
          transform: [{ translateX: position.x }, { translateY: position.y }, { scale }],
        },
      ]}
    >
      <Text style={styles.particleText}>{emoji}</Text>
    </Animated.View>
  );
});

Particle.displayName = 'Particle';

// Eye component with blinking
const Eye = memo(({ isLeft, mood, isBlinking, scale }: {
  isLeft: boolean;
  mood: BuddyMood;
  isBlinking: boolean;
  scale: number;
}) => {
  const blinkAnim = useRef(new Animated.Value(1)).current;
  const pupilX = useRef(new Animated.Value(0)).current;
  const pupilY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isBlinking) {
      Animated.sequence([
        Animated.timing(blinkAnim, { toValue: 0.1, duration: 80, useNativeDriver: true }),
        Animated.timing(blinkAnim, { toValue: 1, duration: 80, useNativeDriver: true }),
      ]).start();
    }
  }, [isBlinking, blinkAnim]);

  useEffect(() => {
    let targetX = 0, targetY = 0;
    switch (mood) {
      case 'thinking': targetX = isLeft ? -3 : 3; targetY = -3; break;
      case 'focused': targetY = 2; break;
      case 'sad': targetY = 3; break;
      case 'excited': targetX = isLeft ? 2 : -2; break;
    }
    Animated.parallel([
      Animated.spring(pupilX, { toValue: targetX, useNativeDriver: true, friction: 8 }),
      Animated.spring(pupilY, { toValue: targetY, useNativeDriver: true, friction: 8 }),
    ]).start();
  }, [mood, isLeft, pupilX, pupilY]);

  const eyeSize = 20 * scale;
  const pupilSize = 10 * scale;
  const highlightSize = 4 * scale;

  return (
    <View style={[styles.eye, { width: eyeSize, height: eyeSize, borderRadius: eyeSize / 2, marginHorizontal: 4 * scale }]}>
      <Animated.View style={[styles.eyeWhite, { width: eyeSize - 2, height: eyeSize - 2, borderRadius: (eyeSize - 2) / 2, transform: [{ scaleY: blinkAnim }] }]}>
        <Animated.View style={[styles.pupil, { width: pupilSize, height: pupilSize, borderRadius: pupilSize / 2, transform: [{ translateX: pupilX }, { translateY: pupilY }] }]}>
          <View style={[styles.highlight, { width: highlightSize, height: highlightSize, borderRadius: highlightSize / 2, right: 1, top: 1 }]} />
        </Animated.View>
      </Animated.View>
    </View>
  );
});

Eye.displayName = 'Eye';

const RiveBuddy: React.FC<RiveBuddyProps> = memo(({
  size = 'medium',
  onTap,
  style,
  showProgress = false,
  showStreak = false,
  pointerEvents = 'auto',
}) => {
  const riveRef = useRef<any>(null);
  const floatAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0.5)).current;
  const mouthAnim = useRef(new Animated.Value(0)).current;

  const [isBlinking, setIsBlinking] = React.useState(false);
  const [particles, setParticles] = React.useState<number[]>([]);
  const particleKey = useRef(0);
  const lastCelebrateTrigger = useRef(0);
  const lastTapTrigger = useRef(0);

  const mood = useBuddyStore((state) => state.mood);
  const progress = useBuddyStore((state) => state.progress);
  const streakCount = useBuddyStore((state) => state.streakCount);
  const celebrateTrigger = useBuddyStore((state) => state.celebrateTrigger);
  const tapTrigger = useBuddyStore((state) => state.tapTrigger);
  const triggerTap = useBuddyStore((state) => state.triggerTap);
  const registerController = useBuddyStore((state) => state.registerController);
  const unregisterController = useBuddyStore((state) => state.unregisterController);

  const { width, height, scale: sizeScale } = SIZE_MAP[size];
  const colors = MOOD_COLORS[mood];
  const idRef = useRef(`buddy-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`);

  // Register controller with store for direct state updates
  useEffect(() => {
    const id = idRef.current;
    registerController({
      id,
      setMood: (m: BuddyMood) => {
        // Update Rive if available
        if (riveRef.current) {
          try {
            riveRef.current.setInputState('BuddyMachine', 'mood', MOOD_NUMBER_MAP[m]);
          } catch (e) { /* ignore */ }
        }
      },
      setProgress: (p: number) => {
        if (riveRef.current) {
          try {
            riveRef.current.setInputState('BuddyMachine', 'progress', p);
          } catch (e) { /* ignore */ }
        }
      },
      setStreak: (s: number) => {
        if (riveRef.current) {
          try {
            riveRef.current.setInputState('BuddyMachine', 'streakCount', s);
          } catch (e) { /* ignore */ }
        }
      },
      triggerCelebrate: () => {
        if (riveRef.current) {
          try {
            riveRef.current.fireState('BuddyMachine', 'celebrate');
          } catch (e) { /* ignore */ }
        }
      },
      triggerThinking: (start: boolean) => {
        if (riveRef.current) {
          try {
            riveRef.current.setInputState('BuddyMachine', 'isThinking', start);
          } catch (e) { /* ignore */ }
        }
      },
    });
    return () => unregisterController(id);
  }, [registerController, unregisterController]);

  // Floating animation
  useEffect(() => {
    const float = Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, { toValue: 1, duration: 2000, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(floatAnim, { toValue: 0, duration: 2000, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ])
    );
    float.start();
    return () => float.stop();
  }, [floatAnim]);

  // Rotation animation
  useEffect(() => {
    const rotate = Animated.loop(
      Animated.sequence([
        Animated.timing(rotateAnim, { toValue: 1, duration: 3000, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(rotateAnim, { toValue: -1, duration: 3000, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(rotateAnim, { toValue: 0, duration: 3000, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ])
    );
    rotate.start();
    return () => rotate.stop();
  }, [rotateAnim]);

  // Glow animation
  useEffect(() => {
    const glow = Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, { toValue: 1, duration: 1500, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(glowAnim, { toValue: 0.5, duration: 1500, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ])
    );
    glow.start();
    return () => glow.stop();
  }, [glowAnim]);

  // Random blinking
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        setIsBlinking(true);
        setTimeout(() => setIsBlinking(false), 160);
      }
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Mouth animation based on mood
  useEffect(() => {
    let targetValue = 0.5;
    if (mood === 'happy' || mood === 'excited') targetValue = 1;
    else if (mood === 'sad') targetValue = -1;
    else if (mood === 'thinking') targetValue = 0.3;
    Animated.spring(mouthAnim, { toValue: targetValue, useNativeDriver: false, friction: 8 }).start();
  }, [mood, mouthAnim]);

  // Handle celebrate trigger
  useEffect(() => {
    if (celebrateTrigger > lastCelebrateTrigger.current) {
      lastCelebrateTrigger.current = celebrateTrigger;
      Animated.sequence([
        Animated.spring(scaleAnim, { toValue: 1.3, useNativeDriver: true, friction: 3 }),
        Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, friction: 5 }),
      ]).start();
      const newParticles = Array.from({ length: 8 }, () => particleKey.current++);
      setParticles((prev) => [...prev, ...newParticles]);
      setTimeout(() => setParticles((prev) => prev.filter((p) => !newParticles.includes(p))), 1000);
    }
  }, [celebrateTrigger, scaleAnim]);

  // Handle tap trigger
  useEffect(() => {
    if (tapTrigger > lastTapTrigger.current) {
      lastTapTrigger.current = tapTrigger;
      Animated.sequence([
        Animated.timing(scaleAnim, { toValue: 1.15, duration: 100, useNativeDriver: true }),
        Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, friction: 5 }),
      ]).start();
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 160);
    }
  }, [tapTrigger, scaleAnim]);

  const handleTap = useCallback(() => {
    triggerTap();
    onTap?.();
  }, [triggerTap, onTap]);

  const floatY = floatAnim.interpolate({ inputRange: [0, 1], outputRange: [0, -8 * sizeScale] });
  const rotate = rotateAnim.interpolate({ inputRange: [-1, 0, 1], outputRange: ['-3deg', '0deg', '3deg'] });
  const mouthWidth = 30 * sizeScale;
  const mouthHeight = mouthAnim.interpolate({ inputRange: [-1, 0, 0.5, 1], outputRange: [6 * sizeScale, 8 * sizeScale, 12 * sizeScale, 16 * sizeScale] });
  const bodySize = 70 * sizeScale;

  // Use Rive on native if available
  if (isRiveAvailable && Platform.OS !== 'web') {
    return (
      <View style={[{ pointerEvents }, style]} testID="rive-buddy">
        <Pressable onPress={handleTap} style={{ width, height }} disabled={pointerEvents === 'none'}>
          <Rive
            ref={riveRef}
            resourceName="learning_buddy"
            stateMachineName="BuddyMachine"
            autoplay={true}
            fit={Fit?.Contain}
            alignment={Alignment?.Center}
            style={styles.rive}
          />
          {showStreak && streakCount > 0 && size !== 'tiny' && (
            <View style={[styles.streakBadge, { right: -5, bottom: 5 }]}>
              <Text style={styles.streakText}>🔥{streakCount}</Text>
            </View>
          )}
        </Pressable>
      </View>
    );
  }

  // Animated placeholder fallback
  return (
    <View style={[{ pointerEvents }, style]} testID="rive-buddy-placeholder">
      <Pressable onPress={handleTap} style={[styles.container, { width, height }]} disabled={pointerEvents === 'none'}>
        {particles.map((key) => (
          <Particle key={key} delay={Math.random() * 100} startX={width / 2 - 10} startY={height / 2 - 10} />
        ))}

        <Animated.View style={[styles.glow, { width: bodySize * 1.8, height: bodySize * 1.8, borderRadius: bodySize, backgroundColor: colors.glow, opacity: glowAnim }]} />

        <Animated.View style={[styles.characterContainer, { transform: [{ translateY: floatY }, { rotate }, { scale: scaleAnim }] }]}>
          <View style={[styles.shadow, { width: bodySize * 0.8, height: 10 * sizeScale, borderRadius: bodySize * 0.4, bottom: -5 * sizeScale }]} />

          <View style={[styles.body, { width: bodySize, height: bodySize, borderRadius: bodySize / 2, backgroundColor: colors.primary, borderColor: colors.secondary, borderWidth: 3 * sizeScale }]}>
            <View style={styles.face}>
              <View style={styles.eyesContainer}>
                <Eye isLeft={true} mood={mood} isBlinking={isBlinking} scale={sizeScale} />
                <Eye isLeft={false} mood={mood} isBlinking={isBlinking} scale={sizeScale} />
              </View>
              <Animated.View style={[styles.mouth, { width: mouthWidth, height: mouthHeight, borderRadius: mouthWidth / 2, backgroundColor: mood === 'excited' ? '#FF6B6B' : '#4A4A4A', marginTop: 8 * sizeScale }]} />
            </View>
          </View>

          {mood === 'thinking' && (
            <View style={[styles.thinkingBubbles, { top: -15 * sizeScale, right: -10 * sizeScale }]}>
              <View style={[styles.thinkBubble, { width: 6 * sizeScale, height: 6 * sizeScale }]} />
              <View style={[styles.thinkBubble, { width: 10 * sizeScale, height: 10 * sizeScale, marginTop: -5 }]} />
              <View style={[styles.thinkBubble, { width: 14 * sizeScale, height: 14 * sizeScale, marginTop: -5 }]} />
            </View>
          )}

          {mood === 'excited' && (
            <>
              <Text style={[styles.floatingStar, { top: -10 * sizeScale, left: -15 * sizeScale }]}>✨</Text>
              <Text style={[styles.floatingStar, { top: -5 * sizeScale, right: -18 * sizeScale }]}>⭐</Text>
            </>
          )}
        </Animated.View>

        {showProgress && progress > 0 && size !== 'tiny' && (
          <View style={[styles.progressBadge, { bottom: 5 * sizeScale, left: 5 * sizeScale }]}>
            <Text style={styles.progressText}>{Math.round(progress)}%</Text>
          </View>
        )}

        {showStreak && streakCount > 0 && size !== 'tiny' && (
          <View style={[styles.streakBadge, { right: -5 * sizeScale, bottom: 5 * sizeScale }]}>
            <Text style={styles.streakText}>🔥{streakCount}</Text>
          </View>
        )}
      </Pressable>
    </View>
  );
});

RiveBuddy.displayName = 'RiveBuddy';

const styles = StyleSheet.create({
  container: { alignItems: 'center', justifyContent: 'center', position: 'relative' },
  rive: { width: '100%', height: '100%' },
  glow: { position: 'absolute' },
  characterContainer: { alignItems: 'center', justifyContent: 'center' },
  shadow: { position: 'absolute', backgroundColor: 'rgba(0,0,0,0.15)' },
  body: { alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.2, shadowRadius: 12, elevation: 8 },
  face: { alignItems: 'center', justifyContent: 'center' },
  eyesContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  eye: { backgroundColor: '#FFF', alignItems: 'center', justifyContent: 'center' },
  eyeWhite: { backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  pupil: { backgroundColor: '#2D3748', position: 'relative' },
  highlight: { position: 'absolute', backgroundColor: '#FFFFFF' },
  mouth: { overflow: 'hidden', alignItems: 'center' },
  thinkingBubbles: { position: 'absolute', alignItems: 'center' },
  thinkBubble: { backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: 50, borderWidth: 1, borderColor: 'rgba(0,0,0,0.1)' },
  floatingStar: { position: 'absolute', fontSize: 16 },
  progressBadge: { position: 'absolute', backgroundColor: '#FFFFFF', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  progressText: { fontSize: 11, fontWeight: '700', color: '#6B7280' },
  streakBadge: { position: 'absolute', backgroundColor: '#FFFFFF', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.15, shadowRadius: 4, elevation: 3 },
  streakText: { fontSize: 12, fontWeight: '700' },
  particle: { position: 'absolute', zIndex: 100 },
  particleText: { fontSize: 20 },
});

export default RiveBuddy;
