import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { View, StyleSheet, Pressable, Text } from 'react-native';
import {
  Alignment,
  Fit,
  Layout,
  RiveRef,
  useRive,
} from '@rive-app/react-native';
import { useBuddyStore, BuddyMood } from '../store/buddyStore';

export type BuddySize = 'tiny' | 'small' | 'medium' | 'large' | 'hero';

type BuddyInputMap = {
  progress?: any;
  streakCount?: any;
  moodNumber?: any;
  moodBooleans: Record<string, any>;
  moodTriggers: Record<string, any>;
  celebrate?: any;
  thinking?: any;
};

interface RiveBuddyProps {
  size?: BuddySize;
  onTap?: () => void;
  style?: any;
  showProgress?: boolean;
  showStreak?: boolean;
  pointerEvents?: 'auto' | 'none' | 'box-none' | 'box-only';
}

const SIZE_MAP: Record<BuddySize, { width: number; height: number }> = {
  tiny: { width: 56, height: 56 },
  small: { width: 84, height: 84 },
  medium: { width: 120, height: 120 },
  large: { width: 180, height: 180 },
  hero: { width: 220, height: 220 },
};

const MOOD_VALUE_MAP: Record<BuddyMood, number> = {
  idle: 0,
  happy: 1,
  sad: 2,
  focused: 3,
  thinking: 4,
  excited: 5,
};

// Public demo animation hosted by Rive.
// This gives you a beautiful idle animation out of the box.
// To use your own file, change this URL or switch back to a local `require`.
const RIVE_URL = 'https://cdn.rive.app/animations/vehicles.riv';
const DEFAULT_STATE_MACHINE = 'BuddyMachine';

