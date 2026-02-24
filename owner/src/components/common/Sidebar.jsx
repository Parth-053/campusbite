import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { LayoutDashboard, ShoppingBag, UtensilsCrossed, BarChart3, WalletCards, LogOut } from 'lucide-react';
import { logoutOwner } from '../../store/authSlice';

const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Orders', path: '/orders', icon: ShoppingBag },
  { name: 'Menu', path: '/menu', icon: UtensilsCrossed },
  { name: 'Analytics', path: '/analytics', icon: BarChart3 },
  { name: 'Transactions', path: '/transactions', icon: WalletCards },
];

const Sidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to logout securely?')) {
      await dispatch(logoutOwner());
      navigate('/login');
    }
  };

  return (
    <aside className="hidden md:flex flex-col w-64 h-screen bg-sidebar text-gray-300 shadow-xl fixed left-0 top-0 z-40">
      {/* Logo Section */}
      <div className="h-20 flex items-center justify-center border-b border-gray-800 px-6 bg-sidebar">
        <img src="/logo.png" alt="CampusBite" className="w-9 h-9 object-contain mr-3" />
        <h1 className="text-xl font-bold text-white tracking-wide">
          Campus<span className="text-primary-light">Bite</span>
        </h1>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1.5">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-primary text-white shadow-md'
                  : 'hover:bg-gray-800 hover:text-white'
              }`
            }
          >
            <item.icon size={20} />
            <span>{item.name}</span>
          </NavLink>
        ))}
      </div>

      {/* Logout Button */}
      <div className="p-4 border-t border-gray-800">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-3 text-gray-400 hover:bg-gray-800 hover:text-error rounded-lg font-medium transition-colors duration-200"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;