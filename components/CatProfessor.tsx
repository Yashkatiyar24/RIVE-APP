import React, { useRef, useEffect, forwardRef, useImperativeHandle, memo } from 'react';
import { View, StyleSheet, Pressable, Platform, Animated, Easing, Text } from 'react-native';

/**
 * CatProfessor Component - Premium Animated Teacher Character
 * 
 * A polished animated cat professor with:
 * - Smooth floating animation
 * - Expressive eyes and whiskers
 * - Teaching stick for pointing
 * - Premium visual design
 */

export type CatSize = 'small' | 'medium' | 'large';

export interface CatProfessorRef {
  fireWave: () => void;
  fireCelebrate: () => void;
  setMood: (mood: 'idle' | 'teaching' | 'happy' | 'thinking') => void;
}

interface CatProfessorProps {
  size?: CatSize;
  isTeaching?: boolean;
  onTap?: () => void;
  style?: any;
}

const SIZE_MAP: Record<CatSize, { width: number; height: number; scale: number }> = {
  small: { width: 100, height: 130, scale: 0.5 },
  medium: { width: 160, height: 200, scale: 0.75 },
  large: { width: 220, height: 280, scale: 1.0 },
};

const CatProfessor = memo(forwardRef<CatProfessorRef, CatProfessorProps>(({
  size = 'medium',
  isTeaching = false,
  onTap,
  style,
}, ref) => {
  // Animation refs
  const floatAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const stickAnim = useRef(new Animated.Value(0)).current;
  const tailAnim = useRef(new Animated.Value(0)).current;
  const earAnim = useRef(new Animated.Value(0)).current;
  const eyeAnim = useRef(new Animated.Value(0)).current;
  const waveAnim = useRef(new Animated.Value(0)).current;

  const [isBlinking, setIsBlinking] = React.useState(false);
  const [mood, setMoodState] = React.useState<'idle' | 'teaching' | 'happy' | 'thinking'>('idle');
  const [particles, setParticles] = React.useState<number[]>([]);
  const particleKey = useRef(0);

  const { width, height, scale } = SIZE_MAP[size];

  // Expose methods via ref
  useImperativeHandle(ref, () => ({
    fireWave: () => {
      Animated.sequence([
        Animated.timing(waveAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(waveAnim, {
          toValue: -1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(waveAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(waveAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    },
    fireCelebrate: () => {
      // Bounce animation
      Animated.sequence([
        Animated.spring(scaleAnim, {
          toValue: 1.2,
          useNativeDriver: true,
          friction: 3,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          friction: 5,
        }),
      ]).start();

      // Spawn particles
      const newParticles = Array.from({ length: 6 }, () => particleKey.current++);
      setParticles((prev) => [...prev, ...newParticles]);
      setTimeout(() => {
        setParticles((prev) => prev.filter((p) => !newParticles.includes(p)));
      }, 1000);
    },
    setMood: (newMood) => {
      setMoodState(newMood);
    },
  }));

  // Continuous floating animation
  useEffect(() => {
    const float = Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: 1,
          duration: 2200,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 2200,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );
    float.start();
    return () => float.stop();
  }, [floatAnim]);

  // Tail wagging animation
  useEffect(() => {
    const tail = Animated.loop(
      Animated.sequence([
        Animated.timing(tailAnim, {
          toValue: 1,
          duration: 600,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(tailAnim, {
          toValue: -1,
          duration: 600,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );
    tail.start();
    return () => tail.stop();
  }, [tailAnim]);

  // Teaching stick animation
  useEffect(() => {
    if (isTeaching) {
      const point = Animated.loop(
        Animated.sequence([
          Animated.timing(stickAnim, {
            toValue: 1,
            duration: 800,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(stickAnim, {
            toValue: 0,
            duration: 800,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ])
      );
      point.start();
      return () => point.stop();
    }
  }, [isTeaching, stickAnim]);

  // Random ear twitch
  useEffect(() => {
    const earInterval = setInterval(() => {
      if (Math.random() > 0.7) {
        Animated.sequence([
          Animated.timing(earAnim, {
            toValue: 1,
            duration: 100,
            useNativeDriver: true,
          }),
          Animated.timing(earAnim, {
            toValue: 0,
            duration: 100,
            useNativeDriver: true,
          }),
        ]).start();
      }
    }, 3000);
    return () => clearInterval(earInterval);
  }, [earAnim]);

  // Random blinking
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      if (Math.random() > 0.6) {
        setIsBlinking(true);
        setTimeout(() => setIsBlinking(false), 150);
      }
    }, 2500);
    return () => clearInterval(blinkInterval);
  }, []);

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
    outputRange: [0, -8 * scale],
  });

  const tailRotate = tailAnim.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: ['-15deg', '0deg', '15deg'],
  });

  const stickRotate = stickAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['35deg', '25deg'],
  });

  const earTwitch = earAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '10deg'],
  });

  const waveRotate = waveAnim.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: ['-20deg', '0deg', '20deg'],
  });

  const bodyWidth = 65 * scale;
  const bodyHeight = 80 * scale;
  const headSize = 55 * scale;

  return (
    <View style={[styles.container, { width, height }, style]}>
      <Pressable onPress={handleTap}>
        {/* Particles */}
        {particles.map((key) => (
          <Particle key={key} scale={scale} />
        ))}

        {/* Main character container */}
        <Animated.View
          style={[
            styles.characterContainer,
            {
              transform: [
                { translateY: floatY },
                { scale: scaleAnim },
              ],
            },
          ]}
        >
          {/* Shadow */}
          <View
            style={[
              styles.shadow,
              {
                width: bodyWidth * 0.7,
                height: 8 * scale,
                borderRadius: bodyWidth * 0.35,
                bottom: -5 * scale,
              },
            ]}
          />

          {/* Tail */}
          <Animated.View
            style={[
              styles.tail,
              {
                width: 12 * scale,
                height: 40 * scale,
                borderRadius: 6 * scale,
                right: -10 * scale,
                bottom: 30 * scale,
                transform: [{ rotate: tailRotate }],
              },
            ]}
          />

          {/* Body (shirt/overall) */}
          <View
            style={[
              styles.body,
              {
                width: bodyWidth,
                height: bodyHeight,
                borderRadius: bodyWidth / 3,
                backgroundColor: '#4A90D9', // Blue shirt
              },
            ]}
          >
            {/* Overall straps */}
            <View style={[styles.strap, styles.leftStrap, {
              width: 8 * scale,
              height: 25 * scale,
              left: 10 * scale,
              top: 5 * scale,
            }]} />
            <View style={[styles.strap, styles.rightStrap, {
              width: 8 * scale,
              height: 25 * scale,
              right: 10 * scale,
              top: 5 * scale,
            }]} />

            {/* Pocket */}
            <View style={[styles.pocket, {
              width: 20 * scale,
              height: 15 * scale,
              borderRadius: 4 * scale,
              bottom: 15 * scale,
            }]} />
          </View>

          {/* Teaching stick */}
          {isTeaching && (
            <Animated.View
              style={[
                styles.teachingStick,
                {
                  width: 4 * scale,
                  height: 60 * scale,
                  right: -25 * scale,
                  top: 40 * scale,
                  transform: [{ rotate: stickRotate }],
                },
              ]}
            />
          )}

          {/* Head */}
          <View
            style={[
              styles.head,
              {
                width: headSize,
                height: headSize,
                borderRadius: headSize / 2,
                top: -headSize * 0.3,
              },
            ]}
          >
            {/* Ears */}
            <Animated.View
              style={[
                styles.ear,
                styles.leftEar,
                {
                  width: 18 * scale,
                  height: 22 * scale,
                  top: -8 * scale,
                  left: 2 * scale,
                  transform: [{ rotate: earTwitch }],
                }
              ]}
            >
              <View style={[styles.innerEar, {
                width: 10 * scale,
                height: 12 * scale,
              }]} />
            </Animated.View>
            <Animated.View
              style={[
                styles.ear,
                styles.rightEar,
                {
                  width: 18 * scale,
                  height: 22 * scale,
                  top: -8 * scale,
                  right: 2 * scale,
                  transform: [{ rotate: Animated.multiply(earTwitch, -1) }],
                }
              ]}
            >
              <View style={[styles.innerEar, {
                width: 10 * scale,
                height: 12 * scale,
              }]} />
            </Animated.View>

            {/* Face */}
            <View style={styles.face}>
              {/* Eyes */}
              <View style={styles.eyesContainer}>
                <View style={[styles.eye, {
                  width: 14 * scale,
                  height: isBlinking ? 2 : 14 * scale,
                  borderRadius: 7 * scale,
                }]}>
                  {!isBlinking && (
                    <View style={[styles.pupil, {
                      width: 6 * scale,
                      height: 6 * scale,
                      borderRadius: 3 * scale,
                    }]}>
                      <View style={[styles.highlight, {
                        width: 3 * scale,
                        height: 3 * scale,
                      }]} />
                    </View>
                  )}
                </View>
                <View style={[styles.eye, {
                  width: 14 * scale,
                  height: isBlinking ? 2 : 14 * scale,
                  borderRadius: 7 * scale,
                  marginLeft: 12 * scale,
                }]}>
                  {!isBlinking && (
                    <View style={[styles.pupil, {
                      width: 6 * scale,
                      height: 6 * scale,
                      borderRadius: 3 * scale,
                    }]}>
                      <View style={[styles.highlight, {
                        width: 3 * scale,
                        height: 3 * scale,
                      }]} />
                    </View>
                  )}
                </View>
              </View>

              {/* Nose */}
              <View style={[styles.nose, {
                width: 8 * scale,
                height: 6 * scale,
                marginTop: 4 * scale,
              }]} />

              {/* Whiskers */}
              <View style={styles.whiskersContainer}>
                <View style={[styles.whisker, {
                  width: 16 * scale,
                  left: -18 * scale,
                  transform: [{ rotate: '-10deg' }],
                }]} />
                <View style={[styles.whisker, {
                  width: 18 * scale,
                  left: -20 * scale,
                  top: 5 * scale,
                }]} />
                <View style={[styles.whisker, {
                  width: 16 * scale,
                  left: -18 * scale,
                  top: 10 * scale,
                  transform: [{ rotate: '10deg' }],
                }]} />
                <View style={[styles.whisker, {
                  width: 16 * scale,
                  right: -18 * scale,
                  transform: [{ rotate: '10deg' }],
                }]} />
                <View style={[styles.whisker, {
                  width: 18 * scale,
                  right: -20 * scale,
                  top: 5 * scale,
                }]} />
                <View style={[styles.whisker, {
                  width: 16 * scale,
                  right: -18 * scale,
                  top: 10 * scale,
                  transform: [{ rotate: '-10deg' }],
                }]} />
              </View>

              {/* Mouth */}
              <View style={[styles.mouth, {
                width: 12 * scale,
                height: 6 * scale,
                marginTop: 2 * scale,
                borderRadius: mood === 'happy' ? 6 * scale : 3 * scale,
              }]} />
            </View>
          </View>

          {/* Arms */}
          <Animated.View
            style={[
              styles.arm,
              styles.leftArm,
              {
                width: 12 * scale,
                height: 30 * scale,
                borderRadius: 6 * scale,
                left: -8 * scale,
                top: 50 * scale,
                transform: [{ rotate: waveRotate }],
              }
            ]}
          />
          <View
            style={[
              styles.arm,
              styles.rightArm,
              {
                width: 12 * scale,
                height: 30 * scale,
                borderRadius: 6 * scale,
                right: -8 * scale,
                top: 50 * scale,
              }
            ]}
          />

          {/* Feet */}
          <View style={[styles.feet, { bottom: -10 * scale }]}>
            <View style={[styles.foot, {
              width: 18 * scale,
              height: 10 * scale,
              borderRadius: 5 * scale,
            }]} />
            <View style={[styles.foot, {
              width: 18 * scale,
              height: 10 * scale,
              borderRadius: 5 * scale,
              marginLeft: 12 * scale,
            }]} />
          </View>
        </Animated.View>

        {/* E=mc² formula bubble */}
        <View style={[styles.formulaBubble, { top: 20 * scale, left: -30 * scale }]}>
          <Text style={[styles.formulaText, { fontSize: 11 * scale }]}>E=mc²</Text>
        </View>
      </Pressable>
    </View>
  );
}));

// Particle component
const Particle = memo(({ scale }: { scale: number }) => {
  const position = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const angle = Math.random() * Math.PI * 2;
    const distance = 30 + Math.random() * 40;

    Animated.parallel([
      Animated.timing(position, {
        toValue: { x: Math.cos(angle) * distance, y: Math.sin(angle) * distance },
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, [position, opacity]);

  return (
    <Animated.View
      style={[
        styles.particle,
        {
          opacity,
          transform: [
            { translateX: position.x },
            { translateY: position.y },
          ],
        },
      ]}
    >
      <Text style={{ fontSize: 16 * scale }}>⭐</Text>
    </Animated.View>
  );
});

CatProfessor.displayName = 'CatProfessor';
Particle.displayName = 'CatParticle';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  characterContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  shadow: {
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,0.15)',
  },
  tail: {
    position: 'absolute',
    backgroundColor: '#D4A574',
    transformOrigin: 'bottom center',
  },
  body: {
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
    position: 'relative',
  },
  strap: {
    position: 'absolute',
    backgroundColor: '#E74C3C',
    borderRadius: 2,
  },
  leftStrap: {},
  rightStrap: {},
  pocket: {
    position: 'absolute',
    backgroundColor: '#3A7BC8',
    borderWidth: 1,
    borderColor: '#2C6CB0',
  },
  teachingStick: {
    position: 'absolute',
    backgroundColor: '#4A3728',
    borderRadius: 2,
    transformOrigin: 'bottom center',
  },
  head: {
    position: 'absolute',
    backgroundColor: '#D4A574',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  ear: {
    position: 'absolute',
    backgroundColor: '#D4A574',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 5,
  },
  leftEar: {},
  rightEar: {},
  innerEar: {
    backgroundColor: '#EFBFB5',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  face: {
    alignItems: 'center',
    marginTop: 5,
  },
  eyesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  eye: {
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pupil: {
    backgroundColor: '#2D3748',
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
    padding: 1,
  },
  highlight: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
  },
  nose: {
    backgroundColor: '#FF9999',
    borderRadius: 4,
  },
  whiskersContainer: {
    position: 'absolute',
    top: 25,
    width: '100%',
    alignItems: 'center',
  },
  whisker: {
    position: 'absolute',
    height: 1,
    backgroundColor: '#8B7355',
  },
  mouth: {
    backgroundColor: '#8B4513',
  },
  arm: {
    position: 'absolute',
    backgroundColor: '#D4A574',
  },
  leftArm: {
    transformOrigin: 'top center',
  },
  rightArm: {},
  feet: {
    position: 'absolute',
    flexDirection: 'row',
  },
  foot: {
    backgroundColor: '#D4A574',
  },
  formulaBubble: {
    position: 'absolute',
    backgroundColor: 'rgba(255,255,255,0.95)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  formulaText: {
    fontWeight: '700',
    color: '#1F2937',
  },
  particle: {
    position: 'absolute',
    zIndex: 100,
  },
});

export default CatProfessor;
