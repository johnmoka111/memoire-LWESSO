import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Search, PlusCircle, LayoutDashboard, User } from 'lucide-react';

const MobileNav = () => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white text-slate-900 dark:bg-[#060812] dark:text-white border-t border-slate-200 dark:border-slate-800 px-6 py-3 flex items-center justify-between z-[100] pb-safe opacity-100 shadow-lg">
      <Link to="/" className={`flex flex-col items-center gap-1 ${isActive('/') ? 'text-primary' : 'text-slate-500'}`}>
        <Home size={20} />
        <span className="text-[10px] font-bold uppercase tracking-widest">Accueil</span>
      </Link>
      
      <Link to="/properties" className={`flex flex-col items-center gap-1 ${isActive('/properties') ? 'text-primary' : 'text-slate-500'}`}>
        <Search size={20} />
        <span className="text-[10px] font-bold uppercase tracking-widest">Annonces</span>
      </Link>

      <Link to="/properties/create" className="relative -top-5">
        <div className="w-14 h-14 bg-primary rounded-full flex items-center justify-center text-white shadow-2xl shadow-primary/40 border-4 border-dark">
          <PlusCircle size={28} />
        </div>
      </Link>

      <Link to="/dashboard" className={`flex flex-col items-center gap-1 ${isActive('/dashboard') ? 'text-primary' : 'text-slate-500'}`}>
        <LayoutDashboard size={20} />
        <span className="text-[10px] font-bold uppercase tracking-widest">Dash</span>
      </Link>

      <Link to="/login" className={`flex flex-col items-center gap-1 ${isActive('/login') ? 'text-primary' : 'text-slate-500'}`}>
        <User size={20} />
        <span className="text-[10px] font-bold uppercase tracking-widest">Profil</span>
      </Link>
    </div>
  );
};

export default MobileNav;
