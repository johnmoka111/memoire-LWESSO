import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LogoIcon } from './Logo';
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
  User as UserIcon,
  MessageSquare,
  BadgeCheck,
  CircleDot
} from 'lucide-react';

const SidebarLink = ({ to, icon: Icon, label, active, onClick }) => {
  if (onClick) {
    return (
      <button 
        onClick={onClick}
        className={`flex items-center justify-between w-full px-4 py-3 rounded-xl transition-all duration-200 group ${
          active
          ? 'bg-blue-950/70 border border-blue-800/60 text-white shadow-md shadow-black/40'
          : 'text-slate-400 hover:bg-white/[0.04] hover:text-slate-200'
        }`}
      >
        <div className="flex items-center gap-3">
          <Icon size={19} className={active ? 'text-blue-400' : 'text-slate-500 group-hover:text-slate-300 transition-colors'} />
          <span className="text-sm font-bold tracking-tight">{label}</span>
        </div>
        {active && <ChevronRight size={14} className="text-blue-400" />}
      </button>
    );
  }

  return (
    <Link 
      to={to} 
      className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group ${
        active
        ? 'bg-blue-950/70 border border-blue-800/60 text-white shadow-md shadow-black/40'
        : 'text-slate-400 hover:bg-white/[0.04] hover:text-slate-200'
      }`}
    >
      <div className="flex items-center gap-3">
        <Icon size={19} className={active ? 'text-blue-400' : 'text-slate-500 group-hover:text-slate-300 transition-colors'} />
        <span className="text-sm font-bold tracking-tight">{label}</span>
      </div>
      {active && <ChevronRight size={14} className="text-blue-400" />}
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
  const isAdmin = ['admin', 'superadmin', 'administrateur'].includes(user.role?.toLowerCase().trim());

  const handleLogout = () => {
    localStorage.clear();
    window.location.hash = '#/login';
    window.location.reload();
  };

  const openSecurityModal = (to) => {
    setPendingPath(to);
    setShowSecurityModal(true);
  };

  const confirmSecurityExit = () => {
    localStorage.clear();
    window.location.hash = '#/';
    window.location.reload();
  };

  return (
    <>
      <aside className="hidden md:flex flex-col w-72 xl:w-80 bg-[#070911] border-r border-slate-800/80 h-screen sticky top-0 p-4 xl:p-5 shadow-[10px_0_30px_rgba(0,0,0,0.5)]">
        {/* Brand / Logo */}
        <Link to="/dashboard" className="flex items-center gap-3 mb-8 px-2 cursor-pointer group">
          <LogoIcon size="sm" />
          <div className="min-w-0">
            <p className="font-black text-base tracking-tight text-white group-hover:text-blue-400 transition-colors">Kivu Immobilier<span className="text-blue-500">+</span></p>
            <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-slate-500">Espace Sécurisé</p>
          </div>
        </Link>

        {/* Liste des Boutons de Navigation Utiles */}
        <nav className="flex-1 space-y-1.5 overflow-y-auto pr-1">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-3 px-4">Menu Principal</p>
          
          <SidebarLink to="/dashboard" icon={LayoutDashboard} label="Tableau de bord" active={isActive('/dashboard')} />
          
          <SidebarLink 
            to="/properties" 
            icon={Home} 
            label="Annonces Publiques" 
            active={isActive('/properties')}
          />
          
          <SidebarLink to="/messages" icon={MessageSquare} label="Mes Messages" active={isActive('/messages')} />

          <SidebarLink to="/properties/create" icon={PlusCircle} label="Ajouter un bien" active={isActive('/properties/create')} />

          {/* Missions pour l'agent */}
          {user.role === 'agent' && (
            <SidebarLink to="/agent/missions" icon={ShieldCheck} label="Mes Missions" active={isActive('/agent/missions')} />
          )}

          {/* Transactions pour acheteurs / vendeurs */}
          {user.role !== 'agent' && (
            <SidebarLink to="/transactions" icon={Wallet} label="Mes Transactions" active={isActive('/transactions')} />
          )}
          
          {/* Boutons réservés à l'administration */}
          {isAdmin && (
            <>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mt-6 mb-3 px-4">Administration</p>
              <SidebarLink to="/admin/agents" icon={Users} label="Gestion des Agents" active={isActive('/admin/agents')} />
              <SidebarLink to="/admin/validations" icon={ShieldCheck} label="Validations en attente" active={isActive('/admin/validations')} />
            </>
          )}

          <div className="pt-4 mt-4 border-t border-white/10">
            <SidebarLink to="/settings" icon={Settings} label="Paramètres" active={isActive('/settings')} />
          </div>
        </nav>

        {/* Bouton de Déconnexion au bas */}
        <div className="pt-4 mt-auto border-t border-white/10">
          <button 
            onClick={handleLogout}
            className="flex items-center justify-between w-full px-4 py-3 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-all font-bold text-xs group"
          >
            <div className="flex items-center gap-3">
              <LogOut size={18} className="group-hover:-translate-x-0.5 transition-transform" />
              <span>Déconnexion</span>
            </div>
            <ChevronRight size={14} className="opacity-50 group-hover:opacity-100 transition-opacity" />
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
        {/* Navigation Bas de Page pour Mobile (md:hidden) avec TOUS les boutons utiles */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#060812] border-t border-slate-800 flex items-center justify-around px-2 py-2 shadow-[0_-4px_25px_rgba(0,0,0,0.8)]">
          <Link 
            to="/dashboard" 
            className={`flex flex-col items-center gap-1 p-2 rounded-xl text-[10px] font-bold transition-all ${
              isActive('/dashboard') ? 'text-blue-400 bg-blue-950/60' : 'text-slate-400 hover:text-white'
            }`}
          >
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
          </Link>

          <Link 
            to="/properties" 
            className={`flex flex-col items-center gap-1 p-2 rounded-xl text-[10px] font-bold transition-all ${
              isActive('/properties') ? 'text-blue-400 bg-blue-950/60' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Home size={18} />
            <span>Annonces</span>
          </Link>

          <Link 
            to="/properties/create" 
            className={`flex flex-col items-center gap-1 p-2 rounded-xl text-[10px] font-bold transition-all ${
              isActive('/properties/create') ? 'text-blue-400 bg-blue-950/60' : 'text-slate-400 hover:text-white'
            }`}
          >
            <PlusCircle size={20} className="text-blue-400" />
            <span>+ Ajouter</span>
          </Link>

          {isAdmin ? (
            <Link 
              to="/admin/validations" 
              className={`flex flex-col items-center gap-1 p-2 rounded-xl text-[10px] font-bold transition-all ${
                isActive('/admin/validations') ? 'text-blue-400 bg-blue-950/60' : 'text-slate-400 hover:text-white'
              }`}
            >
              <ShieldCheck size={18} />
              <span>Validations</span>
            </Link>
          ) : user.role === 'agent' ? (
            <Link 
              to="/agent/missions" 
              className={`flex flex-col items-center gap-1 p-2 rounded-xl text-[10px] font-bold transition-all ${
                isActive('/agent/missions') ? 'text-blue-400 bg-blue-950/60' : 'text-slate-400 hover:text-white'
              }`}
            >
              <ShieldCheck size={18} />
              <span>Missions</span>
            </Link>
          ) : (
            <Link 
              to="/transactions" 
              className={`flex flex-col items-center gap-1 p-2 rounded-xl text-[10px] font-bold transition-all ${
                isActive('/transactions') ? 'text-blue-400 bg-blue-950/60' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Wallet size={18} />
              <span>Escrow</span>
            </Link>
          )}

          <Link 
            to="/settings" 
            className={`flex flex-col items-center gap-1 p-2 rounded-xl text-[10px] font-bold transition-all ${
              isActive('/settings') ? 'text-blue-400 bg-blue-950/60' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Settings size={18} />
            <span>Option</span>
          </Link>

          <button 
            onClick={handleLogout} 
            className="flex flex-col items-center gap-1 p-2 rounded-xl text-[10px] font-bold text-red-400 hover:text-red-300 transition-all"
            title="Déconnexion"
          >
            <LogOut size={18} />
            <span>Quitter</span>
          </button>
        </div>
      </>
    );
  };

export default Sidebar;
