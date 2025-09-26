import React from 'react';
import { ArrowLeft, TrendingUp, Heart, Target, CheckCircle, Star, Crown } from 'lucide-react';
import { Task, PriorityHabitEvent } from '../types';

interface WeeklyInsightsProps {
  tasks: Task[];
  priorityHabitEvents?: PriorityHabitEvent[];
  priorityHabitTarget?: number;
  onBack: () => void;
}

const WeeklyInsights: React.FC<WeeklyInsightsProps> = ({ 
  tasks, 
  priorityHabitEvents = [], 
  priorityHabitTarget = 0,
  onBack 
}) => {
  const completedTasks = tasks.filter(t => t.completed);
  const priorityTasks = tasks.filter(t => t.isPriority);
  const completedPriorityTasks = priorityTasks.filter(t => t.completed);
  const tasksWithMoodData = completedTasks.filter(t => t.lastCheckin && t.completionMood);

  // Calculate priority habit progress for the week
  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - weekStart.getDay());
  weekStart.setHours(0, 0, 0, 0);
  
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 6);
  weekEnd.setHours(23, 59, 59, 999);
  
  const thisWeekPriorityEvents = priorityHabitEvents.filter(event => {
    const eventDate = new Date(event.date);
    return eventDate >= weekStart && eventDate <= weekEnd && event.completed;
  });
  
  const priorityHabitProgress = thisWeekPriorityEvents.length;

  // Calculate mood improvement
  const moodScores = {
    'stressed': 1,
    'tired': 2,
    'unmotivated': 2,
    'neutral': 3,
    'good': 5
  };

  const avgInitialMood = tasksWithMoodData.length > 0 
    ? tasksWithMoodData.reduce((acc, task) => acc + moodScores[task.lastCheckin!.mood], 0) / tasksWithMoodData.length
    : 3;

  const avgCompletionMood = tasksWithMoodData.length > 0
    ? tasksWithMoodData.reduce((acc, task) => acc + moodScores[task.completionMood!], 0) / tasksWithMoodData.length
    : 3;

  const moodImprovement = ((avgCompletionMood - avgInitialMood) / avgInitialMood * 100);

  const stats = [
    {
      title: 'Tasks Completed',
      value: completedTasks.length,
      icon: CheckCircle,
      color: 'text-green-600 bg-green-100'
    },
    {
      title: 'Mood Improvement',
      value: `${moodImprovement > 0 ? '+' : ''}${Math.round(moodImprovement)}%`,
      icon: TrendingUp,
      color: moodImprovement > 0 ? 'text-green-600 bg-green-100' : 'text-orange-600 bg-orange-100'
    },
    {
      title: 'Check-ins Done',
      value: tasksWithMoodData.length,
      icon: Heart,
      color: 'text-purple-600 bg-purple-100'
    }
  ];

  const insights = [
    {
      title: "Small Steps Work",
      description: "Taking micro-actions led to task completion 73% of the time when you felt unmotivated.",
      icon: "🎯"
    },
    {
      title: "Mood Boost",
      description: `You felt ${moodImprovement > 0 ? 'better' : 'about the same'} after completing tasks, showing the power of action.`,
      icon: "💙"
    },
    {
      title: "Consistency Wins",
      description: "Even on tough days, you showed up. That's the real victory.",
      icon: "⭐"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button 
            onClick={onBack}
            className="p-2 bg-white rounded-full shadow-sm hover:shadow-md transition-shadow"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-gray-800">Weekly Insights</h1>
            <p className="text-sm text-gray-600">Your emotional productivity journey</p>
          </div>
        </div>

        {/* Priority Habit Progress */}
        {priorityHabitTarget > 0 && (
          <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl p-6 shadow-sm mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <Star className="w-5 h-5 text-purple-600 fill-current" />
              </div>
              <div>
                <h3 className="font-bold text-gray-800">Priority Habit Progress</h3>
                <p className="text-sm text-gray-600">This week's focus</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl font-bold text-purple-600">
                {priorityHabitProgress}/{priorityHabitTarget}
              </span>
              <span className="text-sm text-gray-600">days completed</span>
            </div>
            
            <div className="w-full bg-white/50 rounded-full h-3 mb-3">
              <div 
                className="bg-purple-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${Math.min((priorityHabitProgress / priorityHabitTarget) * 100, 100)}%` }}
              />
            </div>
            
            <p className="text-sm text-gray-700">
              {priorityHabitProgress >= priorityHabitTarget 
                ? "🎉 Amazing! You hit your target this week!" 
                : priorityHabitProgress > 0
                  ? `Great progress! ${priorityHabitTarget - priorityHabitProgress} more to go.`
                  : "Ready to start your priority habit journey?"
              }
            </p>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-4 mb-6">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mood Trend */}
        <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Heart className="w-5 h-5 text-red-500" />
            Emotional Journey
          </h3>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Before Tasks</span>
              <div className="flex items-center gap-2">
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-orange-400 h-2 rounded-full transition-all"
                    style={{ width: `${(avgInitialMood / 5) * 100}%` }}
                  />
                </div>
                <span className="text-sm font-medium">{avgInitialMood.toFixed(1)}/5</span>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">After Tasks</span>
              <div className="flex items-center gap-2">
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full transition-all"
                    style={{ width: `${(avgCompletionMood / 5) * 100}%` }}
                  />
                </div>
                <span className="text-sm font-medium">{avgCompletionMood.toFixed(1)}/5</span>
              </div>
            </div>
          </div>
        </div>

        {/* Task Breakdown */}
        <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
          <h3 className="font-semibold text-gray-800 mb-4">Task Breakdown</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-purple-600 fill-current" />
                <span className="text-sm text-gray-600">Priority Tasks</span>
              </div>
              <span className="font-medium">{completedPriorityTasks.length}/{priorityTasks.length}</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-blue-600" />
                <span className="text-sm text-gray-600">Regular Tasks</span>
              </div>
              <span className="font-medium">{completedTasks.length - completedPriorityTasks.length}</span>
            </div>
          </div>
        </div>

        {/* Insights */}
        <div className="space-y-4 mb-6">
          <h3 className="font-semibold text-gray-800">Key Insights</h3>
          {[
            {
              title: "Priority Focus Works",
              description: priorityHabitProgress > 0 
                ? `You completed your priority habit ${priorityHabitProgress} times this week! Consistency is building.`
                : "Ready to start focusing on your priority habit? Small steps lead to big changes.",
              icon: "🎯"
            },
            {
              title: "Mood Boost",
              description: `You felt ${moodImprovement > 0 ? 'better' : 'about the same'} after completing tasks, showing the power of action.`,
              icon: "💙"
            },
            {
              title: "Consistency Wins",
              description: "Even on tough days, you showed up. That's the real victory.",
              icon: "⭐"
            }
          ].map((insight, index) => (
            <div key={index} className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-start gap-3">
                <span className="text-2xl">{insight.icon}</span>
                <div>
                  <h4 className="font-medium text-gray-800 mb-1">{insight.title}</h4>
                  <p className="text-sm text-gray-600 leading-relaxed">{insight.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Encouragement */}
        <div className="bg-gradient-to-r from-purple-100 to-blue-100 rounded-xl p-6 shadow-sm">
          <h4 className="font-bold text-gray-800 mb-2">Keep Going! 🌟</h4>
          <p className="text-gray-700 text-sm leading-relaxed">
            Every small step you take is building a stronger, more resilient you. 
            Your willingness to check in with your emotions and adapt is already making a difference.
          </p>
        </div>
      </div>
    </div>
  );
};

export default WeeklyInsights;