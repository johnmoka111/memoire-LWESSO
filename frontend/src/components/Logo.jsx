import React from 'react';
import { ShieldCheck } from 'lucide-react';

export const LogoIcon = ({ size = "md" }) => {
  const sizeClasses = {
    sm: "w-8 h-8 rounded-lg",
    md: "w-10 h-10 rounded-xl",
    lg: "w-16 h-16 rounded-2xl",
    xl: "w-20 h-20 md:w-24 md:h-24 rounded-3xl"
  }[size] || "w-10 h-10 rounded-xl";

  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 32,
    xl: 44
  }[size] || 20;

  return (
    <div className={`${sizeClasses} bg-gradient-to-br from-indigo-600 via-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25 border border-white/20 relative overflow-hidden group-hover:scale-105 transition-transform`}>
      <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
      <ShieldCheck size={iconSizes} className="relative z-10 text-white drop-shadow-sm" />
    </div>
  );
};

export const BrandName = ({ subtitle = true }) => {
  return (
    <div className="flex flex-col leading-tight">
      <span className="font-bold text-base md:text-lg tracking-tight text-white group-hover:text-indigo-400 transition-colors">
        Kivu Immobilier<span className="text-indigo-400">+</span>
      </span>
      {subtitle && (
        <span className="hidden md:block text-[10px] uppercase tracking-widest text-slate-400 font-semibold">
          Blockchain Immobilier
        </span>
      )}
    </div>
  );
};
