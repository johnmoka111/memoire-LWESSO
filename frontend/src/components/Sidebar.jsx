import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  Home, 
  PlusCircle, 
  Wallet, 
  ShieldCheck, 
  Users, 
  Settings, 
  LogOut,
  ChevronRight,
  Shield,
  X,
  User as UserIcon
} from 'lucide-react';

const SidebarLink = ({ to, icon: Icon, label, active, onClick }) => {
  if (onClick) {
    return (
      <button 
        onClick={onClick}
        className={`flex items-center justify-between w-full px-4 py-3.5 rounded-xl transition-all group ${
          active 
          ? 'bg-primary text-white shadow-lg shadow-primary/20' 
          : 'text-slate-400 hover:bg-white/5 hover:text-white'
        }`}
      >
        <div className="flex items-center gap-3">
          <Icon size={20} className={active ? 'text-white' : 'text-slate-500 group-hover:text-primary transition-colors'} />
          <span className="text-sm font-bold tracking-tight">{label}</span>
        </div>
        {active && <ChevronRight size={14} />}
      </button>
    );
  }

  return (
    <Link 
      to={to} 
      className={`flex items-center justify-between px-4 py-3.5 rounded-xl transition-all group ${
        active 
        ? 'bg-primary text-white shadow-lg shadow-primary/20' 
        : 'text-slate-400 hover:bg-white/5 hover:text-white'
      }`}
    >
      <div className="flex items-center gap-3">
        <Icon size={20} className={active ? 'text-white' : 'text-slate-500 group-hover:text-primary transition-colors'} />
        <span className="text-sm font-bold tracking-tight">{label}</span>
      </div>
      {active && <ChevronRight size={14} />}
    </Link>
  );
};

const Sidebar = () => {
  const location = useLocation();
  const storedUser = localStorage.getItem('user');
  const user = (storedUser && storedUser !== 'undefined') ? JSON.parse(storedUser) : {};
  const [showSecurityModal, setShowSecurityModal] = useState(false);
  const [pendingPath, setPendingPath] = useState('');
  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/#/login';
  };

  const openSecurityModal = (to) => {
    setPendingPath(to);
    setShowSecurityModal(true);
  };

  const confirmSecurityExit = () => {
    localStorage.clear();
    window.location.href = `/#${pendingPath}`;
  };

  return (
    <>
      <aside className="hidden md:flex flex-col w-72 bg-secondary/50 border-r border-white/5 h-screen sticky top-0 p-6">
        {/* Profile Header Section */}
        <div className="flex items-center gap-4 mb-10 p-3 bg-white/[0.03] border border-white/5 rounded-2xl">
          <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 overflow-hidden flex items-center justify-center">
            {user.avatar_url ? (
              <img src={user.avatar_url} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <UserIcon size={20} className="text-primary" />
            )}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-bold text-sm text-white truncate">{user.prenom} {user.nom}</span>
            <span className="text-[9px] font-black uppercase tracking-widest text-primary truncate">{user.role}</span>
          </div>
        </div>

        <div 
          onClick={() => openSecurityModal('/')}
          className="flex items-center gap-3 mb-10 px-2 cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-lg bg-white/5 p-1 group-hover:bg-primary/10 transition-colors">
            <img src="/assets/logo.png" alt="KivuMarket+" className="w-full h-full object-contain" />
          </div>
          <span className="font-black text-lg tracking-tighter group-hover:text-primary transition-colors">
            KivuMarket<span className="text-primary">+</span>
          </span>
        </div>

        <nav className="flex-1 space-y-2 overflow-y-auto">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 mb-4 px-4">Menu Principal</p>
          <SidebarLink to="/dashboard" icon={LayoutDashboard} label="Tableau de bord" active={isActive('/dashboard')} />
          
          <SidebarLink 
            onClick={() => openSecurityModal('/properties')} 
            icon={Home} 
            label="Annonces Publiques" 
          />
          
          {(user.role === 'admin' || user.role === 'agent' || user.role === 'proprietaire') && (
            <SidebarLink to="/properties/create" icon={PlusCircle} label="Ajouter un bien" active={isActive('/properties/create')} />
          )}

          <SidebarLink to="/transactions" icon={Wallet} label="Mes Transactions" active={isActive('/transactions')} />
          
          {user.role === 'admin' && (
            <>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 mt-8 mb-4 px-4">Administration</p>
              <SidebarLink to="/admin/agents" icon={Users} label="Gestion des Agents" active={isActive('/admin/agents')} />
              <SidebarLink to="/admin/validations" icon={ShieldCheck} label="Validations en attente" active={isActive('/admin/validations')} />
            </>
          )}
        </nav>

        <div className="pt-6 border-t border-white/5 space-y-2">
          <SidebarLink to="/settings" icon={Settings} label="Paramètres" active={isActive('/settings')} />
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3.5 rounded-xl text-red-400 hover:bg-red-500/10 transition-all font-bold text-sm"
          >
            <LogOut size={20} />
            <span>Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* Custom Security Modal (Replaces standard confirm) */}
      <AnimatePresence>
        {showSecurityModal && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSecurityModal(false)}
              className="absolute inset-0 bg-dark/90 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="card w-full max-w-sm relative z-10 !p-8 text-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500 mx-auto mb-6 border border-amber-500/20">
                <Shield size={32} />
              </div>
              <h2 className="text-xl font-black mb-3">Sortie Sécurisée</h2>
              <p className="text-slate-400 text-sm mb-8 leading-relaxed">
                Pour accéder à la zone publique, vous devez fermer votre session active.
              </p>
              <div className="space-y-3">
                <button 
                  onClick={confirmSecurityExit}
                  className="btn-primary w-full shadow-lg shadow-primary/20"
                >
                  SE DÉCONNECTER ET QUITTER
                </button>
                <button 
                  onClick={() => setShowSecurityModal(false)}
                  className="w-full py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-white transition-colors"
                >
                  ANNULER
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
