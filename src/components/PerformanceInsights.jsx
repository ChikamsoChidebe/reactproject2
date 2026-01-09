import React, { useState, useEffect } from 'react';

const PerformanceInsights = () => {
  const [insights, setInsights] = useState({});
  const [timeframe, setTimeframe] = useState('week');

  useEffect(() => {
    generateInsights();
  }, [timeframe]);

  const generateInsights = () => {
    const assignments = JSON.parse(localStorage.getItem('assignments') || '[]');
    const goals = JSON.parse(localStorage.getItem('goals') || '[]');
    const moodHistory = JSON.parse(localStorage.getItem('moodHistory') || '[]');
    const studySessions = JSON.parse(localStorage.getItem('studySessions') || '[]');

    const now = new Date();
    const timeframeDays = timeframe === 'week' ? 7 : timeframe === 'month' ? 30 : 365;
    const startDate = new Date(now.getTime() - timeframeDays * 24 * 60 * 60 * 1000);

    // Calculate completion rates
    const completedAssignments = assignments.filter(a => a.completed).length;
    const totalAssignments = assignments.length;
    const completionRate = totalAssignments > 0 ? (completedAssignments / totalAssignments * 100).toFixed(1) : 0;

    // Calculate average goal progress
    const avgGoalProgress = goals.length > 0 
      ? (goals.reduce((sum, goal) => sum + goal.progress, 0) / goals.length).toFixed(1)
      : 0;

    // Calculate study hours
    const recentSessions = studySessions.filter(session => 
      new Date(session.date) >= startDate
    );
    const totalStudyHours = recentSessions.reduce((sum, session) => sum + session.duration, 0);
    const avgDailyHours = (totalStudyHours / timeframeDays).toFixed(1);

    // Mood correlation
    const recentMoods = moodHistory.filter(mood => 
      new Date(mood.timestamp) >= startDate
    );
    const avgMood = recentMoods.length > 0
      ? (recentMoods.reduce((sum, mood) => sum + mood.energy, 0) / recentMoods.length).toFixed(1)
      : 0;

    // Subject performance
    const subjectStats = {};
    assignments.forEach(assignment => {
      if (assignment.subject) {
        if (!subjectStats[assignment.subject]) {
          subjectStats[assignment.subject] = { total: 0, completed: 0 };
        }
        subjectStats[assignment.subject].total++;
        if (assignment.completed) {
          subjectStats[assignment.subject].completed++;
        }
      }
    });

    setInsights({
      completionRate,
      avgGoalProgress,
      totalStudyHours,
      avgDailyHours,
      avgMood,
      subjectStats,
      totalAssignments,
      completedAssignments,
      totalGoals: goals.length,
      recentSessions: recentSessions.length
    });
  };

  const getPerformanceLevel = (rate) => {
    if (rate >= 90) return { level: 'Excellent', color: 'text-green-600', bg: 'bg-green-100' };
    if (rate >= 75) return { level: 'Good', color: 'text-blue-600', bg: 'bg-blue-100' };
    if (rate >= 60) return { level: 'Average', color: 'text-yellow-600', bg: 'bg-yellow-100' };
    return { level: 'Needs Improvement', color: 'text-red-600', bg: 'bg-red-100' };
  };

  const getMotivationalMessage = () => {
    const rate = parseFloat(insights.completionRate);
    if (rate >= 90) return "Outstanding work! You're crushing your goals! 🌟";
    if (rate >= 75) return "Great progress! Keep up the excellent work! 💪";
    if (rate >= 60) return "Good effort! A little more focus and you'll excel! 📈";
    return "Every step counts! You're building great habits! 🌱";
  };

  const getStudyTips = () => {
    const tips = [];
    
    if (parseFloat(insights.avgDailyHours) < 2) {
      tips.push("💡 Try to increase your daily study time gradually");
    }
    
    if (parseFloat(insights.avgMood) < 6) {
      tips.push("😊 Consider taking more breaks and practicing self-care");
    }
    
    if (parseFloat(insights.completionRate) < 70) {
      tips.push("🎯 Break large tasks into smaller, manageable chunks");
    }
    
    if (Object.keys(insights.subjectStats || {}).length > 0) {
      const weakestSubject = Object.entries(insights.subjectStats)
        .sort((a, b) => (a[1].completed/a[1].total) - (b[1].completed/b[1].total))[0];
      if (weakestSubject && weakestSubject[1].completed/weakestSubject[1].total < 0.7) {
        tips.push(`📚 Focus more attention on ${weakestSubject[0]}`);
      }
    }

    return tips.length > 0 ? tips : ["🎉 You're doing great! Keep maintaining your excellent habits!"];
  };

  return (
    <div className="space-y-6">
      {/* Timeframe Selector */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-purple-800">📊 Performance Insights</h2>
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            className="p-2 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        <div className="glass rounded-2xl shadow-lg p-4 sm:p-8 text-center card-hover">
          <div className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-2 sm:mb-3">{insights.completionRate}%</div>
          <div className="text-gray-600 text-xs sm:text-sm font-medium">Assignment Completion</div>
          <div className={`mt-2 sm:mt-3 px-2 sm:px-4 py-1 sm:py-2 rounded-full text-xs font-semibold ${getPerformanceLevel(insights.completionRate).bg} ${getPerformanceLevel(insights.completionRate).color}`}>
            {getPerformanceLevel(insights.completionRate).level}
          </div>
        </div>

        <div className="glass rounded-2xl shadow-lg p-8 text-center card-hover">
          <div className="text-4xl font-bold bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent mb-3">{insights.avgGoalProgress}%</div>
          <div className="text-gray-600 text-sm font-medium">Average Goal Progress</div>
          <div className="text-xs text-gray-500 mt-3 bg-white/50 px-3 py-1 rounded-full">{insights.totalGoals} active goals</div>
        </div>

        <div className="glass rounded-2xl shadow-lg p-8 text-center card-hover">
          <div className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-cyan-600 bg-clip-text text-transparent mb-3">{insights.avgDailyHours}h</div>
          <div className="text-gray-600 text-sm font-medium">Daily Study Average</div>
          <div className="text-xs text-gray-500 mt-3 bg-white/50 px-3 py-1 rounded-full">{insights.totalStudyHours}h total</div>
        </div>

        <div className="glass rounded-2xl shadow-lg p-8 text-center card-hover">
          <div className="text-4xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent mb-3">{insights.avgMood}/10</div>
          <div className="text-gray-600 text-sm font-medium">Average Energy Level</div>
          <div className="text-xs text-gray-500 mt-3 bg-white/50 px-3 py-1 rounded-full">Mood correlation</div>
        </div>
      </div>

      {/* Motivational Message */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-lg shadow-md p-6 text-center">
        <h3 className="text-lg font-bold mb-2">🎉 Keep Going, Love Eagles!</h3>
        <p className="text-lg">{getMotivationalMessage()}</p>
        <p className="text-purple-200 text-sm mt-2">In God We Trust - Uche Nora & Chikamso Chidebe</p>
      </div>

      {/* Subject Performance */}
      {Object.keys(insights.subjectStats || {}).length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-bold text-purple-800 mb-4">📚 Subject Performance</h3>
          <div className="space-y-3">
            {Object.entries(insights.subjectStats).map(([subject, stats]) => {
              const percentage = ((stats.completed / stats.total) * 100).toFixed(1);
              return (
                <div key={subject} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium text-gray-800">{subject}</div>
                    <div className="text-sm text-gray-600">
                      {stats.completed}/{stats.total} completed
                    </div>
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

      {/* Personalized Tips */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-bold text-purple-800 mb-4">💡 Personalized Study Tips</h3>
        <div className="space-y-3">
          {getStudyTips().map((tip, index) => (
            <div key={index} className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
              <div className="text-purple-600 font-bold">{index + 1}.</div>
              <div className="text-gray-700">{tip}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Progress Chart Placeholder */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-bold text-purple-800 mb-4">📈 Progress Trends</h3>
        <div className="h-48 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg flex items-center justify-center">
          <div className="text-center text-gray-600">
            <div className="text-4xl mb-2">📊</div>
            <div>Visual progress charts coming soon!</div>
            <div className="text-sm mt-2">Track your improvement over time</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceInsights;