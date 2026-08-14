import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Properties from './pages/Properties';
import PropertyDetail from './pages/PropertyDetail';
import CreateProperty from './pages/CreateProperty';
import Transactions from './pages/Transactions';
import Agents from './pages/admin/Agents';
import Validations from './pages/admin/Validations';
import SystemLogs from './pages/admin/SystemLogs';
import AgentMissions from './pages/AgentMissions';
import Settings from './pages/Settings';
import Notifications from './pages/Notifications';
import MobileNav from './components/MobileNav';
import CookieConsent from './components/CookieConsent';
import Cookies from './pages/Cookies';
import LegalNotice from './pages/LegalNotice';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cookies" element={<Cookies />} />
          <Route path="/mentions-legales" element={<LegalNotice />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/properties" element={<Properties />} />
          <Route path="/properties/:id" element={<PropertyDetail />} />
          
          {/* Protected Routes */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/properties/create" 
            element={
              <ProtectedRoute roles={['admin', 'superadmin', 'proprietaire', 'acheteur']}>
                <CreateProperty />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/messages" 
            element={
              <ProtectedRoute>
                <Notifications />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/agent/missions" 
            element={
              <ProtectedRoute roles={['agent', 'admin', 'superadmin']}>
                <AgentMissions />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/transactions" 
            element={
              <ProtectedRoute roles={['proprietaire', 'acheteur', 'admin', 'superadmin']}>
                <Transactions />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/agents" 
            element={
              <ProtectedRoute roles={['admin', 'superadmin', 'administrateur']}>
                <Agents />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/validations" 
            element={
              <ProtectedRoute roles={['admin', 'superadmin', 'administrateur']}>
                <Validations />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/system-logs" 
            element={
              <ProtectedRoute roles={['admin', 'superadmin', 'administrateur']}>
                <SystemLogs />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/settings" 
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            } 
          />
        </Routes>
        <MobileNav />
        <CookieConsent />
      </Router>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
