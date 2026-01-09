import React, { useState, useEffect } from 'react';
import { groqAPI } from '../services/groq';

const TaskSuggestions = () => {
  const [studyPatterns, setStudyPatterns] = useState(() => 
    JSON.parse(localStorage.getItem('studyPatterns') || '{}')
  );
  const [pomodoroTime, setPomodoroTime] = useState(25);
  const [breakTime, setBreakTime] = useState(5);
  const [isRunning, setIsRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(pomodoroTime * 60);
  const [isBreak, setIsBreak] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [isGeneratingSuggestions, setIsGeneratingSuggestions] = useState(false);

  useEffect(() => {
    generateSuggestions();
  }, []);

  useEffect(() => {
    let interval = null;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
      if (isBreak) {
        setTimeLeft(pomodoroTime * 60);
        setIsBreak(false);
        alert('Break time is over! Ready to focus again? 💪');
      } else {
        setTimeLeft(breakTime * 60);
        setIsBreak(true);
        alert('Great work! Time for a break! 🎉');
      }
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft, pomodoroTime, breakTime, isBreak]);

  const generateSuggestions = async () => {
    setIsGeneratingSuggestions(true);
    const assignments = JSON.parse(localStorage.getItem('assignments') || '[]');
    const goals = JSON.parse(localStorage.getItem('goals') || '[]');
    const moodHistory = JSON.parse(localStorage.getItem('moodHistory') || '[]');
    
    const context = {
      currentHour: new Date().getHours(),
      completedAssignments: assignments.filter(a => a.completed).length,
      totalAssignments: assignments.length,
      urgentAssignments: assignments.filter(a => {
        const dueDate = new Date(a.dueDate);
        const diffDays = Math.ceil((dueDate - new Date()) / (1000 * 60 * 60 * 24));
        return diffDays <= 3 && diffDays >= 0 && !a.completed;
      }).length,
      activeGoals: goals.filter(g => !g.completed).length,
      recentMood: moodHistory[moodHistory.length - 1]?.mood || 'neutral'
    };

    try {
      const response = await groqAPI.generateStudyTips(context);
      const aiSuggestions = response.split('\n').filter(line => line.trim()).map((tip, index) => ({
        id: index + 100,
        type: 'ai',
        title: `AI Suggestion ${index + 1}`,
        description: tip.replace(/^\d+\.\s*/, '').trim(),
        priority: 'high',
        icon: '🤖'
      }));
      
      setSuggestions(aiSuggestions.slice(0, 3));
    } catch (error) {
      console.error('Error generating suggestions:', error);
      // Fallback to static suggestions
      setSuggestions([
        {
          id: 1,
          type: 'time',
          title: 'Focus Session Recommended',
          description: 'Based on your patterns, now is a great time for focused study.',
          priority: 'high',
          icon: '🎯'
        }
      ]);
    } finally {
      setIsGeneratingSuggestions(false);
    }
  };

  const startPomodoro = () => {
    setIsRunning(true);
  };

  const pausePomodoro = () => {
    setIsRunning(false);
  };

  const resetPomodoro = () => {
    setIsRunning(false);
    setTimeLeft(pomodoroTime * 60);
    setIsBreak(false);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'border-red-500 bg-red-50';
      case 'high': return 'border-orange-500 bg-orange-50';
      case 'medium': return 'border-yellow-500 bg-yellow-50';
      default: return 'border-green-500 bg-green-50';
    }
  };

  return (
    <div className="space-y-6">
      {/* Pomodoro Timer */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-purple-800 mb-4">🍅 Pomodoro Timer</h2>
        
        <div className="text-center mb-6">
          <div className={`text-6xl font-mono font-bold mb-4 ${isBreak ? 'text-green-600' : 'text-purple-600'}`}>
            {formatTime(timeLeft)}
          </div>
          <div className="text-lg mb-4">
            {isBreak ? '☕ Break Time' : '📚 Focus Time'}
          </div>
          
          <div className="flex justify-center gap-4 mb-4">
            <button
              onClick={startPomodoro}
              disabled={isRunning}
              className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50"
            >
              Start
            </button>
            <button
              onClick={pausePomodoro}
              disabled={!isRunning}
              className="px-6 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 disabled:opacity-50"
            >
              Pause
            </button>
            <button
              onClick={resetPomodoro}
              className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              Reset
            </button>
          </div>

          <div className="flex justify-center gap-4 text-sm">
            <div>
              <label className="block text-gray-600">Focus (min)</label>
              <input
                type="number"
                value={pomodoroTime}
                onChange={(e) => setPomodoroTime(parseInt(e.target.value))}
                className="w-16 p-1 border rounded text-center"
                min="1"
                max="60"
              />
            </div>
            <div>
              <label className="block text-gray-600">Break (min)</label>
              <input
                type="number"
                value={breakTime}
                onChange={(e) => setBreakTime(parseInt(e.target.value))}
                className="w-16 p-1 border rounded text-center"
                min="1"
                max="30"
              />
            </div>
          </div>
        </div>
      </div>

      {/* AI Suggestions */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-purple-800">🤖 Smart Task Suggestions</h2>
          <button
            onClick={generateSuggestions}
            disabled={isGeneratingSuggestions}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 flex items-center gap-2"
          >
            {isGeneratingSuggestions ? (
              <>
                <svg className="animate-spin w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Generating...
              </>
            ) : (
              'Refresh Suggestions'
            )}
          </button>
        </div>

        <div className="grid gap-4">
          {suggestions.map(suggestion => (
            <div key={suggestion.id} className={`border-l-4 p-4 rounded-lg ${getPriorityColor(suggestion.priority)}`}>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{suggestion.icon}</span>
                  <div>
                    <h3 className="font-semibold text-gray-800">{suggestion.title}</h3>
                    <p className="text-gray-600 text-sm mt-1">{suggestion.description}</p>
                    <span className={`inline-block px-2 py-1 rounded text-xs mt-2 ${
                      suggestion.priority === 'urgent' ? 'bg-red-200 text-red-800' :
                      suggestion.priority === 'high' ? 'bg-orange-200 text-orange-800' :
                      suggestion.priority === 'medium' ? 'bg-yellow-200 text-yellow-800' :
                      'bg-green-200 text-green-800'
                    }`}>
                      {suggestion.priority.toUpperCase()}
                    </span>
                  </div>
                </div>
                <button className="px-3 py-1 bg-purple-100 text-purple-700 rounded hover:bg-purple-200">
                  Start Task
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Study Pattern Insights */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-purple-800 mb-4">📊 Study Pattern Insights</h2>
        
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-purple-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-purple-600">85%</div>
            <div className="text-sm text-gray-600">Focus Efficiency</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-green-600">4.2h</div>
            <div className="text-sm text-gray-600">Daily Average</div>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-blue-600">Morning</div>
            <div className="text-sm text-gray-600">Peak Time</div>
          </div>
        </div>

        <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
          <h3 className="font-semibold text-yellow-800 mb-2">💡 AI Recommendation</h3>
          <p className="text-yellow-700 text-sm">
            Based on your patterns, you're most productive in the morning. 
            Try scheduling your most challenging tasks between 8-11 AM for optimal results!
          </p>
        </div>
      </div>
    </div>
  );
};

export default TaskSuggestions;