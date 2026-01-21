import { create } from 'zustand';

export interface Subject {
  id: string;
  name: string;
  icon: string;
  hours: number;
  color: string;
}

export interface Week {
  id: string;
  weekNumber: number;
  teacherCount: number;
  subjectCount: number;
  subjects: Subject[];
  color: string;
}

export interface Teacher {
  id: string;
  name: string;
  avatar: string;
}

export interface ChatMessage {
  id: string;
  text: string;
  timestamp: string;
  isUser: boolean;
}

export interface Course {
  id: string;
  title: string;
  emoji: string;
  rating: number;
  description: string;
  hours: number;
  lessons: number;
  teachers: Teacher[];
}

interface AppState {
  // Study Guide State
  activeMode: 'Learning' | 'Practicing';
  activeGrade: number;
  weeks: Week[];
  
  // Course State
  currentCourse: Course | null;
  
  // Assistant State
  chatMessages: ChatMessage[];
  isThinking: boolean;
  
  // Actions
  setActiveMode: (mode: 'Learning' | 'Practicing') => void;
  setActiveGrade: (grade: number) => void;
  addChatMessage: (message: ChatMessage) => void;
  setIsThinking: (thinking: boolean) => void;
  setCurrentCourse: (course: Course) => void;
}

export const useAppStore = create<AppState>((set) => ({
  // Initial State
  activeMode: 'Learning',
  activeGrade: 2,
  weeks: [
    {
      id: 'week-1',
      weekNumber: 1,
      teacherCount: 1,
      subjectCount: 3,
      color: '#E3F2FD',
      subjects: [
        { id: 's1', name: 'Geography', icon: '🌍', hours: 8, color: '#FFE5E5' },
        { id: 's2', name: 'Geometry', icon: '📊', hours: 14, color: '#FFF4E0' },
        { id: 's3', name: 'Add', icon: '➕', hours: 0, color: '#F0F0F0' },
      ],
    },
    {
      id: 'week-2',
      weekNumber: 2,
      teacherCount: 2,
      subjectCount: 10,
      color: '#FCE4EC',
      subjects: [
        { id: 's4', name: 'Chemistry', icon: '⚗️', hours: 34, color: '#E8F5E9' },
        { id: 's5', name: 'Literature', icon: '📖', hours: 23, color: '#FFF9C4' },
        { id: 's6', name: 'Phisic', icon: '⚛️', hours: 8, color: '#E1F5FE' },
      ],
    },
  ],
  
  currentCourse: {
    id: 'course-1',
    title: 'Science Play',
    emoji: '🎓',
    rating: 5.0,
    description: 'Discover the magic of science in a playful way! With our wise and funny cat-professor, kids will explore simple formula...',
    hours: 32,
    lessons: 16,
    teachers: [
      { id: 't1', name: 'Teacher 1', avatar: '👨‍🏫' },
      { id: 't2', name: 'Teacher 2', avatar: '👩‍🏫' },
      { id: 't3', name: 'Teacher 3', avatar: '👨‍💻' },
      { id: 't4', name: 'Teacher 4', avatar: '👩‍🔬' },
      { id: 't5', name: 'Teacher 5', avatar: '👨‍🏫' },
    ],
  },
  
  chatMessages: [
    {
      id: 'msg-1',
      text: 'And what else can be found that is just as interesting but on the topic of education?',
      timestamp: '21:41',
      isUser: true,
    },
  ],
  
  isThinking: false,
  
  // Actions
  setActiveMode: (mode) => set({ activeMode: mode }),
  setActiveGrade: (grade) => set({ activeGrade: grade }),
  addChatMessage: (message) => set((state) => ({ 
    chatMessages: [...state.chatMessages, message] 
  })),
  setIsThinking: (thinking) => set({ isThinking: thinking }),
  setCurrentCourse: (course) => set({ currentCourse: course }),
}));