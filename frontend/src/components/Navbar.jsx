import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, User, Bell, LogOut } from 'lucide-react';
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
    '/admin/validations': 'Validations',
    '/agent/missions': 'Mes missions',
    '/messages': 'Messages',
    '/settings': 'Paramètres'
  };
  const pageTitle = pageTitles[location.pathname] || (isAdmin ? 'Espace administration' : 'Kivu Immobilier');

  const logout = () => {
    localStorage.clear();
    window.location.hash = '#/';
    window.location.reload();
  };

  const handleSecurityExit = (to) => {
    if (token) {
      const confirm = window.confirm("Sécurité : Pour accéder à la zone publique, vous devez vous déconnecter. Souhaitez-vous fermer votre session ?");
      if (confirm) {
        localStorage.clear();
        window.location.hash = '#/';
        window.location.reload();
      }
    } else {
      navigate(to);
    }
  };

  return (
    <nav className="border-b border-white/10 px-4 md:px-8 py-3.5 md:py-4 flex items-center justify-between sticky top-0 bg-[#090B13]/90 backdrop-blur-xl z-50 shadow-[0_10px_30px_rgba(0,0,0,0.12)]">
      <div className="flex items-center gap-3">
        {!isHome && (
          <button onClick={() => navigate(-1)} className="md:hidden p-2 -ml-2 text-slate-400">
            <ArrowLeft size={20} />
          </button>
        )}
        <Link to="/" className="flex items-center gap-3 cursor-pointer group">
          <LogoIcon size="md" />
          <div className="md:hidden"><BrandName subtitle={false} /></div>
          <div className="hidden md:block">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">{isAdmin ? 'Administration' : 'Espace sécurisé'}</p>
            <p className="mt-0.5 text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">{pageTitle}</p>
          </div>
        </Link>
      </div>

      <div className="flex items-center gap-3 md:gap-5">
        <Link 
          to="/properties"
          className="hidden md:block text-slate-400 text-sm hover:text-white transition-colors font-medium"
        >
          Annonces
        </Link>
        
        {token ? (
          <div className="flex items-center gap-2 md:gap-3 pl-3 md:pl-5 border-l border-white/10 group">
            <button className="hidden sm:flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 hover:bg-white/5 hover:text-white transition-colors" title="Notifications">
              <Bell size={17} />
            </button>
            <div className="hidden md:block text-right">
              <p className="text-xs font-bold text-white group-hover:text-primary transition-colors">{user.prenom}</p>
              <p className="text-[10px] text-slate-500 capitalize">{isAdmin ? 'Administrateur' : user.role}</p>
            </div>
            <Link to="/dashboard" className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-indigo-500 flex items-center justify-center shadow-lg shadow-primary/20">
              <User size={18} className="text-white" />
            </Link>
            <button onClick={logout} className="hidden md:flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 hover:bg-red-500/10 hover:text-red-400 transition-colors" title="Déconnexion">
              <LogOut size={17} />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-slate-400 text-sm hover:text-white transition-colors">Connexion</Link>
            <Link to="/register" className="btn-primary py-2 px-4 md:py-2.5 md:px-5 text-xs md:text-sm">
              S'inscrire
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
