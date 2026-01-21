import React, { useRef, useCallback, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAppStore } from '../store/useAppStore';
import RiveBuddy from '../components/RiveBuddy';
import { useBuddy } from '../context/BuddyProvider';

/**
 * Study Guide Screen
 * 
 * Shows learning plan with live buddy animations reacting to:
 * - Tab changes (Learning/Practicing)
 * - Grade selection
 * - Subject card taps
 * - Add subject action
 */

// Subject icons as emoji with colors matching the design
const SUBJECT_ICONS: Record<string, { emoji: string; color: string }> = {
  Geography: { emoji: '🌍', color: '#FFE5E5' },
  Geometry: { emoji: '📐', color: '#FFF4E0' },
  Chemistry: { emoji: '⚗️', color: '#E8F5E9' },
  Chemestry: { emoji: '⚗️', color: '#E8F5E9' },
  Literature: { emoji: '📚', color: '#FFF9C4' },
  Phisic: { emoji: '⚛️', color: '#E1F5FE' },
  Physics: { emoji: '⚛️', color: '#E1F5FE' },
  Add: { emoji: '➕', color: '#F5F5F5' },
};

export default function StudyGuideScreen() {
  const router = useRouter();
  const { activeMode, activeGrade, weeks, setActiveMode, setActiveGrade } = useAppStore();
  const buddy = useBuddy();

  // Ensure buddy idles immediately when landing directly on this screen
  useEffect(() => {
    buddy.onAppOpen();
  }, []);

  // Calculate progress based on completed subjects
  const totalProgress = useMemo(() => {
    const totalSubjects = weeks.reduce((acc, week) =>
      acc + week.subjects.filter(s => s.name !== 'Add').length, 0);
    const completedSubjects = weeks.reduce((acc, week) =>
      acc + week.subjects.filter(s => s.hours > 0 && s.name !== 'Add').length, 0);
    return Math.round((completedSubjects / totalSubjects) * 100);
  }, [weeks]);

  // Update buddy progress when it changes
  useEffect(() => {
    buddy.setProgress(totalProgress);
  }, [totalProgress]);

  // Set initial mood based on active mode
  useEffect(() => {
    buddy.setMood(activeMode === 'Learning' ? 'focused' : 'happy');
  }, []);

  // Handle mode toggle with buddy reaction
  const handleModeChange = useCallback((mode: 'Learning' | 'Practicing') => {
    setActiveMode(mode);
    buddy.onTabChange(mode);
  }, [setActiveMode, buddy]);

  // Handle grade selection with buddy reaction
  const handleGradeSelect = useCallback((grade: number) => {
    setActiveGrade(grade);
    buddy.onGradeSelect(grade);
  }, [setActiveGrade, buddy]);

  // Handle Add subject button with celebrate
  const handleAddSubject = useCallback(() => {
    buddy.onAddSubject();
    console.log('Add subject pressed');
  }, [buddy]);

  // Handle subject tap
  const handleSubjectTap = useCallback((subjectName: string) => {
    if (subjectName === 'Add') {
      handleAddSubject();
    } else {
      buddy.onSubjectTap(subjectName);
      // Navigate to course
      setTimeout(() => {
        router.push('/course');
      }, 200);
    }
  }, [handleAddSubject, router, buddy]);

  const grades = [
    { id: 1, label: 'Grade 1' },
    { id: 2, label: 'Grade 2' },
    { id: 3, label: 'Grade 3' },
    { id: 4, label: 'Grade 4+' },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Header with Live Buddy */}
        <View style={styles.header}>
          <Pressable
            style={styles.backButton}
            onPress={() => router.back()}
            data-testid="back-button"
          >
            <Text style={styles.backIcon}>←</Text>
          </Pressable>
          <Text style={styles.headerTitle}>Study Guide</Text>

          {/* Live Animated Buddy in Header */}
          <View style={styles.headerBuddyContainer}>
            <RiveBuddy
              size="tiny"
              showProgress={true}
              showStreak={true}
              onTap={() => buddy.triggerWink()}
            />
          </View>
        </View>

        {/* Segmented Control - triggers buddy mood change */}
        <View style={styles.segmentedControl}>
          <Pressable
            style={[
              styles.segment,
              activeMode === 'Learning' && styles.segmentActive,
            ]}
            onPress={() => handleModeChange('Learning')}
            data-testid="learning-tab"
          >
            <Text style={styles.segmentIcon}>📖</Text>
            <Text
              style={[
                styles.segmentText,
                activeMode === 'Learning' && styles.segmentTextActive,
              ]}
            >
              Learning
            </Text>
          </Pressable>
          <Pressable
            style={[
              styles.segment,
              activeMode === 'Practicing' && styles.segmentActive,
            ]}
            onPress={() => handleModeChange('Practicing')}
            data-testid="practicing-tab"
          >
            <Text style={styles.segmentIcon}>⏱️</Text>
            <Text
              style={[
                styles.segmentText,
                activeMode === 'Practicing' && styles.segmentTextActive,
              ]}
            >
              Practicing
            </Text>
          </Pressable>
        </View>

        {/* Title */}
        <View style={styles.titleContainer}>
          <Text style={styles.mainTitle}>Your personal learning plan</Text>
          <Text style={styles.subtitle}>Created by AI</Text>
        </View>

        {/* Grade Chips - triggers buddy reaction */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.gradesContainer}
          contentContainerStyle={styles.gradesContent}
        >
          {grades.map((grade) => (
            <Pressable
              key={grade.id}
              style={[
                styles.gradeChip,
                activeGrade === grade.id && styles.gradeChipActive,
              ]}
              onPress={() => handleGradeSelect(grade.id)}
              data-testid={`grade-${grade.id}-chip`}
            >
              <Text style={styles.gradeIcon}>🎓</Text>
              <Text
                style={[
                  styles.gradeText,
                  activeGrade === grade.id && styles.gradeTextActive,
                ]}
              >
                {grade.label}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* Weeks */}
        {weeks.map((week, weekIndex) => (
          <View
            key={week.id}
            style={[
              styles.weekCard,
              { backgroundColor: weekIndex === 0 ? '#E3F2FD' : '#FCE4EC' },
            ]}
            data-testid={`week-${week.weekNumber}-card`}
          >
            {/* Week Header */}
            <View style={styles.weekHeader}>
              <View style={styles.weekBadge}>
                <Text style={styles.weekBadgeText}>Week</Text>
              </View>
              <View style={styles.weekNumberBadge}>
                <Text style={styles.weekNumberIcon}>🎓</Text>
                <Text style={styles.weekNumberText}>#{week.weekNumber}</Text>
              </View>
              <View style={styles.subjectCountBadge}>
                <Text style={styles.subjectCountIcon}>📚</Text>
                <Text style={styles.subjectCountText}>
                  {week.subjectCount} Subjects
                </Text>
              </View>
            </View>

            {/* Subjects Grid - tapping triggers buddy reaction */}
            <View style={styles.subjectsGrid}>
              {week.subjects.map((subject) => {
                const iconData = SUBJECT_ICONS[subject.name] || { emoji: '📝', color: '#F5F5F5' };
                return (
                  <Pressable
                    key={subject.id}
                    style={[
                      styles.subjectCard,
                      { backgroundColor: iconData.color },
                    ]}
                    onPress={() => handleSubjectTap(subject.name)}
                    data-testid={`subject-${subject.name.toLowerCase()}-card`}
                  >
                    <View style={styles.subjectIconContainer}>
                      <Text style={styles.subjectIcon}>{iconData.emoji}</Text>
                    </View>
                    <Text style={styles.subjectName}>{subject.name}</Text>
                    {subject.hours > 0 && (
                      <Text style={styles.subjectHours}>{subject.hours} hours</Text>
                    )}
                  </Pressable>
                );
              })}
            </View>
          </View>
        ))}

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    fontSize: 24,
    color: '#1F2937',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
  },
  headerBuddyContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#F59E0B',
    overflow: 'hidden',
  },
  segmentedControl: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 24,
    padding: 4,
    marginBottom: 24,
  },
  segment: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  segmentActive: {
    backgroundColor: '#A78BFA',
  },
  segmentIcon: {
    fontSize: 16,
  },
  segmentText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#6B7280',
  },
  segmentTextActive: {
    color: '#FFFFFF',
  },
  titleContainer: {
    marginBottom: 20,
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F59E0B',
  },
  gradesContainer: {
    marginBottom: 20,
  },
  gradesContent: {
    gap: 8,
    paddingRight: 20,
  },
  gradeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    gap: 6,
    marginRight: 8,
  },
  gradeChipActive: {
    backgroundColor: '#1F2937',
  },
  gradeIcon: {
    fontSize: 16,
  },
  gradeText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#6B7280',
  },
  gradeTextActive: {
    color: '#FFFFFF',
  },
  weekCard: {
    borderRadius: 24,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  weekHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  weekBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 14,
  },
  weekBadgeText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1F2937',
  },
  weekNumberBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 14,
    gap: 4,
  },
  weekNumberIcon: {
    fontSize: 14,
  },
  weekNumberText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1F2937',
  },
  subjectCountBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 14,
    gap: 4,
  },
  subjectCountIcon: {
    fontSize: 12,
  },
  subjectCountText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FF69B4',
  },
  subjectsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  subjectCard: {
    width: '30%',
    aspectRatio: 0.9,
    borderRadius: 20,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  subjectIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  subjectIcon: {
    fontSize: 28,
  },
  subjectName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 4,
  },
  subjectHours: {
    fontSize: 10,
    fontWeight: '500',
    color: '#6B7280',
  },
  bottomSpacer: {
    height: 40,
  },
});
