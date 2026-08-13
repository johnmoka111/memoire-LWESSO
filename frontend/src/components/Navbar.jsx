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
  UserPlus
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

  return (
    <nav className="sticky top-0 z-50 w-full bg-[#080A12]/95 border-b border-white/10 px-4 md:px-8 py-3.5 flex items-center justify-between backdrop-blur-2xl shadow-[0_10px_30px_rgba(0,0,0,0.35)] transition-all">
      {/* Partie Gauche : Logo + Titre Dynamique de la Page */}
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
          
          {/* Titre et Badge Dynamique selon la page */}
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

      {/* Partie Droite : Actions Contextuelles Dynamiques & Profil */}
      <div className="flex items-center gap-3 md:gap-4">
        {/* Bouton d'action dynamique selon la page */}
        {location.pathname !== '/properties/create' && token && (
          <Link
            to="/properties/create"
            className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-primary text-white text-xs font-bold shadow-lg shadow-indigo-500/20 hover:scale-105 transition-all"
          >
            <PlusCircle size={15} />
            <span>Ajouter un bien</span>
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
