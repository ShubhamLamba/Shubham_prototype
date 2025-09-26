import React, { useState } from 'react';
import { ArrowLeft, Star, Battery, Heart, Target } from 'lucide-react';
import { EmotionalState, PriorityHabit } from '../types';

interface PriorityHabitCheckinProps {
  priorityHabit: PriorityHabit;
  onComplete: (response: {
    willingness: 'low' | 'medium' | 'high';
    emotion: EmotionalState;
    adaptiveAction: string;
  }) => void;
  onBack: () => void;
}

const PriorityHabitCheckin: React.FC<PriorityHabitCheckinProps> = ({ 
  priorityHabit, 
  onComplete, 
  onBack 
}) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [willingness, setWillingness] = useState<'low' | 'medium' | 'high' | null>(null);
  const [emotion, setEmotion] = useState<EmotionalState | null>(null);

  const willingnessOptions = [
    { 
      value: 'low' as const, 
      label: 'Low', 
      description: 'Really not feeling it today',
      color: 'bg-red-50 text-red-700 border-red-200',
      emoji: '😔'
    },
    { 
      value: 'medium' as const, 
      label: 'Medium', 
      description: 'Could probably do something small',
      color: 'bg-yellow-50 text-yellow-700 border-yellow-200',
      emoji: '😐'
    },
    { 
      value: 'high' as const, 
      label: 'High', 
      description: 'Ready to tackle this!',
      color: 'bg-green-50 text-green-700 border-green-200',
      emoji: '😊'
    }
  ];

  const emotionOptions = [
    { value: 'stressed' as EmotionalState, label: 'Stressed', emoji: '😰', color: 'bg-red-100 text-red-700 border-red-200' },
    { value: 'tired' as EmotionalState, label: 'Tired', emoji: '😴', color: 'bg-orange-100 text-orange-700 border-orange-200' },
    { value: 'unmotivated' as EmotionalState, label: 'Unmotivated', emoji: '😑', color: 'bg-gray-100 text-gray-700 border-gray-200' },
    { value: 'neutral' as EmotionalState, label: 'Neutral', emoji: '😐', color: 'bg-blue-100 text-blue-700 border-blue-200' },
    { value: 'good' as EmotionalState, label: 'Good', emoji: '😊', color: 'bg-green-100 text-green-700 border-green-200' }
  ];

  const generateAdaptiveAction = (willingness: 'low' | 'medium' | 'high', emotion: EmotionalState): string => {
    const habitName = priorityHabit.name.toLowerCase();
    
    if (willingness === 'high' && (emotion === 'good' || emotion === 'neutral')) {
      return `Perfect energy! Do your full ${priorityHabit.name} session today! 🚀`;
    }
    
    if (willingness === 'medium') {
      if (habitName.includes('gym') || habitName.includes('workout')) {
        return 'Put on your workout clothes and do 10 minutes of light movement';
      } else if (habitName.includes('reading')) {
        return 'Read just one page or chapter - that counts!';
      } else if (habitName.includes('meditation')) {
        return 'Try a 5-minute breathing exercise instead';
      } else {
        return `Do a mini version of ${priorityHabit.name} for just 10 minutes`;
      }
    }
    
    // Low willingness - micro actions
    if (habitName.includes('gym') || habitName.includes('workout')) {
      return 'Just put on your workout clothes and take 3 deep breaths';
    } else if (habitName.includes('reading')) {
      return 'Open your book and read one paragraph';
    } else if (habitName.includes('meditation')) {
      return 'Take 3 mindful breaths right where you are';
    } else {
      return `Take one tiny step toward ${priorityHabit.name} - even 2 minutes counts`;
    }
  };

  const handleNext = () => {
    if (step === 1 && willingness) {
      setStep(2);
    } else if (step === 2 && emotion && willingness) {
      const adaptiveAction = generateAdaptiveAction(willingness, emotion);
      onComplete({
        willingness,
        emotion,
        adaptiveAction
      });
    }
  };

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
            <h1 className="text-xl font-bold text-gray-800">Priority Habit Check-in</h1>
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-purple-600" />
              <p className="text-sm text-gray-600">{priorityHabit.name}</p>
            </div>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-500 mb-2">
            <span>Step {step} of 2</span>
            <span>{Math.round((step / 2) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-purple-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / 2) * 100}%` }}
            />
          </div>
        </div>

        {step === 1 && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Battery className="w-8 h-8 text-purple-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">How willing are you?</h2>
              <p className="text-gray-600">To do your {priorityHabit.name} today?</p>
            </div>

            <div className="space-y-3">
              {willingnessOptions.map(option => (
                <button
                  key={option.value}
                  onClick={() => setWillingness(option.value)}
                  className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                    willingness === option.value 
                      ? option.color + ' scale-105 shadow-md' 
                      : 'bg-white border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{option.emoji}</span>
                    <div className="flex-1">
                      <div className="font-medium">{option.label}</div>
                      <div className="text-sm opacity-70">{option.description}</div>
                    </div>
                    <Battery className="w-5 h-5" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">How are you feeling?</h2>
              <p className="text-gray-600">Right now, emotionally</p>
            </div>

            <div className="space-y-3">
              {emotionOptions.map(option => (
                <button
                  key={option.value}
                  onClick={() => setEmotion(option.value)}
                  className={`w-full p-4 rounded-xl border-2 transition-all ${
                    emotion === option.value 
                      ? option.color + ' scale-105 shadow-md' 
                      : 'bg-white border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{option.emoji}</span>
                    <span className="font-medium">{option.label}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Continue Button */}
        <button
          onClick={handleNext}
          disabled={(!willingness && step === 1) || (!emotion && step === 2)}
          className="w-full mt-8 py-4 bg-purple-600 text-white rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
        >
          {step === 1 ? (
            <>
              Continue
              <Target className="w-5 h-5" />
            </>
          ) : (
            <>
              Get My Action Plan
              <Star className="w-5 h-5" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default PriorityHabitCheckin;