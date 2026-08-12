import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Shield, User, ArrowLeft } from 'lucide-react';

const Navbar = () => {
  const token = localStorage.getItem('token');
  const storedUser = localStorage.getItem('user');
  const user = (storedUser && storedUser !== 'undefined') ? JSON.parse(storedUser) : {};
  const navigate = useNavigate();
  const location = useLocation();

  const isHome = location.pathname === '/';

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
    <nav className="border-b border-white/5 px-4 md:px-8 py-4 md:py-5 flex items-center justify-between sticky top-0 bg-dark/90 backdrop-blur-xl z-50">
      <div className="flex items-center gap-3">
        {!isHome && (
          <button onClick={() => navigate(-1)} className="md:hidden p-2 -ml-2 text-slate-400">
            <ArrowLeft size={20} />
          </button>
        )}
        <div 
          onClick={() => handleSecurityExit('/')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl overflow-hidden bg-white/5 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
            <img src="assets/logo.png" alt="KivuMobilier" className="w-full h-full object-contain" />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="font-bold text-base md:text-lg tracking-tight text-white group-hover:text-primary transition-colors">KivuMarket<span className="text-primary">+</span></span>
            <span className="hidden md:block text-[10px] uppercase tracking-widest text-slate-500 font-semibold">Blockchain Immobilier</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 md:gap-8">
        <button 
          onClick={() => handleSecurityExit('/properties')}
          className="hidden md:block text-slate-400 text-sm hover:text-white transition-colors font-medium"
        >
          Annonces
        </button>
        
        {token ? (
          <div className="flex items-center gap-3 pl-4 md:pl-6 border-l border-white/10 group">
            <div className="hidden md:block text-right">
              <p className="text-xs font-bold text-white group-hover:text-primary transition-colors">{user.prenom}</p>
              <p className="text-[10px] text-slate-500 capitalize">{user.role}</p>
            </div>
            <Link to="/dashboard" className="w-9 h-9 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
              <User size={18} className="text-white" />
            </Link>
            <button 
              onClick={() => {
                localStorage.clear();
                window.location.hash = '#/';
                window.location.reload();
              }}
              className="p-2 text-slate-500 hover:text-red-500 transition-colors"
              title="Déconnexion"
            >
              <Shield size={18} />
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
