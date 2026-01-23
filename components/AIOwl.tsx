import React from 'react';
import { View, StyleSheet, Platform, Pressable } from 'react-native';

// Platform-specific Rive imports
let RiveNative: any = null;
let FitNative: any = null;
let AlignmentNative: any = null;

// Import Rive for React Native (native platforms only)
if (Platform.OS !== 'web') {
  try {
    const RiveModule = require('rive-react-native');
    RiveNative = RiveModule.default;
    FitNative = RiveModule.Fit;
    AlignmentNative = RiveModule.Alignment;
  } catch (e) {
    console.log('rive-react-native not available');
  }
}

interface AIOwlProps {
  size?: 'small' | 'medium' | 'large';
  isThinking?: boolean;
  onTap?: () => void;
}

/**
 * AIOwl Component - Native Version
 * 
 * Uses the actual owl.riv Rive animation file.
 * For web, use AIOwlWeb component below.
 */
function AIOwlNative({ size = 'large', isThinking = false, onTap }: AIOwlProps) {
  const sizeMap = {
    small: { width: 120, height: 150 },
    medium: { width: 200, height: 250 },
    large: { width: 280, height: 350 },
  };

  if (!RiveNative) {
    return (
      <View style={[styles.container, sizeMap[size], styles.placeholder]}>
        <View style={styles.placeholderText}>🦉</View>
      </View>
    );
  }

  return (
    <Pressable onPress={onTap} style={[styles.container, sizeMap[size]]}>
      <RiveNative
        resourceName="owl"
        autoplay={true}
        fit={FitNative?.Contain}
        alignment={AlignmentNative?.Center}
        style={styles.rive}
      />
    </Pressable>
  );
}

/**
 * AIOwl Component - Web Version
 * 
 * Uses @rive-app/react-canvas for web support.
 */
function AIOwlWeb({ size = 'large', isThinking = false, onTap }: AIOwlProps) {
  // Dynamic import to avoid SSR issues
  const [RiveComponent, setRiveComponent] = React.useState<any>(null);
  const [useRive, setUseRive] = React.useState<any>(null);

  const sizeMap = {
    small: { width: 120, height: 150 },
    medium: { width: 200, height: 250 },
    large: { width: 280, height: 350 },
  };

  React.useEffect(() => {
    // Dynamically import Rive for web
    import('@rive-app/react-canvas')
      .then((module) => {
        setRiveComponent(() => module.default);
        setUseRive(() => module.useRive);
      })
      .catch((e) => {
        console.log('Failed to load @rive-app/react-canvas:', e);
      });
  }, []);

  if (!RiveComponent) {
    // Loading state
    return (
      <View style={[styles.container, sizeMap[size], styles.placeholder]}>
        <View style={styles.loadingContainer}>
          <View style={styles.loadingSpinner} />
        </View>
      </View>
    );
  }

  return (
    <div
      onClick={onTap}
      style={{
        ...sizeMap[size],
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <RiveComponent
        src={require('../assets/rive/owl.riv')}
        autoplay={true}
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
}

/**
 * AIOwl - Main Export
 * 
 * Automatically selects the correct implementation based on platform.
 */
export default function AIOwl(props: AIOwlProps) {
  if (Platform.OS === 'web') {
    return <AIOwlWeb {...props} />;
  }
  return <AIOwlNative {...props} />;
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  rive: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    borderRadius: 24,
  },
  placeholderText: {
    fontSize: 60,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingSpinner: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: '#8B5CF6',
    borderTopColor: 'transparent',
  },
});
