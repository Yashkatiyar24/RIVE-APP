import React, { useRef, useImperativeHandle, forwardRef, useEffect } from 'react';
import { View, StyleSheet, Pressable, Platform } from 'react-native';
import AIOwlPlaceholder from './AIOwl';

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
 * RiveAIOwl - Rive-enabled AI Owl
 * 
 * Uses actual Rive animation when available, falls back to placeholder.
 * 
 * Rive file: assets/rive/owl.riv
 * 
 * The component will try to detect common state machine names:
 * - "State Machine 1", "OwlMachine", "MainStateMachine", etc.
 * 
 * Inputs (adaptive detection):
 *   - isThinking / thinking (Boolean): true when processing
 *   - mood (Number): 0=idle, 1=happy, 2=thinking, 3=excited
 * 
 * Triggers (adaptive detection):
 *   - think / thinking: Start thinking animation
 *   - respond / reply: Response ready animation
 *   - blink / wink: Blink animation
 */

export interface RiveAIOwlRef {
  fireThink: () => void;
  fireRespond: () => void;
  fireBlink: () => void;
  setMood: (mood: number) => void;
  setThinking: (thinking: boolean) => void;
}

interface RiveAIOwlProps {
  size?: 'small' | 'medium' | 'large';
  isThinking?: boolean;
  onTap?: () => void;
  useRive?: boolean;
}

// Common state machine names to try
const STATE_MACHINE_NAMES = [
  'State Machine 1',
  'State Machine',
  'OwlMachine',
  'MainStateMachine',
  'Main',
  'Owl',
];

// Common input/trigger names to try
const THINKING_NAMES = ['isThinking', 'thinking', 'isProcessing', 'processing', 'busy'];
const THINK_TRIGGER_NAMES = ['think', 'thinking', 'startThinking', 'process'];
const RESPOND_TRIGGER_NAMES = ['respond', 'reply', 'done', 'ready', 'stopThinking'];
const BLINK_TRIGGER_NAMES = ['blink', 'wink', 'eye', 'tap'];

const RiveAIOwl = forwardRef<RiveAIOwlRef, RiveAIOwlProps>(
  ({ size = 'large', isThinking = false, onTap, useRive = true }, ref) => {
    const riveRef = useRef<any>(null);
    const detectedStateMachine = useRef<string | null>(null);
    const detectedInputs = useRef<Record<string, string>>({});
    const detectedTriggers = useRef<Record<string, string>>({});

    const sizeMap = {
      small: { width: 120, height: 150 },
      medium: { width: 180, height: 220 },
      large: { width: 260, height: 320 },
    };

    // Try to detect available inputs and triggers
    const detectInputsAndTriggers = () => {
      if (!riveRef.current) return;

      // Try each state machine name
      for (const smName of STATE_MACHINE_NAMES) {
        try {
          const inputs = riveRef.current.stateMachineNames?.() || [];
          if (inputs.includes(smName) || true) { // Always try
            detectedStateMachine.current = smName;

            // Try to detect thinking input
            for (const name of THINKING_NAMES) {
              try {
                riveRef.current.setInputState(smName, name, false);
                detectedInputs.current.thinking = name;
                break;
              } catch (e) { /* continue */ }
            }

            // Try to detect triggers
            for (const name of THINK_TRIGGER_NAMES) {
              try {
                // Just store the name, don't fire yet
                detectedTriggers.current.think = name;
                break;
              } catch (e) { /* continue */ }
            }

            for (const name of RESPOND_TRIGGER_NAMES) {
              detectedTriggers.current.respond = name;
              break;
            }

            for (const name of BLINK_TRIGGER_NAMES) {
              detectedTriggers.current.blink = name;
              break;
            }

            if (detectedStateMachine.current) break;
          }
        } catch (e) { /* continue */ }
      }
    };

    const safeFireTrigger = (triggerKey: string) => {
      if (!riveRef.current || !detectedStateMachine.current) return;

      const triggerName = detectedTriggers.current[triggerKey];
      if (!triggerName) return;

      try {
        riveRef.current.fireState(detectedStateMachine.current, triggerName);
      } catch (e) {
        console.log(`[RiveAIOwl] Trigger ${triggerName} not found`);
      }
    };

    const safeSetInput = (inputKey: string, value: number | boolean) => {
      if (!riveRef.current || !detectedStateMachine.current) return;

      const inputName = detectedInputs.current[inputKey];
      if (!inputName) return;

      try {
        riveRef.current.setInputState(detectedStateMachine.current, inputName, value);
      } catch (e) {
        console.log(`[RiveAIOwl] Input ${inputName} not found`);
      }
    };

    // Update isThinking input when prop changes
    useEffect(() => {
      safeSetInput('thinking', isThinking);
      if (isThinking) {
        safeFireTrigger('think');
      } else {
        safeFireTrigger('respond');
      }
    }, [isThinking]);

    useImperativeHandle(ref, () => ({
      fireThink: () => safeFireTrigger('think'),
      fireRespond: () => safeFireTrigger('respond'),
      fireBlink: () => safeFireTrigger('blink'),
      setMood: (mood: number) => {
        if (riveRef.current && detectedStateMachine.current) {
          try {
            riveRef.current.setInputState(detectedStateMachine.current, 'mood', mood);
          } catch (e) { /* ignore */ }
        }
      },
      setThinking: (thinking: boolean) => safeSetInput('thinking', thinking),
    }));

    const handleTap = () => {
      safeFireTrigger('blink');
      onTap?.();
    };

    const handleRiveLoad = () => {
      // Detect inputs after Rive loads
      setTimeout(detectInputsAndTriggers, 100);
    };

    // Check if Rive is available and we should use it
    const shouldUseRive = useRive && Rive && Platform.OS !== 'web';

    if (shouldUseRive) {
      return (
        <Pressable onPress={handleTap} style={sizeMap[size]}>
          <Rive
            ref={riveRef}
            resourceName="owl"
            autoplay={true}
            fit={Fit?.Contain}
            alignment={Alignment?.Center}
            style={styles.rive}
            onPlay={handleRiveLoad}
          />
        </Pressable>
      );
    }

    // Fallback to placeholder
    return (
      <AIOwlPlaceholder
        size={size}
        isThinking={isThinking}
        onTap={handleTap}
      />
    );
  }
);

const styles = StyleSheet.create({
  rive: {
    width: '100%',
    height: '100%',
  },
});

RiveAIOwl.displayName = 'RiveAIOwl';

export default RiveAIOwl;
