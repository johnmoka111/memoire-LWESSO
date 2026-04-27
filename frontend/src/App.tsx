import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import PropertyDetail from './pages/PropertyDetail';
import OwnerDashboard from './pages/dashboard/OwnerDashboard';
import AgentDashboard from './pages/dashboard/AgentDashboard';
import AdminDashboard from './pages/dashboard/AdminDashboard';
import Navbar from './components/layout/Navbar';

function App() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="pb-20">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/property/:id" element={<PropertyDetail />} />
          <Route path="/dashboard/owner" element={<OwnerDashboard />} />
          <Route path="/dashboard/agent" element={<AgentDashboard />} />
          <Route path="/dashboard/admin" element={<AdminDashboard />} />
        </Routes>
      </main>
      <footer className="bg-slate-50 border-t border-slate-200 py-8">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2026 KivuMarket+. La technologie au service de la sécurité foncière à Bukavu.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
