import React, { useRef, useImperativeHandle, forwardRef } from 'react';
import { StyleSheet, Pressable, Platform } from 'react-native';
import CatProfessor, { CatProfessorRef } from './CatProfessor';

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
 * RiveCatProfessor - Rive-enabled Cat Professor
 * 
 * Uses actual Rive animation when available, falls back to premium animated placeholder.
 * 
 * Rive file: assets/rive/cat_professor.riv
 * State Machine: "CatMachine"
 * 
 * Inputs:
 *   - mood (Number): 0=idle, 1=happy, 2=teaching, 3=excited
 *   - isTeaching (Boolean): true when explaining
 * 
 * Triggers:
 *   - wave: Professor waves
 *   - explain: Starts explanation animation
 *   - celebrate: Celebration animation
 */

export interface RiveCatProfessorRef {
  fireWave: () => void;
  fireExplain: () => void;
  fireCelebrate: () => void;
  setMood: (mood: number) => void;
  setTeaching: (teaching: boolean) => void;
}

interface RiveCatProfessorProps {
  size?: 'small' | 'medium' | 'large';
  isTeaching?: boolean;
  onTap?: () => void;
  useRive?: boolean;
}

const RiveCatProfessor = forwardRef<RiveCatProfessorRef, RiveCatProfessorProps>(
  ({ size = 'large', isTeaching = false, onTap, useRive = true }, ref) => {
    const riveRef = useRef<any>(null);
    const placeholderRef = useRef<CatProfessorRef>(null);
    const stateMachineName = 'CatMachine';

    const sizeMap = {
      small: { width: 120, height: 150 },
      medium: { width: 180, height: 220 },
      large: { width: 240, height: 300 },
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

    useImperativeHandle(ref, () => ({
      fireWave: () => {
        safeFireTrigger('wave');
        placeholderRef.current?.fireWave();
      },
      fireExplain: () => {
        safeFireTrigger('explain');
      },
      fireCelebrate: () => {
        safeFireTrigger('celebrate');
        placeholderRef.current?.fireCelebrate();
      },
      setMood: (mood: number) => {
        safeSetInput('mood', mood);
        const moodMap: Record<number, 'idle' | 'teaching' | 'happy' | 'thinking'> = {
          0: 'idle',
          1: 'happy',
          2: 'teaching',
          3: 'happy',
        };
        placeholderRef.current?.setMood(moodMap[mood] || 'idle');
      },
      setTeaching: (teaching: boolean) => {
        safeSetInput('isTeaching', teaching);
      },
    }));

    const handleTap = () => {
      safeFireTrigger('wave');
      placeholderRef.current?.fireWave();
      onTap?.();
    };

    // Check if Rive is available and we should use it
    const shouldUseRive = useRive && Rive && Platform.OS !== 'web';

    if (shouldUseRive) {
      return (
        <Pressable onPress={handleTap} style={sizeMap[size]}>
          <Rive
            ref={riveRef}
            resourceName="cat_professor"
            stateMachineName={stateMachineName}
            fit={Fit?.Contain}
            alignment={Alignment?.Center}
            style={styles.rive}
          />
        </Pressable>
      );
    }

    // Fallback to premium animated placeholder
    return (
      <CatProfessor
        ref={placeholderRef}
        size={size}
        isTeaching={isTeaching}
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

RiveCatProfessor.displayName = 'RiveCatProfessor';

export default RiveCatProfessor;
