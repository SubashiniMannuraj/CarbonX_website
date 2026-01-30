import { useState, useEffect } from 'react';
import './index.css';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import Market from './components/Market';
import Portfolio from './components/Portfolio';
import Projects from './components/Projects';
import Orders from './components/Orders';
import Reports from './components/Reports';
import Settings from './components/Settings';

function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [activeSettingsTab, setActiveSettingsTab] = useState('profile');
  const [globalSearchTerm, setGlobalSearchTerm] = useState('');

  // Helper to switch to settings sub-tab
  const openSettings = (tab = 'profile') => {
    setCurrentView('settings');
    setActiveSettingsTab(tab);
  };

  const handleGlobalSearch = (term) => {
    setGlobalSearchTerm(term);
    setCurrentView('projects'); // Redirect to projects on search
  };

  return (
    <div className="flex" style={{ height: '100vh', overflow: 'hidden' }}>
      <Sidebar
        currentView={currentView}
        setCurrentView={setCurrentView}
        onOpenSettings={() => openSettings('profile')}
      />

      <div className="flex-1 flex flex-col" style={{ overflow: 'hidden' }}>
        <Header onOpenSettings={openSettings} onSearch={handleGlobalSearch} />

        <main className="flex-1" style={{ overflowY: 'auto', padding: '2rem' }}>
          {currentView === 'dashboard' && <Dashboard />}
          {currentView === 'market' && <Market />}
          {currentView === 'portfolio' && <Portfolio />}
          {currentView === 'projects' && <Projects initialSearchTerm={globalSearchTerm} />}
          {currentView === 'orders' && <Orders />}
          {currentView === 'reports' && <Reports />}
          {currentView === 'settings' && <Settings activeTab={activeSettingsTab} />}
        </main>
      </div>
    </div>
  );
}

export default App;
