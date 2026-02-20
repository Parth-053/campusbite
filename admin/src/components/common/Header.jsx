import React from 'react';
import { Bell, User, Menu } from 'lucide-react';
import { useSelector } from 'react-redux';
import Skeleton from './Skeleton';

const Header = ({ toggleSidebar }) => {
  const { admin, isLoading } = useSelector((state) => state.auth);

  return (
    <header className="bg-white h-16 flex items-center justify-between px-4 lg:px-6 border-b border-gray-200 sticky top-0 z-20">
      <div className="flex items-center gap-3">
        {/* Mobile Sidebar Toggle Button */}
        <button 
          onClick={toggleSidebar}
          className="p-2 -ml-2 text-gray-500 hover:bg-gray-100 rounded-lg lg:hidden transition-colors"
          aria-label="Toggle Sidebar"
        >
          <Menu className="w-6 h-6" />
        </button>
        <h2 className="text-xl font-bold text-gray-800 hidden sm:block">Campus Admin</h2>
      </div>

      <div className="flex items-center space-x-3 sm:space-x-4">
        <button className="p-2 text-gray-400 hover:text-primary hover:bg-gray-50 rounded-full transition-colors relative">
          <Bell className="w-5 h-5 sm:w-6 sm:h-6" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
        
        <div className="flex items-center space-x-2 pl-2 sm:pl-4 sm:border-l border-gray-200">
          {isLoading ? (
            <Skeleton className="w-8 h-8 rounded-full" />
          ) : (
            <div className="w-8 h-8 sm:w-9 sm:h-9 bg-indigo-100 rounded-full flex items-center justify-center text-primary font-bold border border-indigo-200">
              <User className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          )}
          <span className="text-sm font-medium text-gray-700 hidden sm:block">
            {isLoading ? <Skeleton className="w-32 h-4" /> : admin?.email || 'Admin'}
          </span>
        </div>
      </div>
    </header>
  );
};

export default Header;