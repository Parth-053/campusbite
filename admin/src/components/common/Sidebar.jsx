import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, School, Coffee, Users, UserCheck, 
  ShoppingBag, BarChart3, Wallet, Settings, LogOut, X 
} from 'lucide-react';
import { useDispatch } from 'react-redux';
import { logoutAdmin } from '../../store/authSlice';

const Sidebar = ({ isOpen, closeSidebar }) => {
  const dispatch = useDispatch();

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/colleges', label: 'Colleges', icon: School },
    { path: '/canteens', label: 'Canteens', icon: Coffee },
    { path: '/users', label: 'Users', icon: Users },
    { path: '/orders', label: 'Orders', icon: ShoppingBag },
    { path: '/analytics', label: 'Analytics', icon: BarChart3 },
    { path: '/finance', label: 'Finance', icon: Wallet },
    { path: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className={`
      fixed inset-y-0 left-0 z-50 w-64 bg-secondary text-white flex flex-col 
      transform transition-transform duration-300 ease-in-out shadow-2xl lg:shadow-none
      lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}
    `}>
      <div className="h-16 flex items-center justify-between px-6 border-b border-gray-700/50">
        <h1 className="text-2xl font-bold text-primary">Campus<span className="text-white">Bite</span></h1>
        {/* Mobile Close Button */}
        <button 
          onClick={closeSidebar} 
          className="p-1.5 text-gray-400 hover:text-white rounded-md lg:hidden"
        >
          <X className="w-6 h-6" />
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1 custom-scrollbar">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={() => {
              if (window.innerWidth < 1024) closeSidebar(); // Auto-close on mobile click
            }}
            className={({ isActive }) =>
              `flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all ${
                isActive 
                  ? 'bg-primary text-white shadow-md' 
                  : 'text-gray-400 hover:bg-gray-800 hover:text-gray-100'
              }`
            }
          >
            <item.icon className={`w-5 h-5 mr-3 ${window.location.pathname === item.path ? 'text-white' : 'text-gray-400'}`} />
            {item.label}
          </NavLink>
        ))}
      </div>

      <div className="p-4 border-t border-gray-700/50">
        <button
          onClick={() => dispatch(logoutAdmin())}
          className="flex items-center w-full px-3 py-2.5 text-sm font-medium text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
        >
          <LogOut className="w-5 h-5 mr-3" />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;