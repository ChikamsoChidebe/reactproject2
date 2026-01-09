import React, { useState, useEffect } from 'react';

const MoodTracker = () => {
  const [todayMood, setTodayMood] = useState(null);
  const [todayEnergy, setTodayEnergy] = useState(5);
  const [moodHistory, setMoodHistory] = useState(() => 
    JSON.parse(localStorage.getItem('moodHistory') || '[]')
  );

  const moods = [
    { emoji: '😊', label: 'Happy', value: 'happy' },
    { emoji: '😌', label: 'Calm', value: 'calm' },
    { emoji: '😐', label: 'Neutral', value: 'neutral' },
    { emoji: '😔', label: 'Sad', value: 'sad' },
    { emoji: '😤', label: 'Stressed', value: 'stressed' },
    { emoji: '😴', label: 'Tired', value: 'tired' }
  ];

  useEffect(() => {
    localStorage.setItem('moodHistory', JSON.stringify(moodHistory));
  }, [moodHistory]);

  const saveMoodEntry = () => {
    if (!todayMood) return;

    const today = new Date().toDateString();
    const newEntry = {
      date: today,
      mood: todayMood,
      energy: todayEnergy,
      timestamp: new Date().toISOString()
    };

    const updatedHistory = moodHistory.filter(entry => entry.date !== today);
    setMoodHistory([...updatedHistory, newEntry]);
  };

  const getRecommendations = () => {
    if (!todayMood) return null;

    const recommendations = {
      happy: {
        tasks: 'Perfect time for challenging tasks! Your positive mood will help you tackle complex problems.',
        tip: 'Channel this energy into your most important goals today! 🎯'
      },
      calm: {
        tasks: 'Great for focused study sessions and detailed work. Your calm state is perfect for concentration.',
        tip: 'This is an ideal time for deep learning and reflection. 🧘‍♀️'
      },
      neutral: {
        tasks: 'Good for routine tasks and review work. Maintain steady progress.',
        tip: 'A balanced day - perfect for maintaining your study routine. ⚖️'
      },
      sad: {
        tasks: 'Consider lighter tasks today. Maybe review notes or organize your study materials.',
        tip: 'Be gentle with yourself. Small progress is still progress. 💙'
      },
      stressed: {
        tasks: 'Take breaks frequently. Focus on one task at a time to avoid overwhelm.',
        tip: 'Try some breathing exercises or a short walk. You\'ve got this! 🌱'
      },
      tired: {
        tasks: 'Light review work or planning for tomorrow. Don\'t push too hard today.',
        tip: 'Rest is productive too. Consider an early night tonight. 😴'
      }
    };

    return recommendations[todayMood];
  };

  const getMotivationalQuote = () => {
    const quotes = [
      "Success is not final, failure is not fatal: it is the courage to continue that counts. - Winston Churchill",
      "The only way to do great work is to love what you do. - Steve Jobs",
      "Believe you can and you're halfway there. - Theodore Roosevelt",
      "In God we trust, in ourselves we believe. - Love Eagles",
      "Every expert was once a beginner. Keep going! 💪",
      "Your future self will thank you for the work you do today. 🌟"
    ];
    return quotes[Math.floor(Math.random() * quotes.length)];
  };

  return (
    <div className="space-y-6">
      {/* Today's Mood Entry */}
      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-bold text-purple-800 mb-4">😊 How are you feeling today?</h2>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-4 mb-6">
          {moods.map(mood => (
            <button
              key={mood.value}
              onClick={() => setTodayMood(mood.value)}
              className={`p-2 sm:p-4 rounded-lg text-center transition-all ${
                todayMood === mood.value 
                  ? 'bg-purple-100 border-2 border-purple-500 scale-105' 
                  : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100'
              }`}
            >
              <div className="text-2xl sm:text-3xl mb-1 sm:mb-2">{mood.emoji}</div>
              <div className="text-xs sm:text-sm font-medium">{mood.label}</div>
            </button>
          ))}
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2 text-sm sm:text-base">
            Energy Level: {todayEnergy}/10
          </label>
          <input
            type="range"
            min="1"
            max="10"
            value={todayEnergy}
            onChange={(e) => setTodayEnergy(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs sm:text-sm text-gray-500 mt-1">
            <span>Low</span>
            <span>High</span>
          </div>
        </div>

        <button
          onClick={saveMoodEntry}
          disabled={!todayMood}
          className="w-full px-4 py-2 text-sm sm:text-base bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
        >
          Save Today's Mood
        </button>
      </div>

      {/* Recommendations */}
      {getRecommendations() && (
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg shadow-md p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-bold text-purple-800 mb-4">💡 Personalized Recommendations</h3>
          
          <div className="space-y-3 sm:space-y-4">
            <div className="bg-white rounded-lg p-3 sm:p-4">
              <h4 className="font-semibold text-gray-800 mb-2 text-sm sm:text-base">Suggested Tasks:</h4>
              <p className="text-gray-600 text-sm sm:text-base">{getRecommendations().tasks}</p>
            </div>
            
            <div className="bg-white rounded-lg p-3 sm:p-4">
              <h4 className="font-semibold text-gray-800 mb-2 text-sm sm:text-base">Motivational Tip:</h4>
              <p className="text-gray-600 text-sm sm:text-base">{getRecommendations().tip}</p>
            </div>
          </div>
        </div>
      )}

      {/* Motivational Quote */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-lg shadow-md p-4 sm:p-6 text-center">
        <h3 className="text-base sm:text-lg font-bold mb-3 sm:mb-4">✨ Daily Inspiration</h3>
        <p className="text-sm sm:text-lg italic leading-relaxed">{getMotivationalQuote()}</p>
      </div>

      {/* Mood History */}
      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-bold text-purple-800 mb-4">📊 Mood History</h3>
        
        {moodHistory.length === 0 ? (
          <p className="text-gray-500 text-center py-6 sm:py-8 text-sm sm:text-base">No mood entries yet. Start tracking today!</p>
        ) : (
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {moodHistory
              .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
              .slice(0, 10)
              .map((entry, index) => {
                const mood = moods.find(m => m.value === entry.mood);
                return (
                  <div key={index} className="flex items-center justify-between p-2 sm:p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <span className="text-xl sm:text-2xl">{mood?.emoji}</span>
                      <div>
                        <div className="font-medium text-sm sm:text-base">{mood?.label}</div>
                        <div className="text-xs sm:text-sm text-gray-500">{entry.date}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs sm:text-sm text-gray-600">Energy: {entry.energy}/10</div>
                    </div>
                  </div>
                );
              })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MoodTracker;