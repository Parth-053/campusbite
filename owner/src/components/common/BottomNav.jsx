import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, ShoppingBag, UtensilsCrossed, BarChart3 } from 'lucide-react';

const BottomNav = () => {
  const links = [
    { name: 'Home', path: '/dashboard', icon: <LayoutDashboard size={24} /> },
    { name: 'Orders', path: '/orders', icon: <ShoppingBag size={24} /> },
    { name: 'Menu', path: '/menu', icon: <UtensilsCrossed size={24} /> },
    { name: 'Reports', path: '/analytics', icon: <BarChart3 size={24} /> },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 h-16 flex items-center justify-around z-40 md:hidden shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
      {links.map((link) => (
        <NavLink
          key={link.path}
          to={link.path}
          className={({ isActive }) =>
            `flex flex-col items-center justify-center w-full h-full space-y-1 ${
              isActive ? 'text-primary' : 'text-slate-400 hover:text-slate-600'
            }`
          }
        >
          {link.icon}
          <span className="text-[10px] font-medium">{link.name}</span>
        </NavLink>
      ))}
    </div>
  );
};

export default BottomNav;