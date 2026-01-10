import React, { useState, useEffect } from 'react';
import { Calendar, Target, BookOpen, Clock, TrendingUp, Award } from 'lucide-react';
import StreakTracker from './StreakTracker';

const Home = ({ setActiveTab, user }) => {
  const [dashboardData, setDashboardData] = useState({
    todayTasks: 0,
    completedTasks: 0,
    upcomingDeadlines: 0,
    studyTime: 0,
    goalProgress: 0
  });

  useEffect(() => {
    loadDashboardData();
  }, [user]);

  const loadDashboardData = () => {
    // Load from localStorage for now, will be replaced with Firebase
    const goals = JSON.parse(localStorage.getItem('goals') || '[]');
    const assignments = JSON.parse(localStorage.getItem('assignments') || '[]');
    const sessions = JSON.parse(localStorage.getItem('studySessions') || '[]');
    
    const today = new Date().toDateString();
    const todaySessions = sessions.filter(s => new Date(s.date).toDateString() === today);
    const todayTime = todaySessions.reduce((sum, s) => sum + s.duration, 0);
    
    const completedToday = assignments.filter(a => 
      a.completed && new Date(a.createdAt).toDateString() === today
    ).length;
    
    const upcoming = assignments.filter(a => {
      const dueDate = new Date(a.dueDate);
      const diffDays = Math.ceil((dueDate - new Date()) / (1000 * 60 * 60 * 24));
      return diffDays <= 7 && diffDays >= 0 && !a.completed;
    }).length;
    
    const avgProgress = goals.length > 0 
      ? goals.reduce((sum, g) => sum + g.progress, 0) / goals.length 
      : 0;

    setDashboardData({
      todayTasks: assignments.filter(a => !a.completed).length,
      completedTasks: completedToday,
      upcomingDeadlines: upcoming,
      studyTime: Math.floor(todayTime / 60),
      goalProgress: Math.round(avgProgress)
    });
  };

  const quickActions = [
    { id: 'planner', name: 'Add Goal', icon: Target, color: 'bg-purple-500' },
    { id: 'notes', name: 'Take Notes', icon: BookOpen, color: 'bg-blue-500' },
    { id: 'timer', name: 'Study Timer', icon: Clock, color: 'bg-green-500' },
    { id: 'quiz', name: 'Take Quiz', icon: Award, color: 'bg-orange-500' }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-2">Welcome back, Love Eagles! 🦅</h1>
        <p className="opacity-90">Ready to soar to new academic heights?</p>
        <p className="text-sm opacity-75 mt-2">In God We Trust ✨</p>
      </div>

      {/* Streak Tracker */}
      {user && <StreakTracker user={user} />}

      {/* Dashboard Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white rounded-lg shadow-md p-4 text-center">
          <div className="text-2xl font-bold text-purple-600">{dashboardData.todayTasks}</div>
          <div className="text-sm text-gray-600">Pending Tasks</div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{dashboardData.completedTasks}</div>
          <div className="text-sm text-gray-600">Completed Today</div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 text-center">
          <div className="text-2xl font-bold text-orange-600">{dashboardData.upcomingDeadlines}</div>
          <div className="text-sm text-gray-600">Due This Week</div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{dashboardData.studyTime}h</div>
          <div className="text-sm text-gray-600">Study Time Today</div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 text-center">
          <div className="text-2xl font-bold text-purple-600">{dashboardData.goalProgress}%</div>
          <div className="text-sm text-gray-600">Goal Progress</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map(action => (
            <button
              key={action.id}
              onClick={() => setActiveTab(action.id)}
              className={`${action.color} text-white rounded-lg p-4 hover:opacity-90 transition-opacity`}
            >
              <action.icon className="w-8 h-8 mx-auto mb-2" />
              <div className="text-sm font-medium">{action.name}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Today's Focus */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Today's Focus</h2>
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
            <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
            <span className="text-gray-700">Complete pending assignments</span>
          </div>
          <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
            <span className="text-gray-700">Review study notes</span>
          </div>
          <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
            <div className="w-2 h-2 bg-green-600 rounded-full"></div>
            <span className="text-gray-700">Practice with quiz questions</span>
          </div>
        </div>
      </div>

      {/* Motivational Quote */}
      <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg p-6 text-center">
        <h3 className="text-lg font-bold text-purple-800 mb-2">Daily Inspiration</h3>
        <p className="text-purple-700 italic">
          "Success is not final, failure is not fatal: it is the courage to continue that counts."
        </p>
        <p className="text-purple-600 text-sm mt-2">- Winston Churchill</p>
      </div>
    </div>
  );
};

export default Home;