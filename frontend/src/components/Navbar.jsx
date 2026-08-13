import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  ArrowLeft, 
  User, 
  Bell, 
  LogOut, 
  ShieldCheck, 
  LayoutDashboard, 
  ShoppingBag, 
  PlusCircle, 
  Users, 
  Wallet, 
  MessageSquare, 
  Settings, 
  Home,
  UserPlus,
  Sun,
  Moon
} from 'lucide-react';
import { LogoIcon, BrandName } from './Logo';

const Navbar = () => {
  const token = localStorage.getItem('token');
  const storedUser = localStorage.getItem('user');
  const user = (storedUser && storedUser !== 'undefined') ? JSON.parse(storedUser) : {};
  const navigate = useNavigate();
  const location = useLocation();

  const isHome = location.pathname === '/';
  const isAdmin = ['admin', 'superadmin', 'administrateur'].includes(user.role?.toLowerCase().trim());

  const [isLightMode, setIsLightMode] = useState(() => {
    return localStorage.getItem('theme') === 'light';
  });

  useEffect(() => {
    if (isLightMode) {
      document.body.classList.add('light-mode');
      localStorage.setItem('theme', 'light');
    } else {
      document.body.classList.remove('light-mode');
      localStorage.setItem('theme', 'dark');
    }
  }, [isLightMode]);

  const toggleTheme = () => {
    setIsLightMode(prev => !prev);
  };

  // Configuration Dynamique des Pages selon l'URL active
  const getPageMeta = (path) => {
    if (path === '/dashboard') return { title: 'Tableau de bord', badge: 'Vue d’ensemble', icon: LayoutDashboard };
    if (path === '/properties') return { title: 'Annonces Immobilières', badge: 'Marketplace Publique', icon: ShoppingBag };
    if (path === '/properties/create') return { title: 'Ajouter un Bien', badge: 'Soumission Foncière', icon: PlusCircle };
    if (path === '/admin/agents') return { title: 'Gestion des Agents', badge: 'Supervision Admin', icon: Users };
    if (path === '/admin/validations') return { title: 'Validations en Attente', badge: 'Contrôle Terrain', icon: ShieldCheck };
    if (path === '/agent/missions') return { title: 'Missions Terrain', badge: 'Espace Agent Assermenté', icon: ShieldCheck };
    if (path === '/transactions') return { title: 'Opérations Escrow', badge: 'Séquestre Blockchain', icon: Wallet };
    if (path === '/messages') return { title: 'Messagerie', badge: 'Discussions Sécurisées', icon: MessageSquare };
    if (path === '/settings') return { title: 'Paramètres du Compte', badge: 'Configuration Utilisateur', icon: Settings };
    if (path.startsWith('/properties/')) return { title: 'Détail du Bien', badge: 'Titre Foncier Numérique', icon: Home };
    if (path === '/login') return { title: 'Connexion', badge: 'Accès Sécurisé', icon: User };
    if (path === '/register') return { title: 'Inscription', badge: 'Nouveau Compte', icon: UserPlus };

    return { title: isAdmin ? 'Espace Administration' : 'Kivu Immobilier+', badge: 'Espace Sécurisé', icon: Home };
  };

  const currentMeta = getPageMeta(location.pathname);
  const PageIcon = currentMeta.icon;

  const logout = () => {
    localStorage.clear();
    window.location.hash = '#/';
    window.location.reload();
  };

  // SI NON CONNECTÉ : Afficher le Header du Site Public
  if (!token) {
    return (
      <nav className="fixed top-0 left-0 right-0 z-50 w-full bg-[#060812] border-b border-slate-800 px-4 md:px-8 py-3.5 flex items-center justify-between shadow-[0_4px_25px_rgba(0,0,0,0.9)] transition-colors duration-300">
        {/* Logo du Site Public */}
        <Link to="/" className="flex items-center gap-3 cursor-pointer group">
          <LogoIcon size="md" />
          <BrandName subtitle={true} />
        </Link>

        {/* Liens du Menu Public */}
        <div className="hidden md:flex items-center gap-6 text-xs font-bold">
          <Link to="/" className="text-slate-300 hover:text-blue-400 transition-colors">Accueil</Link>
          <Link to="/properties" className="text-slate-300 hover:text-blue-400 transition-colors">Catalogue Annonces</Link>
          <Link to="/properties/create" className="text-slate-300 hover:text-blue-400 transition-colors">Soumettre un Bien</Link>
        </div>

        {/* Boutons d'Action Public (Connexion / Inscription + Theme Toggle) */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 transition-all flex items-center gap-1.5 shadow-sm"
            title={isLightMode ? "Passer en mode Sombre" : "Passer en mode Clair"}
          >
            {isLightMode ? <Moon size={16} className="text-indigo-600" /> : <Sun size={16} className="text-amber-400" />}
            <span className="hidden sm:inline text-xs font-bold">
              {isLightMode ? 'Sombre' : 'Clair'}
            </span>
          </button>

          <Link to="/login" className="px-4 py-2 text-xs font-bold text-slate-300 hover:text-white bg-slate-800/60 hover:bg-slate-800 border border-slate-700 rounded-xl transition-all">
            Connexion
          </Link>
          <Link to="/register" className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-lg shadow-blue-600/30 transition-all">
            S'inscrire
          </Link>
        </div>
      </nav>
    );
  }

  // SI CONNECTÉ : Header Administration / Espace Sécurisé
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 w-full bg-[#060812] border-b border-slate-800 px-4 md:px-8 py-3.5 flex items-center justify-between shadow-[0_4px_25px_rgba(0,0,0,0.9)] transition-colors duration-300">
      {/* Partie Gauche : Logo + Titre Dynamique de la Page Admin */}
      <div className="flex items-center gap-3 md:gap-4">
        {!isHome && (
          <button 
            onClick={() => navigate(-1)} 
            className="p-2 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition-all group"
            title="Page précédente"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-0.5 transition-transform" />
          </button>
        )}
        
        <Link to="/dashboard" className="flex items-center gap-3 cursor-pointer group">
          <LogoIcon size="md" />
          <div className="md:hidden"><BrandName subtitle={false} /></div>
          
          {/* Titre et Badge Dynamique Admin */}
          <div className="hidden md:block">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest bg-white/5 text-indigo-300 border border-white/10">
                <PageIcon size={10} className="text-indigo-400" />
                {currentMeta.badge}
              </span>
            </div>
            <p className="mt-0.5 text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">
              {currentMeta.title}
            </p>
          </div>
        </Link>
      </div>

      {/* Partie Droite : User Profile, Theme Toggle & Logout */}
      <div className="flex items-center gap-3 md:gap-4">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 transition-all flex items-center gap-1.5 shadow-sm"
          title={isLightMode ? "Passer en mode Sombre" : "Passer en mode Clair"}
        >
          {isLightMode ? <Moon size={16} className="text-indigo-600" /> : <Sun size={16} className="text-amber-400" />}
          <span className="hidden sm:inline text-xs font-bold">
            {isLightMode ? 'Sombre' : 'Clair'}
          </span>
        </button>

        {location.pathname !== '/properties/create' && (
          <Link
            to="/properties/create"
            className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold shadow-lg shadow-blue-500/20 hover:scale-105 transition-all"
          >
            <PlusCircle size={15} />
            <span>Ajouter un bien</span>
          </Link>
        )}

        <div className="flex items-center gap-2 md:gap-3 pl-3 md:pl-4 border-l border-white/10">
          <div className="hidden md:block text-right">
            <p className="text-xs font-bold text-white leading-tight">{user.prenom || 'Utilisateur'} {user.nom}</p>
            <span className="text-[9px] font-black uppercase tracking-widest text-blue-400">
              {isAdmin ? '👑 Administrateur' : user.role}
            </span>
          </div>

          <Link 
            to="/dashboard" 
            className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg border border-white/20 hover:scale-105 transition-transform"
            title="Mon Profil"
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
      </div>
    </nav>
  );
};

export default Navbar;