const RiveBuddy: React.FC<RiveBuddyProps> = ({
  size = 'medium',
  onTap,
  style,
  showProgress = false,
  showStreak = false,
  pointerEvents = 'auto',
}) => {
  const idRef = useRef(`buddy-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`);
  const inputs = useRef<BuddyInputMap>({
    moodBooleans: {},
    moodTriggers: {},
  });
  const warned = useRef<Set<string>>(new Set());

  const progress = useBuddyStore((state) => state.progress);
  const streakCount = useBuddyStore((state) => state.streakCount);
  const registerController = useBuddyStore((state) => state.registerController);
  const unregisterController = useBuddyStore((state) => state.unregisterController);

  const { rive, RiveComponent } = useRive({
    url: RIVE_URL,
    autoplay: true,
    layout: new Layout({
      fit: Fit.Contain,
      alignment: Alignment.Center,
    }),
  });

  const detectInputType = (input: any): 'trigger' | 'boolean' | 'number' | undefined => {
    if (!input) return undefined;
    const typeVal = (input as any).type;
    if (typeof (input as any).fire === 'function') return 'trigger';
    if (typeof (input as any).value === 'boolean') return 'boolean';
    if (typeof (input as any).value === 'number') return 'number';
    if (typeof typeVal === 'string') {
      const lower = typeVal.toLowerCase();
      if (lower.includes('trigger')) return 'trigger';
      if (lower.includes('bool')) return 'boolean';
      if (lower.includes('number')) return 'number';
    }
    return undefined;
  };

  const findInput = useCallback(
    (nameCandidates: string[], type: 'trigger' | 'boolean' | 'number') => {
      const list = rive?.stateMachineInputs(DEFAULT_STATE_MACHINE) || [];
      const lowerCandidates = nameCandidates.map((c) => c.toLowerCase());
      return list.find((input: any) => {
        const detected = detectInputType(input);
        if (detected !== type) return false;
        const name = (input?.name || '').toLowerCase();
        return lowerCandidates.some((c) => name === c || name.includes(c));
      });
    },
    [rive],
  );

  const cacheInputs = useCallback(() => {
    const map: BuddyInputMap = {
      moodBooleans: {},
      moodTriggers: {},
    };

    map.progress = findInput(['progress'], 'number');
    map.streakCount = findInput(['streak', 'streakcount'], 'number');

    const moodNumber = findInput(['mood'], 'number');
    if (moodNumber) {
      map.moodNumber = moodNumber;
    } else {
      const happyBool = findInput(['ishappy', 'happy'], 'boolean');
      const sadBool = findInput(['issad', 'sad'], 'boolean');
      const focusedBool = findInput(['isfocused', 'focus', 'focused'], 'boolean');
      const thinkingBool = findInput(['isthinking', 'thinking'], 'boolean');
      if (happyBool) map.moodBooleans.happy = happyBool;
      if (sadBool) map.moodBooleans.sad = sadBool;
      if (focusedBool) map.moodBooleans.focused = focusedBool;
      if (thinkingBool) map.moodBooleans.thinking = thinkingBool;

      const happyTrigger = findInput(['happy'], 'trigger');
      const sadTrigger = findInput(['sad'], 'trigger');
      const focusTrigger = findInput(['focus', 'focused'], 'trigger');
      const thinkingTrigger = findInput(['thinking'], 'trigger');
      if (happyTrigger) map.moodTriggers.happy = happyTrigger;
      if (sadTrigger) map.moodTriggers.sad = sadTrigger;
      if (focusTrigger) map.moodTriggers.focused = focusTrigger;
      if (thinkingTrigger) map.moodTriggers.thinking = thinkingTrigger;
    }

    map.celebrate = findInput(['celebrate', 'tapcelebrate', 'party'], 'trigger');
    map.thinking = findInput(['thinking'], 'trigger') || findInput(['thinking'], 'boolean');

    inputs.current = map;
  }, [findInput]);

  const warnMissing = (key: string) => {
    if (!warned.current.has(key)) {
      warned.current.add(key);
      console.warn(`[RiveBuddy] Missing Rive input: ${key}`);
    }
  };

  const applyMood = useCallback((mood: BuddyMood) => {
    const map = inputs.current;
    const numericValue = MOOD_VALUE_MAP[mood] ?? 0;

    if (map.moodNumber) {
      map.moodNumber.value = numericValue;
      return;
    }

    const boolEntries = Object.entries(map.moodBooleans);
    if (boolEntries.length) {
      boolEntries.forEach(([name, input]) => {
        input.value = name === mood;
      });
      return;
    }

    const trigger = map.moodTriggers[mood];
    if (trigger?.fire) {
      trigger.fire();
      return;
    }

    warnMissing('mood');
  }, []);

  const applyProgress = useCallback((value: number) => {
    const map = inputs.current;
    if (map.progress) {
      map.progress.value = Math.max(0, Math.min(100, value));
    } else {
      warnMissing('progress');
    }
  }, []);

  const applyStreak = useCallback((value: number) => {
    const map = inputs.current;
    if (map.streakCount) {
      map.streakCount.value = Math.max(0, value);
    } else {
      warnMissing('streakCount');
    }
  }, []);

  const applyCelebrate = useCallback(() => {
    const map = inputs.current;
    if (map.celebrate?.fire) {
      map.celebrate.fire();
    } else if (map.celebrate) {
      map.celebrate.value = true;
      setTimeout(() => (map.celebrate.value = false), 200);
    } else {
      warnMissing('celebrate');
    }
  }, []);

  const applyThinking = useCallback((start: boolean) => {
    const map = inputs.current;
    if (!map.thinking) {
      warnMissing('thinking');
      return;
    }

    if (typeof map.thinking.value === 'boolean') {
      map.thinking.value = start;
    } else if (map.thinking.fire) {
      map.thinking.fire();
    }
  }, []);

  useEffect(() => {
    if (!rive) return;
    cacheInputs();
    rive.play();

    const controllerId = idRef.current;
    registerController({
      id: controllerId,
      setMood: applyMood,
      setProgress: applyProgress,
      setStreak: applyStreak,
      triggerCelebrate: applyCelebrate,
      triggerThinking: applyThinking,
    });

    const snapshot = useBuddyStore.getState();
    applyMood(snapshot.mood);
    applyProgress(snapshot.progress);
    applyStreak(snapshot.streakCount);

    return () => unregisterController(controllerId);
  }, [rive, cacheInputs, registerController, unregisterController, applyMood, applyProgress, applyStreak, applyCelebrate, applyThinking]);

  const { width, height } = SIZE_MAP[size];

  return (
    <View style={[styles.wrapper, style]} pointerEvents={pointerEvents}>
      <Pressable
        disabled={pointerEvents === 'none'}
        onPress={onTap}
        style={[styles.card, { width, height }]}
        hitSlop={10}
      >
        <View style={styles.riveShadow} />
        <View style={styles.riveContainer}>
          {RiveComponent ? (
            <RiveComponent style={styles.rive} />
          ) : (
            <View style={styles.placeholder}>
              <Text style={styles.placeholderText}>Loading Buddy...</Text>
            </View>
          )}
        </View>

        {(showProgress || showStreak) && (
          <View style={styles.badges}>
            {showProgress && (
              <View style={styles.badge}>
                <Text style={styles.badgeLabel}>Progress</Text>
                <Text style={styles.badgeValue}>{Math.round(progress)}%</Text>
              </View>
            )}
            {showStreak && (
              <View style={styles.badge}>
                <Text style={styles.badgeLabel}>Streak</Text>
                <Text style={styles.badgeValue}>🔥 {streakCount}</Text>
              </View>
            )}
          </View>
        )}
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    borderRadius: 24,
    overflow: 'hidden',
  },
  riveShadow: {
    position: 'absolute',
    bottom: 6,
    width: '100%',
    height: 12,
    backgroundColor: 'rgba(0,0,0,0.12)',
    borderRadius: 12,
    zIndex: 1,
  },
  riveContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  rive: {
    width: '100%',
    height: '100%',
  },
  badges: {
    position: 'absolute',
    bottom: 6,
    left: 8,
    right: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 6,
    zIndex: 3,
    pointerEvents: 'none',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.85)',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  badgeLabel: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '600',
  },
  badgeValue: {
    fontSize: 12,
    color: '#111827',
    fontWeight: '700',
  },
  placeholder: {
    flex: 1,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '600',
  },
});

export default RiveBuddy;
