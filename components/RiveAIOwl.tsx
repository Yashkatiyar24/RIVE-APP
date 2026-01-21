import React, { useRef, useImperativeHandle, forwardRef } from 'react';
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
 * Rive file: assets/rive/ai_owl.riv
 * State Machine: "OwlMachine"
 * 
 * Inputs:
 *   - mood (Number): 0=idle, 1=happy, 2=thinking, 3=excited
 *   - isThinking (Boolean): true when processing
 * 
 * Triggers:
 *   - think: Start thinking animation
 *   - respond: Response ready animation
 *   - blink: Blink animation
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

const RiveAIOwl = forwardRef<RiveAIOwlRef, RiveAIOwlProps>(
  ({ size = 'large', isThinking = false, onTap, useRive = true }, ref) => {
    const riveRef = useRef<any>(null);
    const stateMachineName = 'OwlMachine';

    const sizeMap = {
      small: { width: 120, height: 150 },
      medium: { width: 180, height: 220 },
      large: { width: 260, height: 320 },
    };

    const safeFireTrigger = (triggerName: string) => {
      if (riveRef.current) {
        try {
          riveRef.current.fireState(stateMachineName, triggerName);
        } catch (e) {
          console.log(`Trigger ${triggerName} not found`);
        }
      }
    };

    const safeSetInput = (inputName: string, value: number | boolean) => {
      if (riveRef.current) {
        try {
          riveRef.current.setInputState(stateMachineName, inputName, value);
        } catch (e) {
          console.log(`Input ${inputName} not found`);
        }
      }
    };

    // Update isThinking input when prop changes
    React.useEffect(() => {
      safeSetInput('isThinking', isThinking);
      if (isThinking) {
        safeFireTrigger('think');
      }
    }, [isThinking]);

    useImperativeHandle(ref, () => ({
      fireThink: () => safeFireTrigger('think'),
      fireRespond: () => safeFireTrigger('respond'),
      fireBlink: () => safeFireTrigger('blink'),
      setMood: (mood: number) => safeSetInput('mood', mood),
      setThinking: (thinking: boolean) => safeSetInput('isThinking', thinking),
    }));

    const handleTap = () => {
      safeFireTrigger('blink');
      onTap?.();
    };

    // Check if Rive is available and we should use it
    const shouldUseRive = useRive && Rive && Platform.OS !== 'web';

    if (shouldUseRive) {
      return (
        <Pressable onPress={handleTap} style={sizeMap[size]}>
          <Rive
            ref={riveRef}
            resourceName="ai_owl"
            stateMachineName={stateMachineName}
            fit={Fit?.Contain}
            alignment={Alignment?.Center}
            style={styles.rive}
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
