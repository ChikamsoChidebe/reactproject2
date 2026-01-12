import React, { useState, useEffect } from 'react';
import { useFirestore } from '../hooks/useFirebase';
import { Home as HomeIcon, Calendar, Target, BookOpen, Smile, BarChart3, Clock, Mic, Brain, Book, Settings } from 'lucide-react';
import Home from './Home';
import AcademicPlanner from './AcademicPlanner';
import TaskSuggestions from './TaskSuggestions';
import CollaborativeNotes from './CollaborativeNotes';
import MoodTracker from './MoodTracker';
import PerformanceInsights from './PerformanceInsights';
import StudyTimer from './StudyTimer';
import VoiceCommands from './VoiceCommands';
import AICoach from './AICoach';
import QuizGenerator from './QuizGenerator';
import QuizDashboard from './QuizDashboard';

const Dashboard = ({ user }) => {
  const { data: userPrefs, saveData: savePrefs } = useFirestore('preferences', user?.uid);
  const [activeTab, setActiveTab] = useState('home');
  const [focusMode, setFocusMode] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (userPrefs.length > 0) {
      const prefs = userPrefs[0];
      setFocusMode(prefs.focusMode || false);
    }
  }, [userPrefs]);

  const updatePreferences = (key, value) => {
    const newPrefs = { [key]: value };
    if (user) savePrefs('settings', newPrefs);
  };

  const tabs = [
    { id: 'home', name: 'Home', emoji: '🏠', icon: <HomeIcon className="w-5 h-5" /> },
    { id: 'planner', name: 'Planner', emoji: '📅', icon: <Calendar className="w-5 h-5" /> },
    { id: 'tasks', name: 'Smart Tasks', emoji: '🤖', icon: <Target className="w-5 h-5" /> },
    { id: 'notes', name: 'Notes', emoji: '📝', icon: <BookOpen className="w-5 h-5" /> },
    { id: 'quiz', name: 'Quiz', emoji: '🧠', icon: <Brain className="w-5 h-5" /> },
    { id: 'quiz-dashboard', name: 'Quiz Stats', emoji: '📊', icon: <BarChart3 className="w-5 h-5" /> },
    { id: 'mood', name: 'Mood', emoji: '😊', icon: <Smile className="w-5 h-5" /> },
    { id: 'insights', name: 'Insights', emoji: '📊', icon: <BarChart3 className="w-5 h-5" /> },
    { id: 'timer', name: 'Timer', emoji: '⏰', icon: <Clock className="w-5 h-5" /> },
    { id: 'voice', name: 'Voice', emoji: '🎤', icon: <Mic className="w-5 h-5" /> },
    { id: 'coach', name: 'AI Coach', emoji: '🧠', icon: <Brain className="w-5 h-5" /> },
    { id: 'journal', name: 'Journal', emoji: '📖', icon: <Book className="w-5 h-5" /> }
  ];

  const renderActiveComponent = () => {
    switch (activeTab) {
      case 'home': return <Home setActiveTab={setActiveTab} />;
      case 'planner': return <AcademicPlanner user={user} />;
      case 'tasks': return <TaskSuggestions />;
      case 'notes': return <CollaborativeNotes />;
      case 'quiz': return <QuizGenerator user={user} />;
      case 'quiz-dashboard': return <QuizDashboard user={user} />;
      case 'mood': return <MoodTracker />;
      case 'insights': return <PerformanceInsights />;
      case 'timer': return <StudyTimer />;
      case 'voice': return <VoiceCommands />;
      case 'coach': return <AICoach />;
      case 'journal': return <ReflectionJournal />;
      default: return <Home setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className={`min-h-screen transition-all duration-300 bg-gradient-to-br from-purple-50 via-white to-indigo-50`}>
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-700 text-white shadow-2xl">
        <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/30 transition-all duration-200"
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
              </button>
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <span className="text-lg sm:text-xl">🦅</span>
                </div>
                <div>
                  <h1 className="text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                    Love Eagles
                  </h1>
                  <p className="text-purple-200 text-xs sm:text-sm hidden sm:block">Uche Nora & Chikamso Chidebe</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <span className="text-purple-200 text-xs sm:text-sm font-medium px-2 sm:px-3 py-1 bg-white/10 rounded-full backdrop-blur-sm hidden md:block">
                In God We Trust ✨
              </span>
              <button
                onClick={() => {
                  setFocusMode(!focusMode);
                  updatePreferences('focusMode', !focusMode);
                }}
                className="px-3 sm:px-4 py-2 bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/30 transition-all duration-200 text-xs sm:text-sm font-medium flex items-center gap-1 sm:gap-2"
              >
                <Settings className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>{focusMode ? '🔓' : '🔒'}</span>
                <span className="hidden sm:inline">{focusMode ? 'Exit Focus' : 'Focus'}</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 lg:relative lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
          <div className="h-full flex flex-col">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm font-bold">LE</span>
                </div>
                <div>
                  <h2 className="font-semibold text-gray-900">Love Eagles</h2>
                  <p className="text-xs text-gray-500">Academic Planner</p>
                </div>
              </div>
            </div>
            <nav className="flex-1 p-4 space-y-1">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full px-3 py-2.5 rounded-lg flex items-center space-x-3 text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-purple-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.name}</span>
                </button>
              ))}
            </nav>
            <div className="p-4 border-t border-gray-100">
              <p className="text-xs text-gray-500 text-center">In God We Trust</p>
            </div>
          </div>
        </aside>

        {/* Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 lg:ml-0">
          <div className="container mx-auto px-6 py-8">
            {/* Desktop Navigation Tabs */}
            {!focusMode && (
              <nav className="mb-8 hidden lg:block">
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
                        <span className="text-lg">{tab.emoji}</span>
                        {tab.icon}
                        <span className="hidden sm:inline">{tab.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </nav>
            )}

            <div className={`transition-all duration-300 ${
              focusMode ? 'focus-mode filter brightness-95' : ''
            }`}>
              <div className="fade-in">
                {renderActiveComponent()}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className={`mt-16 py-8 ${
        focusMode ? 'opacity-30' : ''
      } bg-gradient-to-r from-purple-800 via-purple-900 to-indigo-900 text-white`}>
        <div className="container mx-auto px-6 text-center">
          <div className="flex flex-col items-center space-y-2">
            <p className="text-lg font-semibold">Love Eagles Academic Planner &copy; 2026</p>
            <p className="text-purple-200">Uche Nora & Chikamso Chidebe</p>
            <p className="text-purple-300 text-sm font-medium">In God We Trust 🙏</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;