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
  CircleDot,
  Sun,
  Moon
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const SidebarLink = ({ to, icon: Icon, label, active, onClick }) => {
  if (onClick) {
    return (
      <button 
        onClick={onClick}
        className={`flex items-center justify-between w-full px-4 py-3 rounded-xl transition-all duration-200 group ${
          active
          ? 'bg-blue-50 border border-blue-200 text-blue-700 font-bold shadow-sm dark:bg-blue-950/70 dark:border-blue-800/60 dark:text-white'
          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 font-semibold dark:text-slate-400 dark:hover:bg-white/[0.04] dark:hover:text-slate-200'
        }`}
      >
        <div className="flex items-center gap-3">
          <Icon size={19} className={active ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 group-hover:text-slate-700 dark:text-slate-500 dark:group-hover:text-slate-300 transition-colors'} />
          <span className="text-sm tracking-tight">{label}</span>
        </div>
        {active && <ChevronRight size={14} className="text-blue-600 dark:text-blue-400" />}
      </button>
    );
  }

  return (
    <Link 
      to={to} 
      className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group ${
        active
        ? 'bg-blue-50 border border-blue-200 text-blue-700 font-bold shadow-sm dark:bg-blue-950/70 dark:border-blue-800/60 dark:text-white'
        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 font-semibold dark:text-slate-400 dark:hover:bg-white/[0.04] dark:hover:text-slate-200'
      }`}
    >
      <div className="flex items-center gap-3">
        <Icon size={19} className={active ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 group-hover:text-slate-700 dark:text-slate-500 dark:group-hover:text-slate-300 transition-colors'} />
        <span className="text-sm tracking-tight">{label}</span>
      </div>
      {active && <ChevronRight size={14} className="text-blue-600 dark:text-blue-400" />}
    </Link>
  );
};

const Sidebar = () => {
  const location = useLocation();
  const storedUser = localStorage.getItem('user');
  const user = (storedUser && storedUser !== 'undefined') ? JSON.parse(storedUser) : {};
  const [showSecurityModal, setShowSecurityModal] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const isActive = (path) => location.pathname === path;
  const isAdmin = ['admin', 'superadmin', 'administrateur'].includes(user.role?.toLowerCase().trim());

  const handleLogout = () => {
    localStorage.clear();
    window.location.hash = '#/';
    window.location.reload();
  };

  const confirmSecurityExit = () => {
    localStorage.clear();
    window.location.hash = '#/';
    window.location.reload();
  };

  return (
    <>
      <aside className="hidden md:flex flex-col w-72 xl:w-80 h-screen sticky top-0 p-4 xl:p-5 transition-colors duration-300 bg-white text-slate-800 border-r border-slate-200 dark:bg-[#070911] dark:text-slate-200 dark:border-slate-800/80 shadow-sm">
        {/* Brand / Logo */}
        <Link to="/dashboard" className="flex items-center gap-3 mb-8 px-2 cursor-pointer group">
          <LogoIcon size="sm" />
          <div className="min-w-0">
            <p className="font-black text-base tracking-tight text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">Kivu Immobilier<span className="text-blue-600">+</span></p>
            <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Espace Sécurisé</p>
          </div>
        </Link>

        {/* Liste des Boutons de Navigation Utiles */}
        <nav className="flex-1 space-y-1.5 overflow-y-auto pr-1">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mb-3 px-4">Menu Principal</p>
          
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
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mt-6 mb-3 px-4">Administration</p>
              <SidebarLink to="/admin/agents" icon={Users} label="Gestion des Agents" active={isActive('/admin/agents')} />
              <SidebarLink to="/admin/validations" icon={ShieldCheck} label="Validations en attente" active={isActive('/admin/validations')} />
            </>
          )}

          <div className="pt-4 mt-4 border-t border-slate-100 dark:border-white/10">
            <SidebarLink to="/settings" icon={Settings} label="Paramètres" active={isActive('/settings')} />
          </div>
        </nav>

        {/* Bouton d'Alternance de Thème dans le Sidebar */}
        <div className="pt-4 mt-auto space-y-2 border-t border-slate-100 dark:border-white/10">
          <button
            onClick={toggleTheme}
            className="flex items-center justify-between w-full px-4 py-3 rounded-2xl border transition-all text-xs font-bold bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-800 dark:bg-slate-800/80 dark:hover:bg-slate-800 dark:border-slate-700 dark:text-slate-200"
          >
            <div className="flex items-center gap-3">
              {theme === 'dark' ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} className="text-indigo-600" />}
              <span>{theme === 'dark' ? 'Basculer en Clair ☀️' : 'Basculer en Sombre 🌙'}</span>
            </div>
            <span className="text-[9px] uppercase font-black px-2 py-0.5 rounded bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300">
              {theme === 'dark' ? 'Sombre' : 'Clair'}
            </span>
          </button>

          {/* Bouton de Déconnexion au bas */}
          <button 
            onClick={handleLogout}
            className="flex items-center justify-between w-full px-4 py-3 rounded-2xl bg-red-50 border border-red-200 text-red-600 hover:bg-red-100 dark:bg-red-500/10 dark:border-red-500/20 dark:text-red-400 dark:hover:bg-red-500/20 transition-all font-bold text-xs group"
          >
            <div className="flex items-center gap-3">
              <LogOut size={18} className="group-hover:-translate-x-0.5 transition-transform" />
              <span>Déconnexion</span>
            </div>
            <ChevronRight size={14} className="opacity-50 group-hover:opacity-100 transition-opacity" />
          </button>
        </div>
      </aside>

      {/* Custom Security Modal */}
      <AnimatePresence>
        {showSecurityModal && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSecurityModal(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white dark:bg-[#0B101D] text-slate-900 dark:text-white rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-sm relative z-10 p-8 text-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center text-amber-600 dark:text-amber-500 mx-auto mb-6 border border-amber-200 dark:border-amber-500/20">
                <Shield size={32} />
              </div>
              <h2 className="text-xl font-black mb-3">Sortie Sécurisée</h2>
              <p className="text-slate-600 dark:text-slate-400 text-sm mb-8 leading-relaxed font-medium">
                Pour accéder à la zone publique, vous devez fermer votre session active.
              </p>
              <div className="space-y-3">
                <button 
                  onClick={confirmSecurityExit}
                  className="btn-primary w-full shadow-lg shadow-blue-500/20"
                >
                  SE DÉCONNECTER ET QUITTER
                </button>
                <button 
                  onClick={() => setShowSecurityModal(false)}
                  className="w-full py-3 text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  ANNULER
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Navigation Bas de Page pour Mobile (md:hidden) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-200 dark:bg-[#060812] dark:border-slate-800 flex items-center justify-around px-2 py-2 shadow-lg">
        <Link 
          to="/dashboard" 
          className={`flex flex-col items-center gap-1 p-2 rounded-xl text-[10px] font-bold transition-all ${
            isActive('/dashboard') ? 'text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-950/60' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <LayoutDashboard size={18} />
          <span>Dashboard</span>
        </Link>

        <Link 
          to="/properties" 
          className={`flex flex-col items-center gap-1 p-2 rounded-xl text-[10px] font-bold transition-all ${
            isActive('/properties') ? 'text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-950/60' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Home size={18} />
          <span>Annonces</span>
        </Link>

        <Link 
          to="/properties/create" 
          className={`flex flex-col items-center gap-1 p-2 rounded-xl text-[10px] font-bold transition-all ${
            isActive('/properties/create') ? 'text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-950/60' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <PlusCircle size={20} className="text-blue-600 dark:text-blue-400" />
          <span>+ Ajouter</span>
        </Link>

        <button
          onClick={toggleTheme}
          className="flex flex-col items-center gap-1 p-2 rounded-xl text-[10px] font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          title="Changer de thème"
        >
          {theme === 'dark' ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} className="text-indigo-600" />}
          <span>Thème</span>
        </button>

        <button 
          onClick={handleLogout} 
          className="flex flex-col items-center gap-1 p-2 rounded-xl text-[10px] font-bold text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-all"
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
