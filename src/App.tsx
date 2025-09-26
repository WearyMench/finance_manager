import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import TransactionsList from './components/TransactionsList';
import Budgets from './components/Budgets';
import Settings from './components/Settings';
import LoadingScreen from './components/LoadingScreen';
import AuthModal from './components/AuthModal';
import LandingPage from './components/LandingPage';
import { useState } from 'react';

function AppContent() {
  const { state, login, register } = useApp();
  const [showAuthModal, setShowAuthModal] = useState(false);

  if (state.isLoading) {
    return <LoadingScreen />;
  }

  if (!state.isAuthenticated) {
    return <LandingPage />;
  }

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/transactions" element={<TransactionsList />} />
          <Route path="/add" element={<TransactionsList showFormOnMount={true} />} />
          <Route path="/budgets" element={<Budgets />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Layout>
    </Router>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
