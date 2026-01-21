import { create } from 'zustand';

/**
 * BuddyStore - Global state management for Rive Learning Buddy animations.
 * Keeps the UI and Rive inputs in sync across screens.
 */

export type BuddyMood = 'idle' | 'happy' | 'sad' | 'focused' | 'thinking' | 'excited';

export interface BuddyController {
    id: string;
    setMood: (mood: BuddyMood) => void;
    setProgress: (progress: number) => void;
    setStreak: (count: number) => void;
    triggerCelebrate: () => void;
    triggerThinking: (start: boolean) => void;
}

interface BuddyState {
    // Core state
    mood: BuddyMood;
    progress: number; // 0-100
    streakCount: number;
    isThinking: boolean;

    // Trigger flags (legacy for compatibility)
    celebrateTrigger: number;
    thinkingTrigger: number;
    tapTrigger: number;
    winkTrigger: number;

    // Last updated timestamp for debouncing
    lastUpdate: number;

    // Connected Rive controllers
    controllers: Record<string, BuddyController>;
}

interface BuddyActions {
    // Core setters
    setMood: (mood: BuddyMood) => void;
    setProgress: (progress: number) => void;
    setStreakCount: (count: number) => void;
    setIsThinking: (thinking: boolean) => void;

    // Trigger actions
    triggerCelebrate: () => void;
    triggerThinking: (start: boolean) => void;
    triggerTap: () => void;
    triggerWink: () => void;

    // High-level app events
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

    registerController: (controller: BuddyController) => void;
    unregisterController: (id: string) => void;

    // Reset
    reset: () => void;
}

const initialState: BuddyState = {
    mood: 'idle',
    progress: 0,
    streakCount: 0,
    isThinking: false,
    celebrateTrigger: 0,
    thinkingTrigger: 0,
    tapTrigger: 0,
    winkTrigger: 0,
    lastUpdate: Date.now(),
    controllers: {},
};

export const useBuddyStore = create<BuddyState & BuddyActions>((set, get) => ({
    ...initialState,

    registerController: (controller) => set((state) => ({
        controllers: { ...state.controllers, [controller.id]: controller },
    })),

    unregisterController: (id) => set((state) => {
        const next = { ...state.controllers };
        delete next[id];
        return { controllers: next };
    }),

    // Core setters
    setMood: (mood) => {
        set({ mood, lastUpdate: Date.now() });
        Object.values(get().controllers).forEach((controller) => {
            try {
                controller.setMood(mood);
            } catch (error) {
                console.warn('[BuddyStore] setMood failed', error);
            }
        });
    },

    setProgress: (progress) => {
        const next = Math.max(0, Math.min(100, progress));
        set({
            progress: next,
            lastUpdate: Date.now()
        });
        Object.values(get().controllers).forEach((controller) => {
            try {
                controller.setProgress(next);
            } catch (error) {
                console.warn('[BuddyStore] setProgress failed', error);
            }
        });
    },

    setStreakCount: (count) => {
        const next = Math.max(0, count);
        set({
            streakCount: next,
            lastUpdate: Date.now()
        });
        Object.values(get().controllers).forEach((controller) => {
            try {
                controller.setStreak(next);
            } catch (error) {
                console.warn('[BuddyStore] setStreak failed', error);
            }
        });
    },

    setIsThinking: (thinking) => set({
        isThinking: thinking,
        mood: thinking ? 'thinking' : get().mood === 'thinking' ? 'idle' : get().mood,
        lastUpdate: Date.now()
    }),

    // Trigger actions
    triggerCelebrate: () => {
        set((state) => ({
            celebrateTrigger: state.celebrateTrigger + 1,
            mood: 'excited',
            lastUpdate: Date.now()
        }));
        Object.values(get().controllers).forEach((controller) => {
            try {
                controller.triggerCelebrate();
            } catch (error) {
                console.warn('[BuddyStore] triggerCelebrate failed', error);
            }
        });
    },

    triggerThinking: (start) => {
        set((state) => ({
            thinkingTrigger: state.thinkingTrigger + 1,
            isThinking: start,
            mood: start ? 'thinking' : 'idle',
            lastUpdate: Date.now()
        }));
        Object.values(get().controllers).forEach((controller) => {
            try {
                controller.triggerThinking(start);
            } catch (error) {
                console.warn('[BuddyStore] triggerThinking failed', error);
            }
        });
    },

    triggerTap: () => set((state) => ({
        tapTrigger: state.tapTrigger + 1,
        lastUpdate: Date.now()
    })),

    triggerWink: () => set((state) => ({
        winkTrigger: state.winkTrigger + 1,
        lastUpdate: Date.now()
    })),

    // High-level app events
    onAppOpen: () => {
        get().setMood('happy');
        // Small pulse to feel alive on open
        setTimeout(() => {
            get().triggerCelebrate();
        }, 400);
    },

    onTabChange: (mode) => {
        const mood = mode === 'Learning' ? 'focused' : 'happy';
        get().setMood(mood);
        get().triggerTap();
    },

    onGradeSelect: (grade) => {
        get().setMood('focused');
        get().setProgress(grade * 20);
        get().triggerTap();
    },

    onWeekOpen: (_weekId) => {
        get().setMood('focused');
    },

    onSubjectTap: (_subjectName) => {
        get().setMood('focused');
        get().triggerTap();
    },

    onAddSubject: () => {
        get().setMood('excited');
        get().triggerCelebrate();
    },

    onLessonStart: () => {
        get().setMood('focused');
        get().triggerTap();
    },

    onLessonComplete: () => {
        const currentStreak = get().streakCount;
        const currentProgress = get().progress;
        get().setMood('excited');
        get().setStreakCount(currentStreak + 1);
        get().setProgress(Math.min(100, currentProgress + 10));
        get().triggerCelebrate();
    },

    onChatSend: () => {
        get().setMood('focused');
        get().triggerTap();
    },

    onChatThinkingStart: () => {
        get().setMood('thinking');
        set({
            isThinking: true,
            lastUpdate: Date.now()
        });
        get().triggerThinking(true);
    },

    onChatReply: () => {
        get().setMood('happy');
        set({
            isThinking: false,
            lastUpdate: Date.now()
        });
        get().triggerThinking(false);
        setTimeout(() => {
            get().triggerCelebrate();
        }, 150);
    },

    onCourseEnroll: () => {
        const currentProgress = get().progress;
        get().setMood('excited');
        get().setProgress(Math.min(100, currentProgress + 15));
        get().triggerCelebrate();
    },

    // Reset to initial state
    reset: () => set(initialState),
}));

// Export convenience hooks
export const useBuddyMood = () => useBuddyStore((state) => state.mood);
export const useBuddyProgress = () => useBuddyStore((state) => state.progress);
export const useBuddyStreak = () => useBuddyStore((state) => state.streakCount);
export const useBuddyThinking = () => useBuddyStore((state) => state.isThinking);
