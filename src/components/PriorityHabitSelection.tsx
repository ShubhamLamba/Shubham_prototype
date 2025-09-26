import React, { useState } from 'react';
import { ArrowLeft, Star, Target, Book, Brain, Plus, ChevronRight } from 'lucide-react';
import { PriorityHabit } from '../types';

interface PriorityHabitSelectionProps {
  onComplete: (priorityHabit: Omit<PriorityHabit, 'id' | 'createdAt'>) => void;
  onBack: () => void;
}

const PriorityHabitSelection: React.FC<PriorityHabitSelectionProps> = ({ onComplete, onBack }) => {
  const [selectedHabit, setSelectedHabit] = useState<string>('');
  const [customHabit, setCustomHabit] = useState('');
  const [daysPerWeek, setDaysPerWeek] = useState(3);
  const [showCustomInput, setShowCustomInput] = useState(false);

  const predefinedHabits = [
    { id: 'gym', name: 'Gym Workout', icon: '💪', category: 'Fitness' },
    { id: 'reading', name: 'Reading', icon: '📚', category: 'Learning' },
    { id: 'meditation', name: 'Meditation', icon: '🧘', category: 'Wellness' },
    { id: 'custom', name: 'Custom Habit', icon: '✨', category: 'Personal' }
  ];

  const handleHabitSelect = (habitId: string) => {
    setSelectedHabit(habitId);
    if (habitId === 'custom') {
      setShowCustomInput(true);
    } else {
      setShowCustomInput(false);
      setCustomHabit('');
    }
  };

  const handleComplete = () => {
    const selectedHabitData = predefinedHabits.find(h => h.id === selectedHabit);
    if (!selectedHabitData) return;

    const habitName = selectedHabit === 'custom' ? customHabit : selectedHabitData.name;
    if (!habitName.trim()) return;

    onComplete({
      name: habitName,
      category: selectedHabitData.category,
      daysPerWeek,
      isActive: true
    });
  };

  const canProceed = selectedHabit && (selectedHabit !== 'custom' || customHabit.trim());

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
            <h1 className="text-xl font-bold text-gray-800">Choose Your Priority Habit</h1>
            <p className="text-sm text-gray-600">What would you like to focus on?</p>
          </div>
        </div>

        {/* Introduction */}
        <div className="bg-gradient-to-r from-purple-100 to-blue-100 rounded-xl p-6 shadow-sm mb-6">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center flex-shrink-0">
              <Star className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-800 mb-2">Your Priority Habit</h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                Choose one habit to focus on. We'll help you build it gradually with emotional check-ins and adaptive actions.
              </p>
            </div>
          </div>
        </div>

        {/* Habit Selection */}
        <div className="space-y-3 mb-6">
          <h3 className="font-semibold text-gray-800">Select a habit:</h3>
          {predefinedHabits.map(habit => (
            <button
              key={habit.id}
              onClick={() => handleHabitSelect(habit.id)}
              className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                selectedHabit === habit.id
                  ? 'bg-purple-100 text-purple-700 border-purple-200 scale-105'
                  : 'bg-white border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{habit.icon}</span>
                <div className="flex-1">
                  <div className="font-medium">{habit.name}</div>
                  <div className="text-sm text-gray-600">{habit.category}</div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            </button>
          ))}
        </div>

        {/* Custom Habit Input */}
        {showCustomInput && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              What's your custom habit?
            </label>
            <input
              type="text"
              value={customHabit}
              onChange={(e) => setCustomHabit(e.target.value)}
              placeholder="e.g., Write in journal, Practice guitar..."
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        )}

        {/* Frequency Selection */}
        {selectedHabit && (
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              How many days per week?
            </label>
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm text-gray-600">Days per week</span>
                <span className="text-lg font-bold text-purple-600">{daysPerWeek}</span>
              </div>
              <input
                type="range"
                min="1"
                max="7"
                value={daysPerWeek}
                onChange={(e) => setDaysPerWeek(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>1</span>
                <span>2</span>
                <span>3</span>
                <span>4</span>
                <span>5</span>
                <span>6</span>
                <span>7</span>
              </div>
            </div>
            
            <div className="mt-3 text-center">
              <p className="text-sm text-gray-600">
                {daysPerWeek === 1 && "Perfect for starting small! 🌱"}
                {daysPerWeek === 2 && "Great for building consistency! 💪"}
                {daysPerWeek === 3 && "Excellent balance! ⭐"}
                {daysPerWeek === 4 && "You're ambitious! 🚀"}
                {daysPerWeek === 5 && "Weekday warrior! 🔥"}
                {daysPerWeek === 6 && "Almost daily - impressive! 🏆"}
                {daysPerWeek === 7 && "Daily dedication! 🌟"}
              </p>
            </div>
          </div>
        )}

        {/* Continue Button */}
        <button
          onClick={handleComplete}
          disabled={!canProceed}
          className="w-full py-4 bg-purple-600 text-white rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
        >
          <Target className="w-5 h-5" />
          Set as Priority Habit
        </button>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #8B5CF6;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        
        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #8B5CF6;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
      `}</style>
    </div>
  );
};

export default PriorityHabitSelection;