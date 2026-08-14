import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, 
  CheckCircle2, 
  AlertCircle, 
  Info, 
  Clock, 
  Trash2, 
  Check,
  MailOpen,
  MessageSquare,
  Search
} from 'lucide-react';
import Sidebar from '../components/Sidebar';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, unread
  const API_URL = 'http://localhost:5000/api';

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_URL}/notifications`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(res.data.data || []);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/notifications/${id}/read`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(notifications.map(n => n.id === id ? { ...n, is_read: 1 } : n));
    } catch (err) {
      console.error(err);
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'success': return <CheckCircle2 className="text-emerald-400" size={20} />;
      case 'danger': return <AlertCircle className="text-rose-400" size={20} />;
      case 'warning': return <AlertCircle className="text-amber-400" size={20} />;
      default: return <Info className="text-blue-400" size={20} />;
    }
  };

  const getTypeStyles = (type) => {
    switch (type) {
      case 'success': return 'border-emerald-500/20 bg-emerald-50/50 dark:bg-emerald-500/5';
      case 'danger': return 'border-rose-500/20 bg-rose-50/50 dark:bg-rose-500/5';
      case 'warning': return 'border-amber-500/20 bg-amber-50/50 dark:bg-amber-500/5';
      default: return 'border-blue-500/20 bg-blue-50/50 dark:bg-blue-500/5';
    }
  };

  const filteredNotifications = filter === 'unread' 
    ? notifications.filter(n => !n.is_read)
    : notifications;

  return (
    <div className="flex min-h-screen bg-slate-100 dark:bg-[#05070C] text-slate-900 dark:text-slate-100 font-sans transition-colors duration-300 overflow-hidden">
      <Sidebar />
      
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header Section */}
        <header className="p-8 border-b border-slate-200 dark:border-white/5 bg-white/80 dark:bg-secondary/30 backdrop-blur-md">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 max-w-5xl mx-auto">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <Bell size={24} />
                </div>
                <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">Mes Messages</h1>
              </div>
              <p className="text-slate-600 dark:text-slate-400 text-sm">Consultez vos notifications et le suivi de vos activités foncières.</p>
            </div>

            <div className="flex items-center gap-2 p-1 bg-slate-200/50 dark:bg-white/5 rounded-xl border border-slate-300 dark:border-white/10">
              <button 
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                  filter === 'all' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                }`}
              >
                Tout voir
              </button>
              <button 
                onClick={() => setFilter('unread')}
                className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                  filter === 'unread' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                }`}
              >
                Non lus ({notifications.filter(n => !n.is_read).length})
              </button>
            </div>
          </div>
        </header>

        {/* Content Section */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <div className="max-w-5xl mx-auto space-y-4">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : filteredNotifications.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-32 bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 rounded-3xl shadow-sm"
              >
                <div className="w-20 h-20 bg-slate-200 dark:bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <MailOpen size={40} className="text-slate-600 dark:text-slate-500" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Aucun message pour l'instant</h3>
                <p className="text-slate-500 dark:text-slate-400 max-w-xs mx-auto text-sm">
                  Dès que votre bien sera validé ou qu'un agent effectuera une action, vous recevrez une notification ici.
                </p>
              </motion.div>
            ) : (
              <div className="space-y-4">
                <AnimatePresence mode="popLayout">
                  {filteredNotifications.map((notif) => (
                    <motion.div
                      key={notif.id}
                      layout
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className={`relative group border rounded-2xl p-6 transition-all duration-300 ${
                        getTypeStyles(notif.type)
                      } ${!notif.is_read ? 'shadow-lg dark:shadow-black/20 ring-1 ring-slate-200 dark:ring-white/10' : 'opacity-60'}`}
                    >
                      <div className="flex gap-4">
                        <div className="mt-1">
                          {getTypeIcon(notif.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-4 mb-1">
                            <h4 className={`font-bold text-lg leading-tight ${!notif.is_read ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}>
                              {notif.title}
                            </h4>
                            {!notif.is_read && (
                              <button 
                                onClick={() => markAsRead(notif.id)}
                                className="opacity-0 group-hover:opacity-100 p-2 bg-slate-200/50 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 rounded-lg transition-all text-emerald-600 dark:text-emerald-400"
                                title="Marquer comme lu"
                              >
                                <Check size={16} />
                              </button>
                            )}
                          </div>
                          <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-4">
                            {notif.message}
                          </p>
                          <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                            <span className="flex items-center gap-1.5">
                              <Clock size={12} />
                              {new Date(notif.created_at).toLocaleDateString('fr-FR', {
                                day: 'numeric',
                                month: 'short',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                            {!notif.is_read && (
                              <span className="flex items-center gap-1.5 text-primary">
                                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                                Nouveau
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Notifications;
