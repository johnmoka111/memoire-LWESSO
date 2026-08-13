import React from 'react';
import logoImg from '../assets/logo.png';

export const LogoIcon = ({ size = "md" }) => {
  const sizeClasses = {
    sm: "w-8 h-8 rounded-lg",
    md: "w-10 h-10 rounded-xl",
    lg: "w-16 h-16 rounded-2xl",
    xl: "w-20 h-20 md:w-24 md:h-24 rounded-3xl"
  }[size] || "w-10 h-10 rounded-xl";

  const handleImageError = (e) => {
    if (!e.target.dataset.triedFallback) {
      e.target.dataset.triedFallback = "true";
      e.target.src = "assets/logo.png";
    }
  };

  return (
    <div className={`${sizeClasses} bg-slate-900/90 border border-slate-700 flex items-center justify-center shadow-lg overflow-hidden group-hover:scale-105 transition-transform p-1`}>
      <img 
        src={logoImg || "assets/logo.png"} 
        alt="Kivu Immobilier Logo" 
        onError={handleImageError}
        className="w-full h-full object-contain" 
      />
    </div>
  );
};

export const BrandName = ({ subtitle = true }) => {
  return (
    <div className="flex flex-col leading-tight">
      <span className="font-bold text-base md:text-lg tracking-tight text-white group-hover:text-blue-400 transition-colors">
        Kivu Immobilier<span className="text-blue-400">+</span>
      </span>
      {subtitle && (
        <span className="hidden md:block text-[10px] uppercase tracking-widest text-slate-400 font-semibold">
          Securité Foncière Blockchain
        </span>
      )}
    </div>
  );
};
