import React, { useRef, useEffect, memo } from 'react';
import { View, StyleSheet, Pressable, Animated, Easing, Text } from 'react-native';

/**
 * AIOwl Component - Premium Animated AI Assistant Character
 * 
 * A polished animated owl with:
 * - Smooth floating animation
 * - Expressive eyes that react to thinking state
 * - Glowing effect and particle animations
 * - Premium visual design
 */

export type OwlSize = 'small' | 'medium' | 'large';

interface AIOwlProps {
  size?: OwlSize;
  isThinking?: boolean;
  onTap?: () => void;
  style?: any;
}

const SIZE_MAP: Record<OwlSize, { width: number; height: number; scale: number }> = {
  small: { width: 100, height: 120, scale: 0.5 },
  medium: { width: 160, height: 180, scale: 0.8 },
  large: { width: 220, height: 250, scale: 1.0 },
};

const AIOwl: React.FC<AIOwlProps> = memo(({
  size = 'medium',
  isThinking = false,
  onTap,
  style,
}) => {
  // Animation refs
  const floatAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0.3)).current;
  const eyeAnim = useRef(new Animated.Value(0)).current;
  const thinkingAnim = useRef(new Animated.Value(0)).current;

  const [isBlinking, setIsBlinking] = React.useState(false);

  const { width, height, scale } = SIZE_MAP[size];

  // Continuous floating animation
  useEffect(() => {
    const float = Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: 1,
          duration: 2500,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 2500,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );
    float.start();
    return () => float.stop();
  }, [floatAnim]);

  // Subtle rotation
  useEffect(() => {
    const rotate = Animated.loop(
      Animated.sequence([
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 4000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: -1,
          duration: 4000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );
    rotate.start();
    return () => rotate.stop();
  }, [rotateAnim]);

  // Glow pulsing
  useEffect(() => {
    const glow = Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 0.6,
          duration: 2000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0.3,
          duration: 2000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );
    glow.start();
    return () => glow.stop();
  }, [glowAnim]);

  // Thinking animation
  useEffect(() => {
    if (isThinking) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(thinkingAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(thinkingAnim, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      ).start();

      // Eyes look up when thinking
      Animated.timing(eyeAnim, {
        toValue: -5,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      thinkingAnim.stopAnimation();
      Animated.timing(eyeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [isThinking, thinkingAnim, eyeAnim]);

  // Random blinking
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      if (Math.random() > 0.6 && !isThinking) {
        setIsBlinking(true);
        setTimeout(() => setIsBlinking(false), 150);
      }
    }, 2500);
    return () => clearInterval(blinkInterval);
  }, [isThinking]);

  // Handle tap
  const handleTap = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.1,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 5,
        useNativeDriver: true,
      }),
    ]).start();

    setIsBlinking(true);
    setTimeout(() => setIsBlinking(false), 150);

    onTap?.();
  };

  // Derived animated values
  const floatY = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -10 * scale],
  });

  const rotate = rotateAnim.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: ['-2deg', '0deg', '2deg'],
  });

  const thinkingScale = thinkingAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.03],
  });

  const bodyWidth = 80 * scale;
  const bodyHeight = 100 * scale;
  const headSize = 70 * scale;
  const eyeSize = 20 * scale;

  return (
    <View style={[styles.container, { width, height }, style]}>
      <Pressable onPress={handleTap}>
        {/* Glow effect */}
        <Animated.View
          style={[
            styles.glow,
            {
              width: bodyWidth * 2,
              height: bodyHeight * 1.5,
              borderRadius: bodyWidth,
              backgroundColor: isThinking ? 'rgba(251,191,36,0.3)' : 'rgba(139,92,246,0.2)',
              opacity: glowAnim,
            },
          ]}
        />

        {/* Main character container */}
        <Animated.View
          style={[
            styles.characterContainer,
            {
              transform: [
                { translateY: floatY },
                { rotate },
                { scale: Animated.multiply(scaleAnim, thinkingScale) },
              ],
            },
          ]}
        >
          {/* Shadow */}
          <View
            style={[
              styles.shadow,
              {
                width: bodyWidth * 0.6,
                height: 8 * scale,
                borderRadius: bodyWidth * 0.3,
                bottom: -5 * scale,
              },
            ]}
          />

          {/* Graduation cap */}
          <View style={[styles.graduationCap, { top: -15 * scale }]}>
            <View style={[styles.capTop, {
              width: 35 * scale,
              height: 8 * scale,
              borderRadius: 2,
            }]} />
            <View style={[styles.capBase, {
              width: 25 * scale,
              height: 12 * scale,
              marginTop: -2,
            }]} />
            <View style={[styles.capTassel, {
              width: 3 * scale,
              height: 15 * scale,
              left: 18 * scale,
              top: 4 * scale,
            }]} />
            <View style={[styles.tasselEnd, {
              width: 8 * scale,
              height: 8 * scale,
              left: 16 * scale,
              top: 16 * scale,
            }]} />
          </View>

          {/* Head/Body - Owl shape */}
          <View
            style={[
              styles.body,
              {
                width: bodyWidth,
                height: bodyHeight,
                borderRadius: bodyWidth / 2,
                backgroundColor: '#8B6914',
              },
            ]}
          >
            {/* Ear tufts */}
            <View style={[styles.earTuft, styles.leftEar, {
              width: 16 * scale,
              height: 25 * scale,
              top: -10 * scale,
              left: 8 * scale,
              transform: [{ rotate: '-20deg' }],
            }]} />
            <View style={[styles.earTuft, styles.rightEar, {
              width: 16 * scale,
              height: 25 * scale,
              top: -10 * scale,
              right: 8 * scale,
              transform: [{ rotate: '20deg' }],
            }]} />

            {/* Face circle */}
            <View style={[styles.faceCircle, {
              width: bodyWidth * 0.8,
              height: bodyWidth * 0.75,
              borderRadius: bodyWidth * 0.4,
              top: 10 * scale,
            }]}>
              {/* Eyes container */}
              <View style={styles.eyesContainer}>
                {/* Left eye */}
                <Animated.View style={[
                  styles.eyeContainer,
                  {
                    width: eyeSize,
                    height: eyeSize,
                    borderRadius: eyeSize / 2,
                    transform: [{ translateY: eyeAnim }],
                  }
                ]}>
                  <View style={[
                    styles.eyeWhite,
                    {
                      width: eyeSize - 2,
                      height: isBlinking ? 2 : eyeSize - 2,
                      borderRadius: eyeSize / 2,
                    }
                  ]}>
                    {!isBlinking && (
                      <View style={[styles.pupil, {
                        width: eyeSize * 0.5,
                        height: eyeSize * 0.5,
                        borderRadius: eyeSize * 0.25,
                      }]}>
                        <View style={[styles.highlight, {
                          width: 4 * scale,
                          height: 4 * scale,
                          borderRadius: 2 * scale,
                        }]} />
                      </View>
                    )}
                  </View>
                </Animated.View>

                {/* Right eye */}
                <Animated.View style={[
                  styles.eyeContainer,
                  {
                    width: eyeSize,
                    height: eyeSize,
                    borderRadius: eyeSize / 2,
                    marginLeft: 10 * scale,
                    transform: [{ translateY: eyeAnim }],
                  }
                ]}>
                  <View style={[
                    styles.eyeWhite,
                    {
                      width: eyeSize - 2,
                      height: isBlinking ? 2 : eyeSize - 2,
                      borderRadius: eyeSize / 2,
                    }
                  ]}>
                    {!isBlinking && (
                      <View style={[styles.pupil, {
                        width: eyeSize * 0.5,
                        height: eyeSize * 0.5,
                        borderRadius: eyeSize * 0.25,
                      }]}>
                        <View style={[styles.highlight, {
                          width: 4 * scale,
                          height: 4 * scale,
                          borderRadius: 2 * scale,
                        }]} />
                      </View>
                    )}
                  </View>
                </Animated.View>
              </View>

              {/* Beak */}
              <View style={[styles.beak, {
                width: 12 * scale,
                height: 10 * scale,
                marginTop: 5 * scale,
              }]} />
            </View>

            {/* Belly pattern */}
            <View style={[styles.belly, {
              width: bodyWidth * 0.55,
              height: bodyHeight * 0.4,
              borderRadius: bodyWidth * 0.27,
              bottom: 8 * scale,
            }]} />

            {/* Wings */}
            <View style={[styles.wing, styles.leftWing, {
              width: 20 * scale,
              height: 35 * scale,
              borderRadius: 10 * scale,
              left: -8 * scale,
              top: bodyHeight * 0.35,
            }]} />
            <View style={[styles.wing, styles.rightWing, {
              width: 20 * scale,
              height: 35 * scale,
              borderRadius: 10 * scale,
              right: -8 * scale,
              top: bodyHeight * 0.35,
            }]} />

            {/* Feet */}
            <View style={[styles.feet, { bottom: -12 * scale }]}>
              <View style={[styles.foot, { width: 18 * scale, height: 10 * scale }]} />
              <View style={[styles.foot, { width: 18 * scale, height: 10 * scale, marginLeft: 10 * scale }]} />
            </View>
          </View>

          {/* Thinking indicator */}
          {isThinking && (
            <View style={[styles.thinkingBubbles, { right: -20 * scale, top: 0 }]}>
              <Animated.View style={[
                styles.thinkBubble,
                {
                  width: 8 * scale,
                  height: 8 * scale,
                  opacity: thinkingAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.4, 1],
                  }),
                }
              ]} />
              <Animated.View style={[
                styles.thinkBubble,
                {
                  width: 12 * scale,
                  height: 12 * scale,
                  marginTop: -3,
                  opacity: thinkingAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.6, 1],
                  }),
                }
              ]} />
              <View style={[styles.thinkBubbleLarge, {
                width: 20 * scale,
                height: 20 * scale,
                marginTop: -4,
              }]}>
                <Text style={{ fontSize: 10 * scale }}>💭</Text>
              </View>
            </View>
          )}

          {/* Formula decoration */}
          <View style={[styles.formula, { top: -5 * scale, right: -25 * scale }]}>
            <Text style={[styles.formulaText, { fontSize: 10 * scale }]}>mc²</Text>
          </View>
        </Animated.View>
      </Pressable>
    </View>
  );
});

