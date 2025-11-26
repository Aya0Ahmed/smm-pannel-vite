import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, PlusCircle, List, Wallet, LogOut, Zap, Shield, MessageSquare } from 'lucide-react';
import { LanguageContext, AuthContext } from '../App';

const Sidebar: React.FC = () => {
  const location = useLocation();
  const { t } = useContext(LanguageContext);
  const { user, logout } = useContext(AuthContext);

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: '/dashboard', name: t('dashboard'), icon: LayoutDashboard },
    { path: '/new-order', name: t('newOrder'), icon: PlusCircle },
    { path: '/services', name: t('services'), icon: List },
    { path: '/most-ordered', name: t('mostOrderedServices'), icon: Zap }, 
    { path: '/add-funds', name: t('addFunds'), icon: Wallet },
    { path: '/tickets', name: t('tickets'), icon: MessageSquare },
  ];

  // Add Admin Panel link if user is admin
  if (user?.role === 'admin') {
    navItems.push({ path: '/admin', name: t('adminPanel'), icon: Shield });
  }

  return (
    <aside className="w-64 hidden md:flex flex-col h-screen bg-card border-r border-slate-800 sticky top-0 rtl:border-l rtl:border-r-0">
      <div className="p-6 flex items-center gap-2 border-b border-slate-800">
        <Zap className="text-primary" size={28} fill="currentColor" />
        <h1 className="text-2xl font-bold tracking-tight text-white">ATL3 TREND</h1>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
              isActive(item.path)
                ? 'bg-primary/10 text-primary border-l-4 rtl:border-l-0 rtl:border-r-4 border-primary font-medium'
                : 'text-gray-400 hover:bg-slate-800 hover:text-gray-100'
            }`}
          >
            <item.icon size={20} />
            {item.name}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <button 
          onClick={logout}
          className="flex items-center gap-3 w-full px-4 py-3 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
        >
          <LogOut size={20} />
          {t('logout')}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;