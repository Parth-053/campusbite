import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { LayoutDashboard, ShoppingBag, UtensilsCrossed, BarChart3, MonitorPlay } from 'lucide-react';
import Skeleton from './Skeleton';

const Sidebar = () => {
  const { isLoading } = useSelector(state => state.auth);

  const links = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Live Orders', path: '/orders', icon: <ShoppingBag size={20} /> },
    { name: 'Menu Items', path: '/menu', icon: <UtensilsCrossed size={20} /> },
    { name: 'Analytics', path: '/analytics', icon: <BarChart3 size={20} /> }
  ];

  // Helper to render skeleton links
  const SkeletonLink = () => (
    <div className="flex items-center gap-3 px-4 py-3 rounded-lg">
      <Skeleton className="w-5 h-5 rounded" />
      <Skeleton className="w-24 h-4 rounded" />
    </div>
  );

  return (
    <aside className="hidden md:flex flex-col fixed top-0 left-0 z-40 h-screen w-64 bg-white border-r border-slate-200">
      <div className="flex items-center justify-center h-16 border-b border-slate-100">
        <h1 className="text-2xl font-bold text-primary tracking-tight">
          Canteen<span className="text-slate-800">Admin</span>
        </h1>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {isLoading ? (
          // Loading Skeleton State
          Array(5).fill(0).map((_, i) => <SkeletonLink key={i} />)
        ) : (
          // Actual Links
          links.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive 
                    ? 'bg-primary/10 text-primary font-semibold shadow-sm' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`
              }
            >
              {link.icon}
              <span>{link.name}</span>
            </NavLink>
          ))
        )}
      </nav>

      {/* Footer / Version info could go here */}
      <div className="p-4 border-t border-slate-100">
        <p className="text-xs text-center text-slate-400">v1.0.0 Owner Dashboard</p>
      </div>
    </aside>
  );
};

export default Sidebar;