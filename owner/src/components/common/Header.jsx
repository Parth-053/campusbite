import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Bell, WalletCards } from 'lucide-react';
import Skeleton from './Skeleton';

const Header = () => {
  const navigate = useNavigate();
  const { isLoading: authLoading } = useSelector((state) => state.auth);
  const { canteen, isLoading: canteenLoading } = useSelector((state) => state.canteen);

  const isLoading = authLoading || canteenLoading;

  return (
    <header className="h-20 bg-surface border-b border-borderCol shadow-sm fixed top-0 right-0 w-full md:w-[calc(100%-16rem)] z-30 flex items-center justify-between px-4 md:px-8">
      
      {/* Left Side: Mobile Logo & Title */}
      <div className="flex items-center gap-3 md:gap-0 w-[70%] md:w-full">
        
        {/* Mobile ONLY Logo */}
        <div className="md:hidden flex items-center shrink-0 ml-0">
          <img src="/logo.png" alt="Logo" className="w-20 h-20 object-contain" />
        </div>
        
        {/* Canteen Name with Smart Truncation */}
        <div className="flex-1 min-w-0">
          {isLoading ? (
            <Skeleton className="h-6 w-32 md:w-48" />
          ) : (
            <h2 
              className="text-lg md:text-2xl font-bold text-textDark truncate" 
              title={canteen?.name || 'My Business'}
            >
              {canteen?.name || 'My Business'}
            </h2>
          )}
        </div>
      </div>

      {/* Right Side: Transactions & Notifications */} 
      <div className="flex md:hidden items-center gap-2 shrink-0">
        
        {/* Transactions / Wallet (Mobile Only) */}
        <button 
          onClick={() => navigate('/transactions')}
          className="relative p-2.5 text-textLight hover:text-primary hover:bg-background rounded-full transition-colors group"
          title="Transactions"
        >
          <WalletCards size={22} className="group-hover:scale-110 transition-transform duration-200" />
        </button>

        {/* Notifications (Mobile Only) */}
        <button 
          onClick={() => navigate('/notifications')}
          className="relative p-2.5 text-textLight hover:text-primary hover:bg-background rounded-full transition-colors group"
          title="Notifications"
        >
          <Bell size={22} className="group-hover:scale-110 transition-transform duration-200" />
          <span className="absolute top-2 right-2.5 w-2.5 h-2.5 bg-alert rounded-full border-2 border-surface"></span>
        </button>
        
      </div>
    </header>
  );
};

export default Header;