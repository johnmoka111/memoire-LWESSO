import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
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
import Settings from './pages/Settings';
import MobileNav from './components/MobileNav';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
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
            <ProtectedRoute roles={['admin', 'agent', 'proprietaire']}>
              <CreateProperty />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/transactions" 
          element={
            <ProtectedRoute>
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
  );
}

export default App;
