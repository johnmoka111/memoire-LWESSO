import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
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
import AgentMissions from './pages/AgentMissions';
import Settings from './pages/Settings';
import Notifications from './pages/Notifications';
import MobileNav from './components/MobileNav';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
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
              <ProtectedRoute roles={['admin']}>
                <Agents />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/validations" 
            element={
              <ProtectedRoute roles={['admin']}>
                <Validations />
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
      </Router>
    </ThemeProvider>
  );
}

export default App;
