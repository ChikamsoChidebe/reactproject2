import React, { useState, useEffect } from 'react';

const StudyTimer = () => {
  const [sessions, setSessions] = useState(() => 
    JSON.parse(localStorage.getItem('studySessions') || '[]')
  );
  const [currentSession, setCurrentSession] = useState({
    subject: '',
    task: '',
    duration: 0,
    startTime: null,
    isActive: false
  });
  const [breakReminder, setBreakReminder] = useState(true);
  const [studyStreak, setStudyStreak] = useState(0);

  useEffect(() => {
    localStorage.setItem('studySessions', JSON.stringify(sessions));
    calculateStreak();
  }, [sessions]);

  useEffect(() => {
    let interval = null;
    if (currentSession.isActive) {
      interval = setInterval(() => {
        setCurrentSession(prev => ({
          ...prev,
          duration: prev.duration + 1
        }));
        
        // Break reminder every 25 minutes (1500 seconds)
        if (breakReminder && currentSession.duration > 0 && currentSession.duration % 1500 === 0) {
          alert('Time for a 5-minute break! 🧘‍♀️');
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [currentSession.isActive, currentSession.duration, breakReminder]);

  const startSession = () => {
    if (!currentSession.subject.trim()) return;
    
    setCurrentSession(prev => ({
      ...prev,
      isActive: true,
      startTime: new Date().toISOString(),
      duration: 0
    }));
  };

  const pauseSession = () => {
    setCurrentSession(prev => ({
      ...prev,
      isActive: false
    }));
  };

  const endSession = () => {
    if (currentSession.duration > 0) {
      const newSession = {
        id: Date.now(),
        subject: currentSession.subject,
        task: currentSession.task,
        duration: currentSession.duration,
        date: new Date().toISOString().split('T')[0],
        startTime: currentSession.startTime,
        endTime: new Date().toISOString()
      };
      
      setSessions(prev => [...prev, newSession]);
    }
    
    setCurrentSession({
      subject: '',
      task: '',
      duration: 0,
      startTime: null,
      isActive: false
    });
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const calculateStreak = () => {
    const today = new Date().toISOString().split('T')[0];
    const sortedSessions = sessions
      .sort((a, b) => new Date(b.date) - new Date(a.date));
    
    let streak = 0;
    let currentDate = new Date(today);
    
    while (true) {
      const dateStr = currentDate.toISOString().split('T')[0];
      const hasSession = sortedSessions.some(session => session.date === dateStr);
      
      if (hasSession) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }
    
    setStudyStreak(streak);
  };

  const getTodayStats = () => {
    const today = new Date().toISOString().split('T')[0];
    const todaySessions = sessions.filter(session => session.date === today);
    
    const totalTime = todaySessions.reduce((sum, session) => sum + session.duration, 0);
    const sessionCount = todaySessions.length;
    
    return { totalTime, sessionCount };
  };

  const getWeeklyStats = () => {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    const weeklySessions = sessions.filter(session => 
      new Date(session.date) >= weekAgo
    );
    
    const totalTime = weeklySessions.reduce((sum, session) => sum + session.duration, 0);
    const avgDaily = totalTime / 7;
    
    return { totalTime, avgDaily, sessionCount: weeklySessions.length };
  };

  const getSubjectBreakdown = () => {
    const breakdown = {};
    sessions.forEach(session => {
      if (!breakdown[session.subject]) {
        breakdown[session.subject] = 0;
      }
      breakdown[session.subject] += session.duration;
    });
    
    return Object.entries(breakdown)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
  };

  const todayStats = getTodayStats();
  const weeklyStats = getWeeklyStats();
  const subjectBreakdown = getSubjectBreakdown();

  return (
    <div className="space-y-6">
      {/* Active Timer */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-purple-800 mb-4">⏰ Study Timer</h2>
        
        <div className="text-center mb-6">
          <div className="text-6xl font-mono font-bold text-purple-600 mb-4">
            {formatTime(currentSession.duration)}
          </div>
          
          {currentSession.isActive && (
            <div className="text-lg text-green-600 font-semibold mb-4">
              📚 Studying {currentSession.subject}
            </div>
          )}
        </div>

        <div className="space-y-4 mb-6">
          <input
            type="text"
            value={currentSession.subject}
            onChange={(e) => setCurrentSession(prev => ({...prev, subject: e.target.value}))}
            placeholder="Subject (e.g., Mathematics, Physics)"
            className="w-full p-3 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            disabled={currentSession.isActive}
          />
          
          <input
            type="text"
            value={currentSession.task}
            onChange={(e) => setCurrentSession(prev => ({...prev, task: e.target.value}))}
            placeholder="Specific task (optional)"
            className="w-full p-3 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            disabled={currentSession.isActive}
          />
        </div>

        <div className="flex justify-center gap-4 mb-4">
          {!currentSession.isActive ? (
            <button
              onClick={startSession}
              disabled={!currentSession.subject.trim()}
              className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 font-semibold"
            >
              Start Session
            </button>
          ) : (
            <>
              <button
                onClick={pauseSession}
                className="px-6 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 font-semibold"
              >
                Pause
              </button>
              <button
                onClick={endSession}
                className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 font-semibold"
              >
                End Session
              </button>
            </>
          )}
        </div>

        <div className="flex items-center justify-center gap-4 text-sm">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={breakReminder}
              onChange={(e) => setBreakReminder(e.target.checked)}
              className="rounded"
            />
            Break reminders (every 25 min)
          </label>
        </div>
      </div>

      {/* Today's Stats */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="text-3xl font-bold text-blue-600 mb-2">
            {formatTime(todayStats.totalTime)}
          </div>
          <div className="text-gray-600 text-sm">Today's Study Time</div>
          <div className="text-xs text-gray-500 mt-1">{todayStats.sessionCount} sessions</div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="text-3xl font-bold text-green-600 mb-2">{studyStreak}</div>
          <div className="text-gray-600 text-sm">Day Study Streak</div>
          <div className="text-xs text-gray-500 mt-1">Keep it going! 🔥</div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="text-3xl font-bold text-purple-600 mb-2">
            {formatTime(weeklyStats.avgDaily)}
          </div>
          <div className="text-gray-600 text-sm">Daily Average</div>
          <div className="text-xs text-gray-500 mt-1">This week</div>
        </div>
      </div>

      {/* Subject Breakdown */}
      {subjectBreakdown.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-bold text-purple-800 mb-4">📊 Subject Time Breakdown</h3>
          <div className="space-y-3">
            {subjectBreakdown.map(([subject, time]) => {
              const percentage = ((time / sessions.reduce((sum, s) => sum + s.duration, 0)) * 100).toFixed(1);
              return (
                <div key={subject} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium text-gray-800">{subject}</div>
                    <div className="text-sm text-gray-600">{formatTime(time)} total</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-purple-600 h-2 rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-semibold text-purple-600 w-12">
                      {percentage}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Recent Sessions */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-bold text-purple-800 mb-4">📝 Recent Sessions</h3>
        
        {sessions.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No study sessions yet. Start your first session!</p>
        ) : (
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {sessions
              .sort((a, b) => new Date(b.endTime) - new Date(a.endTime))
              .slice(0, 10)
              .map(session => (
                <div key={session.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium text-gray-800">{session.subject}</div>
                    {session.task && (
                      <div className="text-sm text-gray-600">{session.task}</div>
                    )}
                    <div className="text-xs text-gray-500">
                      {new Date(session.date).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-purple-600">
                      {formatTime(session.duration)}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudyTimer;