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