import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, MapPin, Mail } from 'lucide-react';
import { LogoIcon } from './Logo';

const PublicFooter = () => (
  <footer className="border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-[#070A12]">
    <div className="mx-auto grid max-w-7xl gap-10 px-5 py-12 sm:px-8 md:grid-cols-2 lg:grid-cols-4 lg:px-10">
      <div className="md:col-span-2 lg:col-span-1"><div className="flex items-center gap-3"><LogoIcon size="sm" /><strong className="text-base text-slate-900 dark:text-white">Kivu Immobilier<span className="text-blue-600">+</span></strong></div><p className="mt-4 text-sm leading-relaxed text-slate-500 dark:text-slate-400">Une plateforme de confiance pour acheter, vendre et certifier un bien immobilier au Sud-Kivu.</p></div>
      <div><p className="text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white">Explorer</p><div className="mt-4 space-y-3 text-sm text-slate-500 dark:text-slate-400"><Link to="/properties" className="block hover:text-blue-600">Annonces vérifiées</Link><Link to="/register" className="block hover:text-blue-600">Créer un compte</Link><Link to="/login" className="block hover:text-blue-600">Se connecter</Link></div></div>
      <div><p className="text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white">Informations</p><div className="mt-4 space-y-3 text-sm text-slate-500 dark:text-slate-400"><Link to="/mentions-legales" className="block hover:text-blue-600">Mentions légales</Link><Link to="/cookies" className="block hover:text-blue-600">Politique de cookies</Link><button onClick={() => window.dispatchEvent(new Event('open-cookie-settings'))} className="block text-left hover:text-blue-600">Gérer mes cookies</button></div></div>
      <div><p className="text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white">Contact</p><div className="mt-4 space-y-3 text-sm text-slate-500 dark:text-slate-400"><p className="flex gap-2"><MapPin size={16} className="shrink-0 text-blue-600" />Bukavu, Sud-Kivu, RDC</p><p className="flex gap-2"><Mail size={16} className="shrink-0 text-blue-600" />contact@kivuimmobilier.cd</p><p className="flex gap-2"><ShieldCheck size={16} className="shrink-0 text-emerald-500" />Transactions sécurisées</p></div></div>
    </div>
    <div className="border-t border-slate-200 px-5 py-5 text-center text-xs text-slate-500 dark:border-slate-800 dark:text-slate-500">© {new Date().getFullYear()} Kivu Immobilier+. Tous droits réservés.</div>
  </footer>
);

export default PublicFooter;
