import React from 'react';
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
import { LogoIcon } from './Logo';
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
  const token = localStorage.getItem('token');
  const storedUser = localStorage.getItem('user');
  const user = (storedUser && storedUser !== 'undefined') ? JSON.parse(storedUser) : {};
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  const isHome = location.pathname === '/';
  const isAdmin = ['admin', 'superadmin', 'administrateur'].includes(user.role?.toLowerCase().trim());

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

  // SI NON CONNECTÉ : Header Public (100% Opacité, non transparent)
  if (!token) {
    return (
      <nav className="fixed top-0 left-0 right-0 z-50 w-full transition-colors duration-300 bg-white text-slate-900 border-slate-200 dark:bg-[#060812] dark:text-white dark:border-slate-800 border-b px-4 md:px-8 py-3 flex items-center justify-between shadow-md opacity-100">
        {/* Logo du Site Public */}
        <Link to="/" className="flex items-center gap-3 cursor-pointer group">
          <LogoIcon size="md" />
          <div className="flex flex-col leading-tight">
            <span className="font-extrabold text-base md:text-lg tracking-tight group-hover:text-blue-600 transition-colors">
              Kivu Immobilier<span className="text-blue-600">+</span>
            </span>
            <span className="hidden md:block text-[10px] uppercase tracking-widest text-slate-500 font-bold dark:text-slate-400">
              Sécurité Foncière Cadastrale
            </span>
          </div>
        </Link>

        {/* Liens du Menu Public */}
        <div className="hidden md:flex items-center gap-6 text-xs font-bold">
          <Link to="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Accueil</Link>
          <Link to="/properties" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Catalogue Annonces</Link>
          <Link to="/properties/create" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Soumettre un Bien</Link>
        </div>

        {/* Action + Switcher Thème */}
        <div className="flex items-center gap-2.5">
          {/* Bouton d'Alternance de Thème Clair / Sombre */}
          <button
            onClick={toggleTheme}
            className="px-3 py-2 rounded-xl border flex items-center gap-2 text-xs font-bold transition-all shadow-sm active:scale-95 bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-100 dark:border-slate-700"
            title={theme === 'dark' ? "Basculez vers le Thème Clair ☀️" : "Basculez vers le Thème Sombre 🌙"}
          >
            {theme === 'dark' ? (
              <>
                <Sun size={16} className="text-amber-400" />
                <span className="hidden sm:inline text-[11px] uppercase tracking-wider font-extrabold">Super Clair ☀️</span>
              </>
            ) : (
              <>
                <Moon size={16} className="text-indigo-600" />
                <span className="hidden sm:inline text-[11px] uppercase tracking-wider font-extrabold text-slate-700">Sombre 🌙</span>
              </>
            )}
          </button>

          <Link to="/login" className="px-3.5 py-2 text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 dark:bg-slate-800/80 dark:hover:bg-slate-800 dark:text-slate-200 dark:border-slate-700 rounded-xl transition-all">
            Connexion
          </Link>
          <Link to="/register" className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md shadow-blue-600/20 transition-all">
            S'inscrire
          </Link>
        </div>
      </nav>
    );
  }

  // SI CONNECTÉ : Header Espace Sécurisé / Admin (100% Opacité, non transparent)
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 w-full transition-colors duration-300 bg-white text-slate-900 border-slate-200 dark:bg-[#060812] dark:text-white dark:border-slate-800 border-b px-4 md:px-8 py-3 flex items-center justify-between shadow-md opacity-100">
      {/* Partie Gauche : Logo + Titre Dynamique */}
      <div className="flex items-center gap-3 md:gap-4">
        {!isHome && (
          <button 
            onClick={() => navigate(-1)} 
            className="p-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-200 dark:bg-white/5 dark:border-white/10 dark:text-slate-400 dark:hover:text-white dark:hover:bg-white/10 transition-all group"
            title="Page précédente"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-0.5 transition-transform" />
          </button>
        )}
        
        <Link to="/dashboard" className="flex items-center gap-3 cursor-pointer group">
          <LogoIcon size="md" />
          
          {/* Titre et Badge Dynamique */}
          <div className="hidden md:block">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200 dark:bg-white/5 dark:text-indigo-300 dark:border-white/10">
                <PageIcon size={10} className="text-blue-600 dark:text-indigo-400" />
                {currentMeta.badge}
              </span>
            </div>
            <p className="mt-0.5 text-sm font-black text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-indigo-300 transition-colors">
              {currentMeta.title}
            </p>
          </div>
        </Link>
      </div>

      {/* Partie Droite : Action + Switcher Thème + User Profile */}
      <div className="flex items-center gap-2.5 md:gap-3">
        {/* Bouton d'Alternance de Thème (Thème Clair / Sombre) */}
        <button
          onClick={toggleTheme}
          className="px-3 py-2 rounded-xl border flex items-center gap-2 text-xs font-bold transition-all shadow-sm active:scale-95 bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-100 dark:border-slate-700"
          title={theme === 'dark' ? "Passer au Thème Clair ☀️" : "Passer au Thème Sombre 🌙"}
        >
          {theme === 'dark' ? (
            <>
              <Sun size={16} className="text-amber-400" />
              <span className="hidden sm:inline text-[11px] uppercase tracking-wider font-extrabold">Passer en Clair ☀️</span>
            </>
          ) : (
            <>
              <Moon size={16} className="text-indigo-600" />
              <span className="hidden sm:inline text-[11px] uppercase tracking-wider font-extrabold text-slate-700">Passer en Sombre 🌙</span>
            </>
          )}
        </button>

        {location.pathname !== '/properties/create' && (
          <Link
            to="/properties/create"
            className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold shadow-md shadow-blue-500/20 hover:scale-[1.02] transition-all"
          >
            <PlusCircle size={15} />
            <span>Ajouter un bien</span>
          </Link>
        )}

        <div className="flex items-center gap-2 md:gap-3 pl-2.5 md:pl-3 border-l border-slate-200 dark:border-white/10">
          <div className="hidden md:block text-right">
            <p className="text-xs font-bold text-slate-900 dark:text-white leading-tight">{user.prenom || 'Utilisateur'} {user.nom}</p>
            <span className="text-[9px] font-black uppercase tracking-wider text-blue-600 bg-blue-50 border border-blue-200 dark:bg-blue-950/60 dark:text-blue-400 dark:border-blue-800 px-1.5 py-0.5 rounded">
              {isAdmin ? '👑 Administrateur' : user.role}
            </span>
          </div>

          <Link 
            to="/dashboard" 
            className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center shadow-md border border-blue-500 hover:scale-105 transition-transform text-white"
            title="Mon Profil"
          >
            <User size={17} />
          </Link>

          <button 
            onClick={logout} 
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-50 border border-red-200 text-red-600 hover:bg-red-100 dark:bg-red-500/10 dark:border-red-500/20 dark:text-red-400 dark:hover:bg-red-500/20 transition-all" 
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
