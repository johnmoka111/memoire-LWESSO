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
        className={`flex items-center justify-between w-full px-4 py-3 rounded-2xl transition-all duration-200 group ${
          active
          ? 'bg-gradient-to-r from-primary to-indigo-500 text-white shadow-lg shadow-primary/20'
          : 'text-slate-400 hover:bg-white/[0.06] hover:text-white'
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
        className={`flex items-center justify-between px-4 py-3 rounded-2xl transition-all duration-200 group ${
          active
          ? 'bg-gradient-to-r from-primary to-indigo-500 text-white shadow-lg shadow-primary/20'
          : 'text-slate-400 hover:bg-white/[0.06] hover:text-white'
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
  const isAdmin = ['admin', 'superadmin', 'administrateur'].includes(user.role?.toLowerCase().trim());
  const roleLabel = isAdmin ? 'Administration' : user.role === 'agent' ? 'Agent terrain' : user.role || 'Membre';

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
      <aside className="hidden md:flex flex-col w-72 xl:w-80 bg-[#080A12]/90 border-r border-white/10 h-screen sticky top-0 p-4 xl:p-5 backdrop-blur-xl">
        <Link to="/dashboard" className="flex items-center gap-3 mb-7 px-2 cursor-pointer group">
          <LogoIcon size="sm" />
          <div className="min-w-0">
            <p className="font-black text-base tracking-tight text-white group-hover:text-indigo-300 transition-colors">Kivu Immobilier<span className="text-indigo-400">+</span></p>
            <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-slate-500">Espace sécurisé</p>
          </div>
        </Link>

        {isAdmin && (
          <div className="relative mb-6 overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/15 to-indigo-500/5 p-4">
            <div className="absolute -right-5 -top-5 h-20 w-20 rounded-full bg-primary/20 blur-2xl" />
            <div className="relative flex items-start gap-3">
              <BadgeCheck size={18} className="mt-0.5 text-primary" />
              <div><p className="text-xs font-bold text-white">Centre de contrôle</p><p className="mt-1 text-[10px] leading-relaxed text-slate-400">Supervisez les validations et votre équipe.</p></div>
            </div>
          </div>
        )}

        <div className="flex items-center gap-3 mb-7 p-3 bg-white/[0.035] border border-white/10 rounded-2xl">
          <div className="w-11 h-11 rounded-xl bg-primary/10 border border-primary/20 overflow-hidden flex items-center justify-center">
            {user.avatar_url ? (
              <img src={user.avatar_url} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <UserIcon size={20} className="text-primary" />
            )}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-bold text-sm text-white truncate">{user.prenom || 'Utilisateur'} {user.nom}</span>
            <span className="text-[9px] font-black uppercase tracking-widest text-primary truncate">{roleLabel}</span>
          </div>
        </div>

        <nav className="flex-1 space-y-1.5 overflow-y-auto pr-1">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 mb-3 px-4">Navigation</p>
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

          {/* Transactions uniquement pour ceux qui achètent/vendent */}
          {user.role !== 'agent' && (
            <SidebarLink to="/transactions" icon={Wallet} label="Mes Transactions" active={isActive('/transactions')} />
          )}
          
          {isAdmin && (
            <>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 mt-7 mb-3 px-4">Administration</p>
              <SidebarLink to="/admin/agents" icon={Users} label="Gestion des Agents" active={isActive('/admin/agents')} />
              <SidebarLink to="/admin/validations" icon={ShieldCheck} label="Validations en attente" active={isActive('/admin/validations')} />
            </>
          )}
        </nav>

        <div className="pt-4 mt-4 border-t border-white/10 space-y-1.5">
          <div className="flex items-center gap-2 px-4 pb-2 text-[9px] font-bold uppercase tracking-widest text-emerald-400"><CircleDot size={10} className="fill-emerald-400" /> Session sécurisée</div>
          <SidebarLink to="/settings" icon={Settings} label="Paramètres" active={isActive('/settings')} />
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-2xl text-red-400 hover:bg-red-500/10 transition-all font-bold text-sm"
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
