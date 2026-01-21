import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { useBuddyStore, BuddyMood } from '../store/buddyStore';

/**
 * BuddyProvider Context
 * 
 * Provides easy access to buddy actions throughout the app.
 * Wrap your app in this provider to enable buddy animations everywhere.
 */

interface BuddyContextValue {
    // State
    mood: BuddyMood;
    progress: number;
    streakCount: number;
    isThinking: boolean;

    // Actions
    setMood: (mood: BuddyMood) => void;
    setProgress: (progress: number) => void;
    setStreakCount: (count: number) => void;
    triggerCelebrate: () => void;
    triggerThinking: (start: boolean) => void;
    triggerTap: () => void;
    triggerWink: () => void;

    // High-level events
    onAppOpen: () => void;
    onTabChange: (mode: 'Learning' | 'Practicing') => void;
    onGradeSelect: (grade: number) => void;
    onWeekOpen: (weekId: string) => void;
    onSubjectTap: (subjectName: string) => void;
    onAddSubject: () => void;
    onLessonStart: () => void;
    onLessonComplete: () => void;
    onChatSend: () => void;
    onChatThinkingStart: () => void;
    onChatReply: () => void;
    onCourseEnroll: () => void;
}

const BuddyContext = createContext<BuddyContextValue | null>(null);

interface BuddyProviderProps {
    children: ReactNode;
    autoOpenAnimation?: boolean;
}

export const BuddyProvider: React.FC<BuddyProviderProps> = ({
    children,
    autoOpenAnimation = true
}) => {
    const store = useBuddyStore();

    // Trigger app open animation on mount
    useEffect(() => {
        if (autoOpenAnimation) {
            // Small delay to ensure Rive is loaded
            const timer = setTimeout(() => {
                store.onAppOpen();
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [autoOpenAnimation]);

    const value: BuddyContextValue = {
        // State
        mood: store.mood,
        progress: store.progress,
        streakCount: store.streakCount,
        isThinking: store.isThinking,

        // Actions
        setMood: store.setMood,
        setProgress: store.setProgress,
        setStreakCount: store.setStreakCount,
        triggerCelebrate: store.triggerCelebrate,
        triggerThinking: store.triggerThinking,
        triggerTap: store.triggerTap,
        triggerWink: store.triggerWink,

        // High-level events
        onAppOpen: store.onAppOpen,
        onTabChange: store.onTabChange,
        onGradeSelect: store.onGradeSelect,
        onWeekOpen: store.onWeekOpen,
        onSubjectTap: store.onSubjectTap,
        onAddSubject: store.onAddSubject,
        onLessonStart: store.onLessonStart,
        onLessonComplete: store.onLessonComplete,
        onChatSend: store.onChatSend,
        onChatThinkingStart: store.onChatThinkingStart,
        onChatReply: store.onChatReply,
        onCourseEnroll: store.onCourseEnroll,
    };

    return (
        <BuddyContext.Provider value={value}>
            {children}
        </BuddyContext.Provider>
    );
};

// Hook to use buddy context
export const useBuddy = (): BuddyContextValue => {
    const context = useContext(BuddyContext);
    if (!context) {
        // Return store directly if not in provider (fallback)
        const store = useBuddyStore.getState();
        return {
            mood: store.mood,
            progress: store.progress,
            streakCount: store.streakCount,
            isThinking: store.isThinking,
            setMood: store.setMood,
            setProgress: store.setProgress,
            setStreakCount: store.setStreakCount,
            triggerCelebrate: store.triggerCelebrate,
            triggerThinking: store.triggerThinking,
            triggerTap: store.triggerTap,
            triggerWink: store.triggerWink,
            onAppOpen: store.onAppOpen,
            onTabChange: store.onTabChange,
            onGradeSelect: store.onGradeSelect,
            onWeekOpen: store.onWeekOpen,
            onSubjectTap: store.onSubjectTap,
            onAddSubject: store.onAddSubject,
            onLessonStart: store.onLessonStart,
            onLessonComplete: store.onLessonComplete,
            onChatSend: store.onChatSend,
            onChatThinkingStart: store.onChatThinkingStart,
            onChatReply: store.onChatReply,
            onCourseEnroll: store.onCourseEnroll,
        };
    }
    return context;
};

export default BuddyProvider;
