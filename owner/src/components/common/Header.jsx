import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Bell, User } from 'lucide-react';
import Skeleton from './Skeleton';

const Header = () => {
  const navigate = useNavigate();
  const { owner, isLoading: authLoading } = useSelector((state) => state.auth);
  const { canteen, isLoading: canteenLoading } = useSelector((state) => state.canteen);

  const isLoading = authLoading || canteenLoading;

  return (
    <header className="h-20 bg-surface border-b border-borderCol shadow-sm fixed top-0 w-full md:w-[calc(100%-16rem)] md:ml-64 z-30 flex items-center justify-between px-4 md:px-8">
      
      {/* Left Side: Mobile Logo & Title */}
      <div className="flex items-center gap-4">
        <div className="md:hidden flex items-center">
          <img src="/logo.png" alt="Logo" className="w-10 h-10 object-contain" />
        </div>
        
        <div>
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-5 w-32 md:w-48" />
              <Skeleton className="h-3 w-20 md:w-32" />
            </div>
          ) : (
            <>
              <h2 className="text-lg md:text-xl font-bold text-textDark leading-tight">
                {canteen?.name || 'My Business'}
              </h2>
              <p className="text-xs md:text-sm text-textLight font-medium">
                Welcome back, <span className="text-primary font-bold">{owner?.name || 'Owner'}</span>
              </p>
            </>
          )}
        </div>
      </div>

      {/* Right Side: Actions */}
      <div className="flex items-center gap-3 md:gap-5">
        <button 
          onClick={() => navigate('/notifications')}
          className="relative p-2.5 text-textLight hover:text-primary hover:bg-background rounded-full transition-colors"
        >
          <Bell size={20} />
          {/* Active Notification */}
          <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-alert rounded-full border-2 border-surface"></span>
        </button>

        <div className="h-8 w-px bg-borderCol hidden md:block"></div>

        <button 
          onClick={() => navigate('/profile')}
          className="flex items-center gap-2 p-1 pr-3 rounded-full hover:bg-background transition-colors border border-transparent hover:border-borderCol group"
        >
          {isLoading ? (
            <Skeleton circle className="w-10 h-10" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center shadow-sm">
              <User size={18} />
            </div>
          )}
        </button>
      </div>
    </header>
  );
};

export default Header;