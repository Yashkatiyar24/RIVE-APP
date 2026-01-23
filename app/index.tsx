import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import RiveBuddy from '../components/RiveBuddy';
import { useBuddy } from '../context/BuddyProvider';

/**
 * Launcher/Home Screen
 * 
 * Shows the main navigation cards with a live animated buddy.
 * The buddy animates on app open and reacts to card taps.
 */
export default function LauncherScreen() {
  const router = useRouter();
  const buddy = useBuddy();

  // Trigger app open animation when screen mounts
  useEffect(() => {
    // Small delay to ensure everything is loaded
    const timer = setTimeout(() => {
      buddy.onAppOpen();
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleCardPress = (route: string, cardId: string) => {
    // Trigger buddy reaction based on card
    if (cardId === 'study-guide') {
      buddy.onTabChange('Learning');
    } else if (cardId === 'course') {
      buddy.onLessonStart();
    } else if (cardId === 'assistant') {
      buddy.setMood('focused');
      buddy.triggerTap();
    }

    // Navigate after small delay for animation
    setTimeout(() => {
      router.push(route as any);
    }, 150);
  };

  const screens = [
    {
      id: 'study-guide',
      icon: '📚',
      title: 'Study Guide',
      description: 'Your personal learning plan created by AI',
      color: '#DDD6FE',
      gradientColor: '#C4B5FD',
      route: '/study-guide',
    },
    {
      id: 'course',
      icon: '🎓',
      title: 'Study Craft',
      description: 'Explore interactive courses with Cat Professor',
      color: '#FEF9C3',
      gradientColor: '#FDE68A',
      route: '/course',
    },
    {
      id: 'assistant',
      icon: '🦉',
      title: 'AI Assistant',
      description: 'Chat with AI Owl for homework help',
      color: '#E0E7FF',
      gradientColor: '#C7D2FE',
      route: '/assistant',
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section with Live Buddy */}
        <View style={styles.heroSection}>
          {/* Animated Buddy - animates immediately on mount */}
          <View style={styles.buddyContainer}>
            <RiveBuddy
              size="large"
              showProgress={true}
              showStreak={true}
              onTap={() => buddy.triggerCelebrate()}
            />
          </View>

          <Text style={styles.title}>E-Craft Learning</Text>
          <Text style={styles.subtitle}>
            Interactive education with animated characters
          </Text>
        </View>

        {/* Feature Cards */}
        <View style={styles.cardsContainer}>
          {screens.map((screen) => (
            <Pressable
              key={screen.id}
              style={({ pressed }) => [
                styles.card,
                { backgroundColor: screen.color },
                pressed && styles.cardPressed,
              ]}
              onPress={() => handleCardPress(screen.route, screen.id)}
              data-testid={`launcher-${screen.id}-button`}
            >
              <View style={styles.cardContent}>
                <View style={[styles.iconContainer, { backgroundColor: screen.gradientColor }]}>
                  <Text style={styles.cardIcon}>{screen.icon}</Text>
                </View>
                <View style={styles.cardTextContainer}>
                  <Text style={styles.cardTitle}>{screen.title}</Text>
                  <Text style={styles.cardDescription}>{screen.description}</Text>
                </View>
              </View>
              <View style={styles.arrowContainer}>
                <Text style={styles.arrow}>→</Text>
              </View>
            </Pressable>
          ))}
        </View>

        {/* Stats Section */}
        <View style={styles.statsSection}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>3</Text>
            <Text style={styles.statLabel}>Characters</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>∞</Text>
            <Text style={styles.statLabel}>Animations</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>AI</Text>
            <Text style={styles.statLabel}>Powered</Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.techBadge}>
            <Text style={styles.techIcon}>⚡</Text>
            <Text style={styles.techText}>Expo Router</Text>
          </View>
          <View style={styles.techBadge}>
            <Text style={styles.techIcon}>🎨</Text>
            <Text style={styles.techText}>RIVE</Text>
          </View>
          <View style={styles.techBadge}>
            <Text style={styles.techIcon}>📱</Text>
            <Text style={styles.techText}>React Native</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#E8E4F3',
  },
  container: {
    flexGrow: 1,
    padding: 24,
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: 32,
    marginTop: 10,
  },
  buddyContainer: {
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#1F2937',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '500',
    textAlign: 'center',
    maxWidth: 280,
  },
  cardsContainer: {
    gap: 16,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  cardPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 16,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardIcon: {
    fontSize: 28,
  },
  cardTextContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 13,
    color: '#4B5563',
    fontWeight: '500',
    lineHeight: 18,
  },
  arrowContainer: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrow: {
    fontSize: 18,
    color: '#1F2937',
    fontWeight: '600',
  },
  statsSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginTop: 32,
    padding: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statItem: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#8B5CF6',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#E5E7EB',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 32,
    gap: 12,
    flexWrap: 'wrap',
  },
  techBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    gap: 6,
  },
  techIcon: {
    fontSize: 14,
  },
  techText: {
    fontSize: 12,
    color: '#4B5563',
    fontWeight: '600',
  },
});