import React, { useState, useEffect } from 'react';
import Onboarding from './components/Onboarding';
import PriorityHabitSelection from './components/PriorityHabitSelection';
import PriorityHabitCheckin from './components/PriorityHabitCheckin';
import Dashboard from './components/Dashboard';
import EmotionalCheckin from './components/EmotionalCheckin';
import TaskDetail from './components/TaskDetail';
import AddTask from './components/AddTask';
import WeeklyInsights from './components/WeeklyInsights';
import HabitTracker from './components/HabitTracker';
import FocusTimer from './components/FocusTimer';
import MoodTracker from './components/MoodTracker';
import Achievements from './components/Achievements';
import { Task, EmotionalState, CheckinResponse, Habit, FocusSession, MoodEntry, Achievement, PriorityHabit, PriorityHabitEvent } from './types';
import { sampleTasks, sampleHabits, sampleMoodEntries, sampleAchievements } from './data/sampleData';

function App() {
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [showPriorityHabitSelection, setShowPriorityHabitSelection] = useState(false);
  const [currentView, setCurrentView] = useState<'dashboard' | 'checkin' | 'priority-checkin' | 'task' | 'add' | 'insights' | 'habits' | 'focus' | 'mood' | 'achievements'>('dashboard');
  const [tasks, setTasks] = useState<Task[]>(sampleTasks);
  const [habits, setHabits] = useState<Habit[]>(sampleHabits);
  const [focusSessions, setFocusSessions] = useState<FocusSession[]>([]);
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>(sampleMoodEntries);
  const [achievements, setAchievements] = useState<Achievement[]>(sampleAchievements);
  const [priorityHabit, setPriorityHabit] = useState<PriorityHabit | null>(null);
  const [priorityHabitEvents, setPriorityHabitEvents] = useState<PriorityHabitEvent[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [checkinTask, setCheckinTask] = useState<Task | null>(null);

  const handleTaskReminder = (task: Task) => {
    if (task.isPriority) {
      setCheckinTask(task);
      setCurrentView('priority-checkin');
    } else {
      setCheckinTask(task);
      setCurrentView('checkin');
    }
  };

  const handleCheckinComplete = (response: CheckinResponse) => {
    if (checkinTask) {
      const updatedTask = {
        ...checkinTask,
        lastCheckin: response,
        adaptedAction: generateAdaptedAction(checkinTask, response)
      };
      
      setTasks(prev => prev.map(t => t.id === checkinTask.id ? updatedTask : t));
      setSelectedTask(updatedTask);
      setCurrentView('task');
    }
  };

  const handlePriorityCheckinComplete = (response: {
    willingness: 'low' | 'medium' | 'high';
    emotion: EmotionalState;
    adaptiveAction: string;
  }) => {
    if (checkinTask && priorityHabit) {
      // Create priority habit event
      const newEvent: PriorityHabitEvent = {
        id: Date.now().toString(),
        priorityHabitId: priorityHabit.id,
        date: new Date(),
        willingness: response.willingness,
        emotion: response.emotion,
        adaptiveAction: response.adaptiveAction,
        completed: false
      };
      
      setPriorityHabitEvents(prev => [...prev, newEvent]);
      
      // Update task with check-in data
      const updatedTask = {
        ...checkinTask,
        lastCheckin: {
          mood: response.emotion,
          willingness: response.willingness,
          timestamp: new Date()
        },
        adaptedAction: response.adaptiveAction
      };
      
      setTasks(prev => prev.map(t => t.id === checkinTask.id ? updatedTask : t));
      setSelectedTask(updatedTask);
      setCurrentView('task');
    }
  };
  const generateAdaptedAction = (task: Task, response: CheckinResponse): string => {
    const { mood, willingness } = response;
    
    if (willingness === 'high' && (mood === 'good' || mood === 'neutral')) {
      return `Great energy! Start the full task: "${task.title}"`;
    } else if (willingness === 'medium') {
      return getMicroAction(task, 'medium');
    } else {
      return getMicroAction(task, 'low');
    }
  };

  const getMicroAction = (task: Task, level: 'medium' | 'low'): string => {
    const microActions = {
      'Write project report': {
        medium: 'Open the document and write just one paragraph',
        low: 'Open the document and write one sentence'
      },
      'Go to gym': {
        medium: 'Put on workout clothes and do 5 minutes of stretching',
        low: 'Put on your gym shoes and take 3 deep breaths'
      },
      'Clean kitchen': {
        medium: 'Clear and wipe down just the counter',
        low: 'Put away 3 items from the counter'
      },
      'Call mom': {
        medium: 'Send a quick text saying you\'ll call soon',
        low: 'Add mom\'s contact to your favorites'
      }
    };

    return microActions[task.title as keyof typeof microActions]?.[level] || 
           (level === 'medium' ? `Break "${task.title}" into smaller steps` : `Take one tiny step toward "${task.title}"`);
  };

  const addTask = (taskData: Omit<Task, 'id' | 'completed' | 'createdAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: Date.now().toString(),
      completed: false,
      createdAt: new Date()
    };
    setTasks(prev => [...prev, newTask]);
    setCurrentView('dashboard');
  };

  const addPriorityTask = (priorityHabit: PriorityHabit) => {
    // Create a recurring task for the priority habit
    const newTask: Task = {
      id: Date.now().toString(),
      title: priorityHabit.name,
      description: `Your priority habit - ${priorityHabit.daysPerWeek} days per week`,
      scheduledTime: new Date(Date.now() + 60 * 60 * 1000), // 1 hour from now
      priority: 'high',
      category: priorityHabit.category,
      completed: false,
      isPriority: true,
      createdAt: new Date()
    };
    setTasks(prev => [...prev, newTask]);
  };
  const completeTask = (taskId: string, completionMood: EmotionalState) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        const updatedTask = { ...t, completed: true, completionMood, completedAt: new Date() };
        
        // If it's a priority task, mark the corresponding habit event as completed
        if (t.isPriority && priorityHabit) {
          const today = new Date().toDateString();
          setPriorityHabitEvents(prevEvents => 
            prevEvents.map(event => 
              event.priorityHabitId === priorityHabit.id && 
              new Date(event.date).toDateString() === today
                ? { ...event, completed: true, completedAt: new Date() }
                : event
            )
          );
        }
        
        return updatedTask;
      }
      return t;
    }));
  };

  const completeHabit = (habitId: string) => {
    const today = new Date();
    setHabits(prev => prev.map(habit => 
      habit.id === habitId 
        ? { 
            ...habit, 
            completedDates: [...habit.completedDates, today],
            streak: habit.streak + 1
          }
        : habit
    ));
  };

  const addFocusSession = (session: Omit<FocusSession, 'id'>) => {
    const newSession: FocusSession = {
      ...session,
      id: Date.now().toString()
    };
    setFocusSessions(prev => [...prev, newSession]);
  };

  const addMoodEntry = (entry: Omit<MoodEntry, 'id'>) => {
    const newEntry: MoodEntry = {
      ...entry,
      id: Date.now().toString()
    };
    setMoodEntries(prev => [newEntry, ...prev]);
  };

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
  };

  if (showOnboarding) {
  const handlePriorityHabitComplete = (habitData: Omit<PriorityHabit, 'id' | 'createdAt'>) => {
    const newPriorityHabit: PriorityHabit = {
      ...habitData,
      id: Date.now().toString(),
      createdAt: new Date()
    };
    setPriorityHabit(newPriorityHabit);
    addPriorityTask(newPriorityHabit);
    setShowPriorityHabitSelection(false);
  };
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  if (showPriorityHabitSelection) {
    return (
      <PriorityHabitSelection 
        onComplete={handlePriorityHabitComplete}
        onBack={() => setShowOnboarding(true)}
      />
    );
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {currentView === 'dashboard' && (
        <Dashboard 
          tasks={tasks}
          onTaskReminder={handleTaskReminder}
          onAddTask={() => setCurrentView('add')}
          onViewInsights={() => setCurrentView('insights')}
          onViewHabits={() => setCurrentView('habits')}
          onViewFocus={() => setCurrentView('focus')}
          onViewMood={() => setCurrentView('mood')}
          onViewAchievements={() => setCurrentView('achievements')}
        />
      )}
      
      {currentView === 'checkin' && checkinTask && (
        <EmotionalCheckin 
          task={checkinTask}
          onComplete={handleCheckinComplete}
          onBack={() => setCurrentView('dashboard')}
        />
      )}
      
      {currentView === 'priority-checkin' && checkinTask && priorityHabit && (
        <PriorityHabitCheckin 
          priorityHabit={priorityHabit}
          onComplete={handlePriorityCheckinComplete}
          onBack={() => setCurrentView('dashboard')}
        />
      )}
      
      {currentView === 'task' && selectedTask && (
        <TaskDetail 
          task={selectedTask}
          onBack={() => setCurrentView('dashboard')}
          onComplete={completeTask}
        />
      )}
      
      {currentView === 'add' && (
        <AddTask 
          onAdd={addTask}
          onBack={() => setCurrentView('dashboard')}
        />
      )}
      
      {currentView === 'insights' && (
        <WeeklyInsights 
          tasks={tasks}
          priorityHabitEvents={priorityHabitEvents}
          priorityHabitTarget={priorityHabit?.daysPerWeek}
          onBack={() => setCurrentView('dashboard')}
        />
      )}
      
      {currentView === 'habits' && (
        <HabitTracker 
          habits={habits}
          onBack={() => setCurrentView('dashboard')}
          onAddHabit={() => {/* TODO: Add habit form */}}
          onCompleteHabit={completeHabit}
        />
      )}
      
      {currentView === 'focus' && (
        <FocusTimer 
          onBack={() => setCurrentView('dashboard')}
          onSessionComplete={addFocusSession}
        />
      )}
      
      {currentView === 'mood' && (
        <MoodTracker 
          moodEntries={moodEntries}
          onBack={() => setCurrentView('dashboard')}
          onAddMoodEntry={addMoodEntry}
        />
      )}
      
      {currentView === 'achievements' && (
        <Achievements 
          achievements={achievements}
          onBack={() => setCurrentView('dashboard')}
        />
      )}
    </div>
  );
}

export default App;