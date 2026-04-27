import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, ShieldCheck, Home as HomeIcon, Map, Key, Star, Heart } from 'lucide-react';
import { motion } from 'framer-motion';

const Categories = () => {
  const categories = [
    { label: 'Terrains', icon: Map },
    { label: 'Maisons', icon: HomeIcon },
    { label: 'Certifiés', icon: ShieldCheck },
    { label: 'Appartements', icon: Key },
    { label: 'Vue Lac', icon: MapPin },
    { label: 'Luxe', icon: Star },
  ];

  const [selected, setSelected] = useState('Terrains');

  return (
    <div className="max-w-[2520px] mx-auto xl:px-20 md:px-10 sm:px-2 px-4 bg-white sticky top-20 z-40 pt-4 pb-2 border-b border-slate-100">
      <div className="flex flex-row items-center justify-between overflow-x-auto gap-8 no-scrollbar">
        {categories.map((item) => (
          <div 
            key={item.label}
            onClick={() => setSelected(item.label)}
            className={`flex flex-col items-center justify-center gap-2 p-3 border-b-2 hover:text-slate-800 transition cursor-pointer flex-shrink-0 ${
              selected === item.label 
                ? 'border-slate-800 text-slate-800' 
                : 'border-transparent text-slate-500 hover:border-slate-300'
            }`}
          >
            <item.icon className="w-6 h-6" />
            <div className="text-sm font-medium">{item.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

const PropertyCard = ({ property }: { property: any }) => {
  return (
    <Link to={`/property/${property.id}`} className="col-span-1 cursor-pointer group">
      <div className="flex flex-col gap-2 w-full">
        <div className="aspect-square w-full relative overflow-hidden rounded-xl">
          <img 
            src={property.image} 
            alt={property.titre} 
            className="object-cover h-full w-full group-hover:scale-105 transition duration-300"
          />
          <div className="absolute top-3 right-3 text-white">
            <Heart className="w-6 h-6 hover:fill-rose-500 transition active:scale-95" />
          </div>
          {property.certified && (
            <div className="absolute top-3 left-3 bg-white/90 px-2 py-1 rounded-md shadow-sm flex items-center gap-1 text-xs font-bold text-slate-800">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Certifié
            </div>
          )}
        </div>
        
        <div className="font-semibold text-slate-900 text-lg mt-1 flex justify-between items-start">
          <span>{property.quartier}, {property.commune}</span>
          <div className="flex items-center gap-1 font-normal">
            <Star className="w-4 h-4 fill-slate-900" />
            <span>4.9</span>
          </div>
        </div>
        
        <div className="font-light text-slate-500">
          Vendeur: {property.vendeur}
        </div>
        <div className="font-light text-slate-500">
          Superficie: {property.superficie} m²
        </div>
        
        <div className="flex flex-row items-center gap-1 mt-1">
          <div className="font-semibold text-slate-900">${property.prix}</div>
          <div className="font-light text-slate-500">total</div>
        </div>
      </div>
    </Link>
  );
};

const Home = () => {
  // Mock Data mimicking Airbnb's card structure
  const properties = [
    {
      id: 1,
      titre: "Parcelle résidentielle",
      quartier: "Muhumba",
      commune: "Ibanda",
      vendeur: "Jean Dupont",
      superficie: "400",
      prix: "50,000",
      certified: true,
      image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80"
    },
    {
      id: 2,
      titre: "Villa de Luxe",
      quartier: "Labotte",
      commune: "Ibanda",
      vendeur: "Marie Claire",
      superficie: "800",
      prix: "120,000",
      certified: true,
      image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80"
    },
    {
      id: 3,
      titre: "Terrain Vue Lac",
      quartier: "Nguba",
      commune: "Ibanda",
      vendeur: "Paul K.",
      superficie: "500",
      prix: "65,000",
      certified: false,
      image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80"
    },
    {
      id: 4,
      titre: "Maison de campagne",
      quartier: "Panzi",
      commune: "Ibanda",
      vendeur: "Aline M.",
      superficie: "350",
      prix: "25,000",
      certified: true,
      image: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&q=80"
    }
  ];

  return (
    <div className="pb-20">
      <Categories />
      
      <div className="max-w-[2520px] mx-auto xl:px-20 md:px-10 sm:px-2 px-4 mt-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8">
          {properties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
