import React, { useRef, useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Platform,
  SafeAreaView,
} from 'react-native';
import { router } from 'expo-router';
import { useAppStore } from '../store/useAppStore';
import RiveCatProfessor, { RiveCatProfessorRef } from '../components/RiveCatProfessor';
import RiveBuddy from '../components/RiveBuddy';
import { useBuddy } from '../context/BuddyProvider';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

/**
 * Course Screen (Study Craft)
 * 
 * Shows course details with Cat Professor and floating buddy.
 * Buddy reacts to:
 * - Enrolling in course (celebrate)
 * - Starting lessons (focused mood)
 * - Completing lessons (celebrate + streak)
 */

// Available teachers with avatars
const teachers = [
  { id: '1', name: 'Sarah', emoji: '👩‍🏫', color: '#FFD6E0' },
  { id: '2', name: 'Alex', emoji: '👨‍🏫', color: '#D4E5FF' },
  { id: '3', name: 'Maria', emoji: '👩‍💼', color: '#E8D4FF' },
  { id: '4', name: 'John', emoji: '👨‍🔬', color: '#D4FFE8' },
  { id: '5', name: 'Emma', emoji: '👩‍🎓', color: '#FFF4D4' },
  { id: '6', name: 'More', emoji: '➕', color: '#F0F0F0' },
];

