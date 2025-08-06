import React from 'react';
// Pages
import { Dashboard } from './pages/Dashboard';
import { CurrencyProvider } from './contexts/CurrencyContext';

const App: React.FC = () => {
  return (
    <CurrencyProvider>
      <div className="App">
        <Dashboard />
      </div>
    </CurrencyProvider>
  );
};

export default App;
