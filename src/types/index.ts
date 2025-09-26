export interface Task {
  id: string;
  title: string;
  description?: string;
  scheduledTime: Date;
  priority: 'low' | 'medium' | 'high';
  category: string;
  completed: boolean;
  isPriority?: boolean;
  createdAt: Date;
  completedAt?: Date;
  lastCheckin?: CheckinResponse;
  adaptedAction?: string;
  completionMood?: EmotionalState;
}

export interface CheckinResponse {
  mood: EmotionalState;
  willingness: 'low' | 'medium' | 'high';
  timestamp: Date;
}

export type EmotionalState = 'stressed' | 'tired' | 'unmotivated' | 'neutral' | 'good';

export interface PriorityHabit {
  id: string;
  name: string;
  category: string;
  daysPerWeek: number;
  createdAt: Date;
  isActive: boolean;
}

export interface PriorityHabitEvent {
  id: string;
  priorityHabitId: string;
  date: Date;
  willingness: 'low' | 'medium' | 'high';
  emotion: EmotionalState;
  adaptiveAction: string;
  completed: boolean;
  completedAt?: Date;
}

export interface Habit {
  id: string;
  name: string;
  description?: string;
  category: string;
  targetFrequency: 'daily' | 'weekly';
  streak: number;
  completedDates: Date[];
  createdAt: Date;
  color: string;
}

export interface FocusSession {
  id: string;
  taskId?: string;
  duration: number; // in minutes
  actualDuration?: number;
  startTime: Date;
  endTime?: Date;
  completed: boolean;
  mood: EmotionalState;
  productivity: 'low' | 'medium' | 'high';
  notes?: string;
}

export interface MoodEntry {
  id: string;
  mood: EmotionalState;
  energy: 'low' | 'medium' | 'high';
  stress: 'low' | 'medium' | 'high';
  notes?: string;
  timestamp: Date;
  triggers?: string[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: Date;
  category: 'tasks' | 'habits' | 'focus' | 'mood';
}