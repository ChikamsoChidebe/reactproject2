import React, { useState, useEffect } from 'react';
import AcademicPlanner from './AcademicPlanner';
import TaskSuggestions from './TaskSuggestions';
import CollaborativeNotes from './CollaborativeNotes';
import MoodTracker from './MoodTracker';
import PerformanceInsights from './PerformanceInsights';
import StudyTimer from './StudyTimer';
import VoiceCommands from './VoiceCommands';
import AICoach from './AICoach';
import ReflectionJournal from './ReflectionJournal';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('planner');
  const [focusMode, setFocusMode] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const tabs = [
    { id: 'planner', name: 'Planner', icon: '📅' },
    { id: 'tasks', name: 'Smart Tasks', icon: '🤖' },
    { id: 'notes', name: 'Notes', icon: '📝' },
    { id: 'mood', name: 'Mood', icon: '😊' },
    { id: 'insights', name: 'Insights', icon: '📊' },
    { id: 'timer', name: 'Timer', icon: '⏰' },
    { id: 'voice', name: 'Voice', icon: '🎤' },
    { id: 'coach', name: 'AI Coach', icon: '🧠' },
    { id: 'journal', name: 'Journal', icon: '📖' }
  ];

  const renderActiveComponent = () => {
    switch (activeTab) {
      case 'planner': return <AcademicPlanner />;
      case 'tasks': return <TaskSuggestions />;
      case 'notes': return <CollaborativeNotes />;
      case 'mood': return <MoodTracker />;
      case 'insights': return <PerformanceInsights />;
      case 'timer': return <StudyTimer />;
      case 'voice': return <VoiceCommands />;
      case 'coach': return <AICoach />;
      case 'journal': return <ReflectionJournal />;
      default: return <AcademicPlanner />;
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gradient-to-br from-purple-50 to-white'}`}>
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-600 to-purple-800 text-white p-3 sm:p-4 shadow-lg">
        <div className="container mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
              <h1 className="text-lg sm:text-xl lg:text-2xl font-bold">Love Eagles Academic Planner</h1>
              <span className="text-purple-200 text-xs sm:text-sm">Uche Nora & Chikamso Chidebe</span>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
              <span className="text-purple-200 text-xs sm:text-sm font-medium">In God We Trust</span>
              <div className="flex gap-2">
                <button
                  onClick={() => setFocusMode(!focusMode)}
                  className="px-2 sm:px-3 py-1 text-xs sm:text-sm bg-purple-500 rounded-lg hover:bg-purple-400 transition-colors"
                >
                  {focusMode ? '🔓 Exit Focus' : '🔒 Focus Mode'}
                </button>
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className="px-2 sm:px-3 py-1 text-xs sm:text-sm bg-purple-500 rounded-lg hover:bg-purple-400 transition-colors"
                >
                  {darkMode ? '☀️' : '🌙'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto p-3 sm:p-4">
        {/* Navigation Tabs */}
        {!focusMode && (
          <nav className="mb-4 sm:mb-6">
            <div className="flex flex-wrap gap-1 sm:gap-2 bg-white rounded-lg p-2 shadow-md overflow-x-auto">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-2 sm:px-4 py-2 rounded-lg flex items-center space-x-1 sm:space-x-2 transition-colors text-xs sm:text-sm whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-purple-600 text-white'
                      : 'text-purple-600 hover:bg-purple-100'
                  }`}
                >
                  <span className="text-sm sm:text-base">{tab.icon}</span>
                  <span className="hidden sm:inline">{tab.name}</span>
                </button>
              ))}
            </div>
          </nav>
        )}

        {/* Main Content */}
        <main className={focusMode ? 'focus-mode' : ''}>
          {renderActiveComponent()}
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-purple-800 text-white text-center py-3 sm:py-4 mt-6 sm:mt-8">
        <p className="text-sm sm:text-base">Love Eagles Academic Planner &copy; 2024 - In God We Trust</p>
        <p className="text-purple-200 text-xs sm:text-sm">Uche Nora & Chikamso Chidebe</p>
      </footer>
    </div>
  );
};

export default Dashboard;