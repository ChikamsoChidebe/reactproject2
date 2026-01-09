import React, { useState, useEffect } from 'react';
import { groqAPI } from '../services/groq';

const AICoach = () => {
  const [coachAdvice, setCoachAdvice] = useState([]);
  const [userQuestion, setUserQuestion] = useState('');
  const [chatHistory, setChatHistory] = useState(() => 
    JSON.parse(localStorage.getItem('coachChat') || '[]')
  );
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    generateDailyAdvice();
    localStorage.setItem('coachChat', JSON.stringify(chatHistory));
  }, [chatHistory]);

  const generateDailyAdvice = () => {
    const assignments = JSON.parse(localStorage.getItem('assignments') || '[]');
    const goals = JSON.parse(localStorage.getItem('goals') || '[]');
    const moodHistory = JSON.parse(localStorage.getItem('moodHistory') || '[]');
    const studySessions = JSON.parse(localStorage.getItem('studySessions') || '[]');

    const advice = [];
    const currentHour = new Date().getHours();

    // Time-based advice
    if (currentHour >= 6 && currentHour < 12) {
      advice.push({
        type: 'time',
        title: 'Good Morning, Love Eagles! 🌅',
        message: 'Your brain is at peak performance in the morning. This is the perfect time to tackle your most challenging subjects. In God we trust, and with focus, you can achieve anything!',
        priority: 'high'
      });
    } else if (currentHour >= 12 && currentHour < 17) {
      advice.push({
        type: 'time',
        title: 'Afternoon Focus Time ☀️',
        message: 'Great time for active learning and group study. Your energy is stable - perfect for collaborative work with your study partner!',
        priority: 'medium'
      });
    } else {
      advice.push({
        type: 'time',
        title: 'Evening Reflection 🌙',
        message: 'Wind down with light review and planning for tomorrow. Reflect on today\'s achievements and set intentions for tomorrow.',
        priority: 'low'
      });
    }

    // Progress-based advice
    const completedAssignments = assignments.filter(a => a.completed).length;
    const completionRate = assignments.length > 0 ? (completedAssignments / assignments.length) * 100 : 0;

    if (completionRate >= 80) {
      advice.push({
        type: 'progress',
        title: 'Outstanding Progress! 🌟',
        message: 'You\'re crushing your goals! Your dedication is inspiring. Keep this momentum going and remember to celebrate your wins.',
        priority: 'high'
      });
    } else if (completionRate >= 60) {
      advice.push({
        type: 'progress',
        title: 'Steady Progress 📈',
        message: 'You\'re making good progress! Consider breaking larger tasks into smaller chunks to boost your completion rate.',
        priority: 'medium'
      });
    } else {
      advice.push({
        type: 'progress',
        title: 'Let\'s Boost Your Progress 💪',
        message: 'Every journey starts with a single step. Focus on completing one small task today. You\'ve got this, Love Eagles!',
        priority: 'high'
      });
    }

    // Mood-based advice
    const recentMood = moodHistory[moodHistory.length - 1];
    if (recentMood) {
      if (recentMood.energy < 5) {
        advice.push({
          type: 'wellness',
          title: 'Self-Care Reminder 💙',
          message: 'Your energy seems low. Remember that rest is productive too. Take breaks, stay hydrated, and be kind to yourself.',
          priority: 'high'
        });
      } else if (recentMood.energy >= 8) {
        advice.push({
          type: 'wellness',
          title: 'High Energy Alert! ⚡',
          message: 'You\'re feeling great! This is perfect timing for tackling challenging projects or learning new concepts.',
          priority: 'medium'
        });
      }
    }

    // Study pattern advice
    const recentSessions = studySessions.slice(-7);
    if (recentSessions.length > 0) {
      const avgSessionLength = recentSessions.reduce((sum, s) => sum + s.duration, 0) / recentSessions.length;
      
      if (avgSessionLength < 1800) { // Less than 30 minutes
        advice.push({
          type: 'study',
          title: 'Extend Your Focus Time 🎯',
          message: 'Try gradually increasing your study sessions. Aim for 25-45 minute focused blocks with short breaks.',
          priority: 'medium'
        });
      } else if (avgSessionLength > 7200) { // More than 2 hours
        advice.push({
          type: 'study',
          title: 'Break It Up! 🔄',
          message: 'Long study sessions are great, but remember to take regular breaks to maintain focus and prevent burnout.',
          priority: 'medium'
        });
      }
    }

    setCoachAdvice(advice);
  };

  const askCoach = async () => {
    if (!userQuestion.trim() || isLoading) return;

    setIsLoading(true);
    const assignments = JSON.parse(localStorage.getItem('assignments') || '[]');
    const goals = JSON.parse(localStorage.getItem('goals') || '[]');
    const moodHistory = JSON.parse(localStorage.getItem('moodHistory') || '[]');
    
    const context = {
      completedAssignments: assignments.filter(a => a.completed).length,
      totalAssignments: assignments.length,
      activeGoals: goals.length,
      recentMood: moodHistory[moodHistory.length - 1]?.mood || 'neutral'
    };

    try {
      const response = await groqAPI.coachResponse(userQuestion, context);
      
      const newChat = {
        id: Date.now(),
        question: userQuestion,
        response: response,
        timestamp: new Date().toISOString()
      };

      setChatHistory([...chatHistory, newChat]);
      setUserQuestion('');
    } catch (error) {
      console.error('Error getting AI response:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'border-red-500 bg-red-50';
      case 'medium': return 'border-yellow-500 bg-yellow-50';
      default: return 'border-green-500 bg-green-50';
    }
  };

  const quickQuestions = [
    'How can I stay motivated?',
    'Give me study tips',
    'Help with time management',
    'I\'m feeling stressed',
    'How to improve focus?',
    'Help me set better goals'
  ];

  return (
    <div className="space-y-6">
      {/* Daily Advice */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-purple-800 mb-4">🧠 Your AI Study Coach</h2>
        
        <div className="space-y-4">
          {coachAdvice.map((advice, index) => (
            <div key={index} className={`border-l-4 p-4 rounded-lg ${getPriorityColor(advice.priority)}`}>
              <h3 className="font-semibold text-gray-800 mb-2">{advice.title}</h3>
              <p className="text-gray-700">{advice.message}</p>
              <div className="mt-2">
                <span className={`inline-block px-2 py-1 rounded text-xs ${
                  advice.priority === 'high' ? 'bg-red-200 text-red-800' :
                  advice.priority === 'medium' ? 'bg-yellow-200 text-yellow-800' :
                  'bg-green-200 text-green-800'
                }`}>
                  {advice.type.toUpperCase()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Ask Your Coach */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-bold text-purple-800 mb-4">💬 Ask Your Coach</h3>
        
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={userQuestion}
            onChange={(e) => setUserQuestion(e.target.value)}
            placeholder="Ask me anything about studying, motivation, or time management..."
            className="flex-1 p-3 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            onKeyPress={(e) => e.key === 'Enter' && askCoach()}
          />
          <button
            onClick={askCoach}
            disabled={isLoading}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Thinking...
              </>
            ) : (
              'Ask'
            )}
          </button>
        </div>

        {/* Quick Questions */}
        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2">Quick questions:</p>
          <div className="flex flex-wrap gap-2">
            {quickQuestions.map((question, index) => (
              <button
                key={index}
                onClick={() => setUserQuestion(question)}
                className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm hover:bg-purple-200"
              >
                {question}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Chat History */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-bold text-purple-800 mb-4">📚 Coaching History</h3>
        
        {chatHistory.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No conversations yet. Ask your first question above!</p>
        ) : (
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {chatHistory
              .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
              .map(chat => (
                <div key={chat.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="mb-3">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-purple-600 font-semibold">You:</span>
                      <span className="text-xs text-gray-500">
                        {new Date(chat.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-800 bg-purple-50 p-2 rounded">{chat.question}</p>
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-green-600 font-semibold">🧠 Coach:</span>
                    </div>
                    <p className="text-gray-700 bg-green-50 p-2 rounded">{chat.response}</p>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Weekly Tips */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-bold mb-4">✨ Weekly Wisdom for Love Eagles</h3>
        
        <div className="space-y-3">
          <div className="bg-white/20 rounded-lg p-3">
            <h4 className="font-semibold mb-1 text-white">🎯 This Week's Focus</h4>
            <p className="text-purple-100">Consistency beats perfection. Small daily actions lead to extraordinary results.</p>
          </div>
          
          <div className="bg-white/20 rounded-lg p-3">
            <h4 className="font-semibold mb-1 text-white">💡 Study Technique Spotlight</h4>
            <p className="text-purple-100">Try the Feynman Technique: Explain concepts in simple terms as if teaching a friend.</p>
          </div>
          
          <div className="bg-white/20 rounded-lg p-3">
            <h4 className="font-semibold mb-1 text-white">🙏 Inspiration</h4>
            <p className="text-purple-100">"In God we trust, in ourselves we believe. You are Love Eagles - soar high!" - Your AI Coach</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AICoach;