AIOwl.displayName = 'AIOwl';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  glow: {
    position: 'absolute',
  },
  characterContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  shadow: {
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,0.15)',
  },
  graduationCap: {
    position: 'absolute',
    alignItems: 'center',
    zIndex: 10,
  },
  capTop: {
    backgroundColor: '#1F2937',
  },
  capBase: {
    backgroundColor: '#374151',
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  capTassel: {
    position: 'absolute',
    backgroundColor: '#F59E0B',
  },
  tasselEnd: {
    position: 'absolute',
    backgroundColor: '#F59E0B',
    borderRadius: 4,
  },
  body: {
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 8,
  },
  earTuft: {
    position: 'absolute',
    backgroundColor: '#6B4F0A',
    borderRadius: 8,
  },
  leftEar: {},
  rightEar: {},
  faceCircle: {
    position: 'absolute',
    backgroundColor: '#D4A853',
    alignItems: 'center',
    paddingTop: 15,
  },
  eyesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  eyeContainer: {
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  eyeWhite: {
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pupil: {
    backgroundColor: '#2D3748',
    position: 'relative',
    alignItems: 'flex-end',
  },
  highlight: {
    position: 'absolute',
    backgroundColor: '#FFFFFF',
    top: 2,
    right: 2,
  },
  beak: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 10,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#F59E0B',
  },
  belly: {
    position: 'absolute',
    backgroundColor: '#E8D5A3',
  },
  wing: {
    position: 'absolute',
    backgroundColor: '#6B4F0A',
  },
  leftWing: {},
  rightWing: {},
  feet: {
    position: 'absolute',
    flexDirection: 'row',
  },
  foot: {
    backgroundColor: '#F59E0B',
    borderRadius: 5,
  },
  thinkingBubbles: {
    position: 'absolute',
    alignItems: 'center',
  },
  thinkBubble: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 50,
  },
  thinkBubbleLarge: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -2,
  },
  formula: {
    position: 'absolute',
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  formulaText: {
    fontWeight: '700',
    color: '#1F2937',
  },
});

export default AIOwl;