export default function CourseScreen() {
  const catRef = useRef<RiveCatProfessorRef>(null);
  const { currentCourse } = useAppStore();
  const buddy = useBuddy();
  const [isEnrolled, setIsEnrolled] = useState(false);

  // Set initial mood when entering course
  useEffect(() => {
    buddy.setMood('focused');
    buddy.onLessonStart();
  }, []);

  const handleBackPress = useCallback(() => {
    router.back();
  }, []);

  const handleMenuPress = useCallback(() => {
    console.log('Menu pressed');
    buddy.triggerTap();
  }, [buddy]);

  const handleEnroll = useCallback(() => {
    catRef.current?.fireCelebrate();
    buddy.onCourseEnroll();
    setIsEnrolled(true);
    console.log('Enrolled in Study Craft course!');
  }, [buddy]);

  const handleCatTap = useCallback(() => {
    catRef.current?.fireWave();
    buddy.triggerWink();
  }, [buddy]);

  const handleTeacherPress = useCallback((teacherId: string) => {
    console.log('Teacher pressed:', teacherId);
    catRef.current?.fireWave();
    buddy.triggerTap();
  }, [buddy]);

  const handleSeeAll = useCallback(() => {
    console.log('See all teachers');
    buddy.triggerTap();
  }, [buddy]);

  const handleLessonComplete = useCallback(() => {
    buddy.onLessonComplete();
    catRef.current?.fireCelebrate();
  }, [buddy]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Study Craft</Text>
          <TouchableOpacity onPress={handleMenuPress} style={styles.menuButton}>
            <Text style={styles.menuIcon}>☰</Text>
          </TouchableOpacity>
        </View>

        {/* Cat Professor Hero Section */}
        <View style={styles.heroSection}>
          {/* Floating icons */}
          <View style={styles.floatingIconTopLeft}>
            <View style={styles.iconBubble}>
              <Text style={styles.iconText}>📐</Text>
            </View>
          </View>
          <View style={styles.floatingIconTopRight}>
            <View style={styles.iconBubbleSmall}>
              <Text style={styles.iconTextSmall}>🎓</Text>
            </View>
            <Text style={styles.rankBadge}>#2</Text>
          </View>
          <View style={styles.floatingIconMiddleRight}>
            <View style={styles.iconBubble}>
              <Text style={styles.iconText}>⚙️</Text>
            </View>
          </View>

          <RiveCatProfessor
            ref={catRef}
            size="large"
            isTeaching={true}
            onTap={handleCatTap}
          />
        </View>

        {/* Course Title and Rating */}
        <View style={styles.courseInfo}>
          <View style={styles.courseTitleRow}>
            <Text style={styles.courseTitle}>Science Play</Text>
            <Text style={styles.courseEmoji}>🎓</Text>
            <View style={styles.ratingBadge}>
              <Text style={styles.ratingText}>5.0</Text>
              <View style={styles.ratingWreath}>
                <Text style={styles.wreathText}>🏆</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Description */}
        <View style={styles.descriptionSection}>
          <Text style={styles.descriptionText}>
            {currentCourse?.description ||
              'Discover the magic of science in a playful way! With our wise and funny cat-professor, kids will explore simple formula...'}
          </Text>
        </View>

        {/* Available Teachers */}
        <View style={styles.teachersSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Available Teachers</Text>
            <TouchableOpacity onPress={handleSeeAll}>
              <Text style={styles.seeAllText}>See all</Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.teachersList}
          >
            {teachers.map((teacher) => (
              <TouchableOpacity
                key={teacher.id}
                style={[styles.teacherAvatar, { backgroundColor: teacher.color }]}
                onPress={() => handleTeacherPress(teacher.id)}
              >
                <Text style={styles.teacherEmoji}>{teacher.emoji}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Stats Section */}
        <View style={styles.statsSection}>
          <View style={styles.statCard}>
            <View style={styles.statHeader}>
              <Text style={styles.statLabel}>Hours</Text>
              <View style={styles.statIconBubble}>
                <Text style={styles.statIcon}>⏱️</Text>
              </View>
            </View>
            <Text style={styles.statValue}>{currentCourse?.hours || 32}</Text>
          </View>
          <View style={styles.statCard}>
            <View style={styles.statHeader}>
              <Text style={styles.statLabel}>Lessons</Text>
              <View style={styles.statIconBubble}>
                <Text style={styles.statIcon}>📚</Text>
              </View>
            </View>
            <Text style={styles.statValue}>{currentCourse?.lessons || 16}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Floating Buddy - Bottom Right */}
      <View style={styles.floatingBuddy} pointerEvents="box-none">
        <RiveBuddy
          size="small"
          showStreak={true}
          pointerEvents="none"
          onTap={() => buddy.triggerCelebrate()}
        />
      </View>

      {/* Bottom Action Button */}
      <View style={styles.bottomAction}>
        <TouchableOpacity
          style={[styles.enrollButton, isEnrolled && styles.enrolledButton]}
          onPress={isEnrolled ? handleLessonComplete : handleEnroll}
          activeOpacity={0.8}
        >
          <Text style={styles.enrollButtonText}>
            {isEnrolled ? 'Complete Lesson ✓' : 'Start Learning'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFBEB',
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 120,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 40 : 10,
    paddingBottom: 10,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  backIcon: {
    fontSize: 22,
    color: '#333',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  menuButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  menuIcon: {
    fontSize: 18,
    color: '#333',
  },
  heroSection: {
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: '#FCD34D',
    marginHorizontal: 20,
    borderRadius: 24,
    marginTop: 10,
    position: 'relative',
    minHeight: 280,
  },
  floatingIconTopLeft: {
    position: 'absolute',
    top: 20,
    left: 20,
  },
  floatingIconTopRight: {
    position: 'absolute',
    top: 20,
    right: 20,
    alignItems: 'center',
  },
  floatingIconMiddleRight: {
    position: 'absolute',
    top: '40%',
    right: 15,
  },
  iconBubble: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  iconBubbleSmall: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontSize: 24,
  },
  iconTextSmall: {
    fontSize: 18,
  },
  rankBadge: {
    marginTop: 4,
    backgroundColor: '#1F2937',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    color: '#FFF',
    fontSize: 12,
    fontWeight: '700',
    overflow: 'hidden',
  },
  courseInfo: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  courseTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  courseTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F2937',
  },
  courseEmoji: {
    fontSize: 24,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginLeft: 'auto',
    gap: 4,
  },
  ratingText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
  },
  ratingWreath: {
    marginLeft: 2,
  },
  wreathText: {
    fontSize: 14,
  },
  descriptionSection: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  descriptionText: {
    fontSize: 15,
    lineHeight: 24,
    color: '#6B7280',
  },
  teachersSection: {
    paddingTop: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  seeAllText: {
    fontSize: 14,
    color: '#3B82F6',
    fontWeight: '500',
  },
  teachersList: {
    paddingHorizontal: 20,
    gap: 12,
    flexDirection: 'row',
  },
  teacherAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  teacherEmoji: {
    fontSize: 28,
  },
  statsSection: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 24,
    gap: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#1F2937',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statLabel: {
    fontSize: 14,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  statIconBubble: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statIcon: {
    fontSize: 16,
  },
  statValue: {
    fontSize: 36,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  floatingBuddy: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    zIndex: 100,
  },
  bottomAction: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFF',
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: Platform.OS === 'ios' ? 34 : 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 10,
  },
  enrollButton: {
    backgroundColor: '#8B5CF6',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  enrolledButton: {
    backgroundColor: '#10B981',
  },
  enrollButtonText: {
    color: '#FFF',
    fontSize: 17,
    fontWeight: '600',
  },
});
