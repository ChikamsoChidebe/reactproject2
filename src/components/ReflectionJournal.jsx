import React, { useState, useEffect } from 'react';

const ReflectionJournal = () => {
  const [entries, setEntries] = useState(() => 
    JSON.parse(localStorage.getItem('journalEntries') || '[]')
  );
  const [todayEntry, setTodayEntry] = useState({
    accomplishments: '',
    gratitude: '',
    challenges: '',
    tomorrow: '',
    mood: 'good'
  });
  const [hasEntryToday, setHasEntryToday] = useState(false);

  useEffect(() => {
    localStorage.setItem('journalEntries', JSON.stringify(entries));
    checkTodayEntry();
  }, [entries]);

  const checkTodayEntry = () => {
    const today = new Date().toDateString();
    const existingEntry = entries.find(entry => entry.date === today);
    
    if (existingEntry) {
      setTodayEntry(existingEntry);
      setHasEntryToday(true);
    } else {
      setHasEntryToday(false);
    }
  };

  const saveEntry = () => {
    const today = new Date().toDateString();
    const entryToSave = {
      ...todayEntry,
      date: today,
      timestamp: new Date().toISOString(),
      id: Date.now()
    };

    if (hasEntryToday) {
      setEntries(entries.map(entry => 
        entry.date === today ? entryToSave : entry
      ));
    } else {
      setEntries([...entries, entryToSave]);
    }

    setHasEntryToday(true);
  };

  const getPrompts = () => {
    const prompts = {
      accomplishments: [
        "What did I complete today that I'm proud of?",
        "What progress did I make on my goals?",
        "What new skill or knowledge did I gain?",
        "How did I help someone today?",
        "What challenge did I overcome?"
      ],
      gratitude: [
        "What am I most grateful for today?",
        "Who made my day better?",
        "What opportunity am I thankful for?",
        "What simple pleasure did I enjoy?",
        "What blessing did I notice today?"
      ],
      challenges: [
        "What was difficult about today?",
        "What would I do differently?",
        "What did I learn from my mistakes?",
        "How can I improve tomorrow?",
        "What support do I need?"
      ],
      tomorrow: [
        "What's my main priority for tomorrow?",
        "How do I want to feel tomorrow?",
        "What will make tomorrow successful?",
        "What am I looking forward to?",
        "How will I take care of myself tomorrow?"
      ]
    };

    return prompts;
  };

  const getRandomPrompt = (category) => {
    const prompts = getPrompts()[category];
    return prompts[Math.floor(Math.random() * prompts.length)];
  };

  const getStreakCount = () => {
    const sortedEntries = entries
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    let streak = 0;
    let currentDate = new Date();
    
    for (let i = 0; i < 30; i++) { // Check last 30 days
      const dateStr = currentDate.toDateString();
      const hasEntry = sortedEntries.some(entry => entry.date === dateStr);
      
      if (hasEntry) {
        streak++;
      } else if (i > 0) { // Don't break on first day if no entry today
        break;
      }
      
      currentDate.setDate(currentDate.getDate() - 1);
    }
    
    return streak;
  };

  const getInsights = () => {
    if (entries.length < 3) return null;

    const recentEntries = entries
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, 7);

    const moodCounts = {};
    recentEntries.forEach(entry => {
      moodCounts[entry.mood] = (moodCounts[entry.mood] || 0) + 1;
    });

    const dominantMood = Object.entries(moodCounts)
      .sort((a, b) => b[1] - a[1])[0][0];

    const commonWords = {};
    recentEntries.forEach(entry => {
      const words = (entry.accomplishments + ' ' + entry.gratitude)
        .toLowerCase()
        .split(/\W+/)
        .filter(word => word.length > 3);
      
      words.forEach(word => {
        commonWords[word] = (commonWords[word] || 0) + 1;
      });
    });

    const topWords = Object.entries(commonWords)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([word]) => word);

    return {
      dominantMood,
      topWords,
      entryCount: recentEntries.length
    };
  };

  const insights = getInsights();
  const streak = getStreakCount();

  const moodEmojis = {
    excellent: '🌟',
    good: '😊',
    okay: '😐',
    challenging: '😔',
    difficult: '😰'
  };

  return (
    <div className="space-y-6">
      {/* Today's Entry */}
      <div className="glass rounded-2xl shadow-xl p-8 card-hover">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold gradient-text">📖 Daily Reflection</h2>
          <div className="text-sm text-gray-600 bg-white/50 px-3 py-1 rounded-full">
            {new Date().toLocaleDateString()} • Streak: {streak} days 🔥
          </div>
        </div>

        <div className="space-y-8">
          {/* Accomplishments */}
          <div className="glass rounded-2xl p-6 card-hover">
            <label className="block text-gray-700 font-semibold mb-3 flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              What did I accomplish today?
            </label>
            <p className="text-sm text-gray-500 mb-3 italic">
              {getRandomPrompt('accomplishments')}
            </p>
            <textarea
              value={todayEntry.accomplishments}
              onChange={(e) => setTodayEntry({...todayEntry, accomplishments: e.target.value})}
              className="w-full h-24 p-4 border-0 bg-white/50 backdrop-blur-sm rounded-xl focus:ring-2 focus:ring-purple-500 transition-all enhanced-input"
              placeholder="Write about your achievements, progress, and wins today..."
            />
          </div>

          {/* Gratitude */}
          <div className="glass rounded-2xl p-6 card-hover">
            <label className="block text-gray-700 font-semibold mb-3 flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
                </svg>
              </div>
              What am I grateful for?
            </label>
            <p className="text-sm text-gray-500 mb-3 italic">
              {getRandomPrompt('gratitude')}
            </p>
            <textarea
              value={todayEntry.gratitude}
              onChange={(e) => setTodayEntry({...todayEntry, gratitude: e.target.value})}
              className="w-full h-24 p-4 border-0 bg-white/50 backdrop-blur-sm rounded-xl focus:ring-2 focus:ring-purple-500 transition-all enhanced-input"
              placeholder="Express gratitude for people, experiences, or opportunities..."
            />
          </div>

          {/* Challenges */}
          <div className="glass rounded-2xl p-6 card-hover">
            <label className="block text-gray-700 font-semibold mb-3 flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                </svg>
              </div>
              What challenged me today?
            </label>
            <p className="text-sm text-gray-500 mb-3 italic">
              {getRandomPrompt('challenges')}
            </p>
            <textarea
              value={todayEntry.challenges}
              onChange={(e) => setTodayEntry({...todayEntry, challenges: e.target.value})}
              className="w-full h-20 p-4 border-0 bg-white/50 backdrop-blur-sm rounded-xl focus:ring-2 focus:ring-purple-500 transition-all enhanced-input"
              placeholder="Reflect on difficulties and what you learned..."
            />
          </div>

          {/* Tomorrow's Intention */}
          <div className="glass rounded-2xl p-6 card-hover">
            <label className="block text-gray-700 font-semibold mb-3 flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
              </div>
              How will I make tomorrow great?
            </label>
            <p className="text-sm text-gray-500 mb-3 italic">
              {getRandomPrompt('tomorrow')}
            </p>
            <textarea
              value={todayEntry.tomorrow}
              onChange={(e) => setTodayEntry({...todayEntry, tomorrow: e.target.value})}
              className="w-full h-20 p-4 border-0 bg-white/50 backdrop-blur-sm rounded-xl focus:ring-2 focus:ring-purple-500 transition-all enhanced-input"
              placeholder="Set intentions and priorities for tomorrow..."
            />
          </div>

          <button
            onClick={saveEntry}
            className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:from-purple-700 hover:to-indigo-700 font-semibold text-lg shadow-lg btn-scale transition-all flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            {hasEntryToday ? 'Update Today\'s Entry' : 'Save Today\'s Entry'}
          </button>
        </div>
      </div>

      {/* Insights */}
      {insights && (
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg shadow-md p-6">
          <h3 className="text-lg font-bold text-purple-800 mb-4">✨ Weekly Insights</h3>
          
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg p-4 text-center">
              <div className="text-3xl mb-2">{moodEmojis[insights.dominantMood]}</div>
              <div className="font-semibold text-gray-800">Dominant Mood</div>
              <div className="text-sm text-gray-600 capitalize">{insights.dominantMood}</div>
            </div>
            
            <div className="bg-white rounded-lg p-4 text-center">
              <div className="text-3xl mb-2">📝</div>
              <div className="font-semibold text-gray-800">Journal Entries</div>
              <div className="text-sm text-gray-600">{insights.entryCount} this week</div>
            </div>
            
            <div className="bg-white rounded-lg p-4 text-center">
              <div className="text-3xl mb-2">🔥</div>
              <div className="font-semibold text-gray-800">Current Streak</div>
              <div className="text-sm text-gray-600">{streak} days</div>
            </div>
          </div>

          {insights.topWords.length > 0 && (
            <div className="mt-4 p-4 bg-white rounded-lg">
              <h4 className="font-semibold text-gray-800 mb-2">🏷️ Your Focus Words</h4>
              <div className="flex flex-wrap gap-2">
                {insights.topWords.map(word => (
                  <span key={word} className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                    {word}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Past Entries */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-bold text-purple-800 mb-4">📚 Past Reflections</h3>
        
        {entries.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No entries yet. Start your reflection journey today!</p>
        ) : (
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {entries
              .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
              .slice(1, 8) // Skip today's entry, show last 7
              .map(entry => (
                <div key={entry.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-3">
                    <div className="font-semibold text-gray-800">{entry.date}</div>
                    <div className="text-2xl">{moodEmojis[entry.mood]}</div>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    {entry.accomplishments && (
                      <div>
                        <span className="font-medium text-purple-700">Accomplishments:</span>
                        <p className="text-gray-700 mt-1">{entry.accomplishments}</p>
                      </div>
                    )}
                    
                    {entry.gratitude && (
                      <div>
                        <span className="font-medium text-green-700">Gratitude:</span>
                        <p className="text-gray-700 mt-1">{entry.gratitude}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Inspirational Quote */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-lg shadow-md p-6 text-center">
        <h3 className="text-lg font-bold mb-4">💫 Daily Inspiration for Love Eagles</h3>
        <p className="text-lg italic mb-2">
          "Gratitude turns what we have into enough, and more. It turns denial into acceptance, chaos into order, confusion into clarity."
        </p>
        <p className="text-purple-200 text-sm">In God We Trust - Uche Nora & Chikamso Chidebe</p>
      </div>
    </div>
  );
};

export default ReflectionJournal;