import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Search, Menu, UserCircle, Globe, MapPin, Calendar, Heart } from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-slate-200">
      <div className="max-w-[2520px] mx-auto xl:px-20 md:px-10 sm:px-2 px-4">
        <div className="flex flex-row items-center justify-between gap-3 md:gap-0 py-4">
          
          {/* Logo Section */}
          <Link to="/" className="flex items-center space-x-2 w-full md:w-auto">
            <div className="text-rose-500">
              <Shield className="w-8 h-8" />
            </div>
            <span className="hidden md:block text-xl font-bold text-rose-500 tracking-tight">
              KivuMarket
            </span>
          </Link>

          {/* Center Search Pill (Airbnb Style) */}
          <div className="hidden sm:block cursor-pointer">
            <div className="flex flex-row items-center border border-slate-200 rounded-full py-2 px-4 shadow-sm hover:shadow-md transition bg-white">
              <div className="text-sm font-semibold px-4 border-r border-slate-200">
                Bukavu
              </div>
              <div className="text-sm font-semibold px-4 border-r border-slate-200">
                Acheter
              </div>
              <div className="text-sm pl-4 pr-2 text-slate-500 flex flex-row items-center gap-3">
                <span className="hidden sm:block">Certifié par agent</span>
                <div className="p-2 bg-rose-500 rounded-full text-white">
                  <Search className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex flex-row items-center gap-3">
            <Link 
              to="/dashboard/owner" 
              className="hidden md:block text-sm font-semibold py-3 px-4 rounded-full hover:bg-slate-50 transition cursor-pointer"
            >
              Vendre ou certifier mon bien
            </Link>
            
            <div className="hidden md:flex p-3 rounded-full hover:bg-slate-50 transition cursor-pointer">
              <Globe className="w-5 h-5 text-slate-700" />
            </div>

            <div className="relative">
              <div 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-4 md:py-1.5 md:px-2 border border-slate-200 flex flex-row items-center gap-3 rounded-full cursor-pointer hover:shadow-md transition bg-white"
              >
                <Menu className="w-5 h-5 text-slate-500" />
                <div className="hidden md:block">
                  <UserCircle className="w-8 h-8 text-slate-500" />
                </div>
              </div>

              {/* Dropdown Menu */}
              {isMenuOpen && (
                <div className="absolute rounded-xl shadow-lg w-[240px] bg-white overflow-hidden right-0 top-12 text-sm border border-slate-100">
                  <div className="flex flex-col cursor-pointer">
                    <Link to="/login" className="px-4 py-3 font-semibold hover:bg-slate-50 transition">
                      Connexion
                    </Link>
                    <Link to="/register" className="px-4 py-3 hover:bg-slate-50 transition border-b border-slate-200">
                      Inscription
                    </Link>
                    <Link to="/dashboard/owner" className="px-4 py-3 hover:bg-slate-50 transition">
                      Mettre mon bien sur KivuMarket
                    </Link>
                    <Link to="/how-it-works" className="px-4 py-3 hover:bg-slate-50 transition">
                      Centre d'aide
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile Search Bar (Shows only on small screens) */}
      <div className="sm:hidden px-4 pb-4">
        <div className="flex flex-row items-center border border-slate-200 rounded-full py-2 px-4 shadow-sm">
          <Search className="w-5 h-5 text-slate-800" />
          <div className="flex flex-col ml-3">
            <div className="text-sm font-semibold">Où chercher ?</div>
            <div className="text-xs text-slate-500">Ibanda • Kadutu • Bagira</div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
