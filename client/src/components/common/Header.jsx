import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { User, UtensilsCrossed } from 'lucide-react';
import Skeleton from './Skeleton';

const Header = () => {
  const { user, isLoading } = useSelector((state) => state.auth);

  return (
    <header className="bg-white px-4 py-3 shadow-sm sticky top-0 z-40 flex justify-between items-center w-full">
      
      {/* Left Side: Profile Icon & User Name (Clickable to go to Profile) */}
      <Link to="/profile" className="flex items-center gap-3 overflow-hidden pr-4 hover:opacity-80 transition-opacity">
        <div className="w-10 h-10 bg-primary/10 text-primary rounded-full flex items-center justify-center shrink-0 border border-primary/20">
          <User size={20} />
        </div>
        
        {isLoading ? (
          <Skeleton className="h-5 w-32 sm:w-40" />
        ) : (
          <div className="flex flex-col min-w-0">
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Welcome back,</span>
            <h1 className="text-sm sm:text-base font-bold text-gray-900 truncate">
              {user?.name || 'Student'}
            </h1>
          </div>
        )}
      </Link>

      {/* Right Side: App Logo */}
      <div className="flex items-center gap-2 shrink-0">
         <div className="p-2 bg-primary text-white rounded-lg shadow-sm">
            <UtensilsCrossed size={18} />
         </div>
      </div>

    </header>
  );
};

export default Header;