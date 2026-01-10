import React from 'react';
import Dashboard from './components/Dashboard';
import AuthWrapper from './components/AuthWrapper';

function App() {
  return (
    <AuthWrapper>
      <Dashboard />
    </AuthWrapper>
  );
}

export default App;

