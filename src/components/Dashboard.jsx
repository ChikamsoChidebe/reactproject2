import React, { useState, useEffect } from 'react';
import { useFirestore } from '../hooks/useFirebase';
import AcademicPlanner from './AcademicPlanner';
import TaskSuggestions from './TaskSuggestions';
import CollaborativeNotes from './CollaborativeNotes';
import MoodTracker from './MoodTracker';
import PerformanceInsights from './PerformanceInsights';
import StudyTimer from './StudyTimer';
import VoiceCommands from './VoiceCommands';
import AICoach from './AICoach';
import ReflectionJournal from './ReflectionJournal';

const Dashboard = ({ user }) => {
  const { data: userPrefs, saveData: savePrefs } = useFirestore('preferences', user?.uid);
  const [activeTab, setActiveTab] = useState('planner');
  const [focusMode, setFocusMode] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (userPrefs.length > 0) {
      const prefs = userPrefs[0];
      setFocusMode(prefs.focusMode || false);
      setDarkMode(prefs.darkMode || false);
    }
  }, [userPrefs]);

  const updatePreferences = (key, value) => {
    const newPrefs = { [key]: value };
    if (user) savePrefs('settings', newPrefs);
  };

  const tabs = [
    { id: 'planner', name: 'Planner', icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
      </svg>
    )},
    { id: 'tasks', name: 'Smart Tasks', icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )},
    { id: 'notes', name: 'Notes', icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
        <path fillRule="evenodd" d="M4 5a2 2 0 012-2v1a2 2 0 002 2h4a2 2 0 002-2V3a2 2 0 012 2v6.586l-1.293-1.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L16 11.586V5a2 2 0 00-2-2v1a2 2 0 01-2 2H8a2 2 0 01-2-2V3a2 2 0 00-2 2z" clipRule="evenodd" />
      </svg>
    )},
    { id: 'mood', name: 'Mood', icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-.464 5.535a1 1 0 10-1.415-1.414 3 3 0 01-4.242 0 1 1 0 00-1.415 1.414 5 5 0 007.072 0z" clipRule="evenodd" />
      </svg>
    )},
    { id: 'insights', name: 'Insights', icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
      </svg>
    )},
    { id: 'timer', name: 'Timer', icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
      </svg>
    )},
    { id: 'voice', name: 'Voice', icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
      </svg>
    )},
    { id: 'coach', name: 'AI Coach', icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    )},
    { id: 'journal', name: 'Journal', icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z" />
        <path fillRule="evenodd" d="M3 8a2 2 0 012-2v9a2 2 0 002 2h8a2 2 0 002-2V6a2 2 0 012 2v6a2 2 0 01-2 2H9a2 2 0 01-2-2V8z" clipRule="evenodd" />
      </svg>
    )}
  ];

  const renderActiveComponent = () => {
    switch (activeTab) {
      case 'planner': return <AcademicPlanner user={user} />;
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
    <div className={`min-h-screen transition-all duration-300 ${
      darkMode 
        ? 'bg-gray-900 text-white' 
        : 'bg-gradient-to-br from-purple-50 via-white to-indigo-50'
    }`}>
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-700 text-white shadow-2xl">
        <div className="container mx-auto px-6 py-6">
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
            <div className="text-center lg:text-left">
              <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                Love Eagles Academic Planner
              </h1>
              <p className="text-purple-200 text-sm mt-1">Uche Nora & Chikamso Chidebe</p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-purple-200 text-sm font-medium px-3 py-1 bg-white/10 rounded-full backdrop-blur-sm">
                In God We Trust ✨
              </span>
              <button
                onClick={() => {
                  setFocusMode(!focusMode);
                  updatePreferences('focusMode', !focusMode);
                }}
                className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/30 transition-all duration-200 text-sm font-medium"
              >
                {focusMode ? '🔓 Exit Focus' : '🔒 Focus Mode'}
              </button>
              <button
                onClick={() => {
                  setDarkMode(!darkMode);
                  updatePreferences('darkMode', !darkMode);
                }}
                className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/30 transition-all duration-200"
              >
                {darkMode ? '☀️' : '🌙'}
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Navigation Tabs */}
        {!focusMode && (
          <nav className="mb-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-3 shadow-lg border border-purple-100">
              <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4 py-3 rounded-xl flex items-center space-x-2 transition-all duration-200 font-medium ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg transform scale-105'
                        : 'text-purple-700 hover:bg-purple-50 hover:scale-102'
                    }`}
                  >
                    <span className="text-lg">{tab.icon}</span>
                    <span className="hidden sm:inline">{tab.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </nav>
        )}

        {/* Main Content */}
        <main className={`transition-all duration-300 ${
          focusMode ? 'focus-mode filter brightness-95' : ''
        }`}>
          <div className="fade-in">
            {renderActiveComponent()}
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className={`mt-16 py-8 ${
        focusMode ? 'opacity-30' : ''
      } bg-gradient-to-r from-purple-800 via-purple-900 to-indigo-900 text-white`}>
        <div className="container mx-auto px-6 text-center">
          <div className="flex flex-col items-center space-y-2">
            <p className="text-lg font-semibold">Love Eagles Academic Planner &copy; 2024</p>
            <p className="text-purple-200">Uche Nora & Chikamso Chidebe</p>
            <p className="text-purple-300 text-sm font-medium">In God We Trust 🙏</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;