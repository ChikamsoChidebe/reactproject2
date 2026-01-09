import React from 'react';
import Dashboard from './components/Dashboard';
import { useAuth } from './hooks/useFirebase';
import { Sparkles, Heart } from 'lucide-react';

function App() {
  const { user, loading, signInAnon } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="text-center">
          <div className="animate-spin text-4xl mb-4">⏳</div>
          <p className="text-purple-600">Loading your academic journey...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="mb-6">
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="text-6xl">🦅</span>
              <Heart className="text-purple-600 w-8 h-8" />
              <span className="text-6xl">📚</span>
            </div>
            <h1 className="text-4xl font-bold text-purple-800 mb-2">Love Eagles</h1>
            <h2 className="text-2xl font-semibold text-purple-600 mb-4">Academic Planner</h2>
            <p className="text-purple-500 text-sm mb-2">Uche Nora & Chikamso Chidebe</p>
            <p className="text-purple-400 text-xs flex items-center justify-center gap-1">
              <Sparkles className="w-4 h-4" />
              In God We Trust
              <Sparkles className="w-4 h-4" />
            </p>
          </div>
          <button 
            onClick={signInAnon}
            className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-2 mx-auto"
          >
            <span className="text-xl">🚀</span>
            Start Your Journey
            <span className="text-xl">✨</span>
          </button>
        </div>
      </div>
    );
  }

  return <Dashboard user={user} />;
}

export default App;