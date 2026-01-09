import React from 'react';
import Dashboard from './components/Dashboard';
import { useAuth } from './hooks/useFirebase';

function App() {
  const { user, loading, signInAnon } = useAuth();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-purple-50">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-purple-800 mb-4">Love Eagles Academic Planner</h1>
          <button 
            onClick={signInAnon}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Start Using App
          </button>
        </div>
      </div>
    );
  }

  return <Dashboard user={user} />;
}

export default App;