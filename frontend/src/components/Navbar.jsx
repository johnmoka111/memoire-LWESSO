import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, User, Bell, LogOut, ShieldCheck, Cpu, LayoutDashboard, ShoppingBag, ChevronRight, Sparkles } from 'lucide-react';
import { LogoIcon, BrandName } from './Logo';

const Navbar = () => {
  const token = localStorage.getItem('token');
  const storedUser = localStorage.getItem('user');
  const user = (storedUser && storedUser !== 'undefined') ? JSON.parse(storedUser) : {};
  const navigate = useNavigate();
  const location = useLocation();

  const isHome = location.pathname === '/';
  const isAdmin = ['admin', 'superadmin', 'administrateur'].includes(user.role?.toLowerCase().trim());
  const pageTitles = {
    '/dashboard': 'Vue d’ensemble',
    '/admin/agents': 'Gestion des agents',
    '/admin/validations': 'Validations foncières',
    '/agent/missions': 'Mes missions terrain',
    '/messages': 'Messagerie sécurisée',
    '/transactions': 'Séquestre Blockchain',
    '/settings': 'Paramètres du compte',
    '/properties/create': 'Nouveau bien foncier'
  };
  const pageTitle = pageTitles[location.pathname] || (isAdmin ? 'Espace administration' : 'Kivu Immobilier');

  const logout = () => {
    localStorage.clear();
    window.location.hash = '#/';
    window.location.reload();
  };

  return (
    <nav className="border-b border-white/10 px-4 md:px-8 py-3 flex items-center justify-between sticky top-0 bg-[#080A12]/95 backdrop-blur-2xl z-50 shadow-[0_10px_35px_rgba(0,0,0,0.4)]">
      {/* Côté Gauche : Navigation & Titre */}
      <div className="flex items-center gap-4">
        {!isHome && (
          <button 
            onClick={() => navigate(-1)} 
            className="p-2 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition-all group"
            title="Retour"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-0.5 transition-transform" />
          </button>
        )}
        <Link to="/dashboard" className="flex items-center gap-3 cursor-pointer group">
          <div className="relative">
            <LogoIcon size="md" />
            {isAdmin && (
              <span className="absolute -bottom-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-indigo-500 ring-2 ring-[#080A12]">
                <Sparkles size={8} className="text-white" />
              </span>
            )}
          </div>
          <div className="md:hidden"><BrandName subtitle={false} /></div>
          <div className="hidden md:block">
            <div className="flex items-center gap-2">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                {isAdmin ? 'Administration Windows' : 'Espace Sécurisé'}
              </p>
              {isAdmin && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                  <Cpu size={10} className="animate-pulse text-indigo-400" /> Windows Node Active
                </span>
              )}
            </div>
            <p className="mt-0.5 text-sm font-bold text-white group-hover:text-indigo-300 transition-colors flex items-center gap-1.5">
              {pageTitle}
            </p>
          </div>
        </Link>
      </div>

      {/* Côté Droit : Boutons de Navigation Personnalisés Admin & Profil */}
      <div className="flex items-center gap-3 md:gap-4">
        {/* Bouton de Navigation Personnalisé pour Administrateur */}
        {isAdmin && (
          <div className="hidden lg:flex items-center gap-1 p-1 bg-white/[0.04] border border-white/10 rounded-2xl backdrop-blur-md">
            <Link
              to="/dashboard"
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                location.pathname === '/dashboard'
                  ? 'bg-gradient-to-r from-indigo-600 to-primary text-white shadow-md shadow-indigo-500/25'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <LayoutDashboard size={14} />
              <span>Dashboard</span>
            </Link>
            <Link
              to="/admin/validations"
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                location.pathname === '/admin/validations'
                  ? 'bg-gradient-to-r from-indigo-600 to-primary text-white shadow-md shadow-indigo-500/25'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <ShieldCheck size={14} />
              <span>Validations</span>
            </Link>
            <Link
              to="/properties"
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                location.pathname === '/properties'
                  ? 'bg-gradient-to-r from-indigo-600 to-primary text-white shadow-md shadow-indigo-500/25'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <ShoppingBag size={14} />
              <span>Marketplace</span>
            </Link>
          </div>
        )}

        {/* Bouton Annonces pour non-admin */}
        {!isAdmin && (
          <Link 
            to="/properties"
            className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 text-xs font-bold transition-all"
          >
            <ShoppingBag size={15} className="text-primary" />
            <span>Catalogue Biens</span>
          </Link>
        )}
        
        {token ? (
          <div className="flex items-center gap-2 md:gap-3 pl-3 md:pl-4 border-l border-white/10">
            <button className="hidden sm:flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:bg-white/10 hover:text-white transition-all relative" title="Notifications">
              <Bell size={16} />
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-indigo-500 ring-2 ring-[#080A12]" />
            </button>

            <div className="hidden md:block text-right">
              <p className="text-xs font-bold text-white leading-tight">{user.prenom || 'Utilisateur'} {user.nom}</p>
              <span className="text-[9px] font-black uppercase tracking-widest text-indigo-400">
                {isAdmin ? '👑 Administrateur' : user.role}
              </span>
            </div>

            <Link 
              to="/dashboard" 
              className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-primary flex items-center justify-center shadow-lg shadow-indigo-500/20 border border-white/20 hover:scale-105 transition-transform"
            >
              <User size={17} className="text-white" />
            </Link>

            <button 
              onClick={logout} 
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-all" 
              title="Déconnexion"
            >
              <LogOut size={16} />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Link to="/login" className="text-slate-400 text-xs font-bold hover:text-white transition-colors px-3 py-2">Connexion</Link>
            <Link to="/register" className="btn-primary py-2 px-4 text-xs font-bold shadow-lg shadow-primary/25">
              S'inscrire
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
