import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'; 
import { Bell, Wallet } from 'lucide-react';
import Skeleton from './Skeleton';

const Header = () => {
  // 🚀 FIXED: Fetch combined owner and canteen data from authSlice
  const { ownerData, isLoading } = useSelector(state => state.auth);
  
  // Safely extract notification count (fallback to 0 if not loaded)
  const notificationState = useSelector(state => state.notification) || {};
  const unreadCount = notificationState.unreadCount || 0;
  
  const navigate = useNavigate(); 

  // Safely extract Canteen Name and Owner's Initials
  const canteen = ownerData?.canteen || {};
  const ownerName = ownerData?.name || 'Owner';
  const initial = ownerName.charAt(0).toUpperCase();

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-20 w-full">
      <div className="flex items-center gap-4">
        {isLoading ? (
           <Skeleton className="w-32 h-6" />
        ) : (
          <div className="flex items-center gap-3">
            {/* 🚀 FIXED: Use Canteen's status to show Green/Red dot */}
            <div className={`w-3 h-3 rounded-full ${canteen.isActive ? 'bg-green-500' : 'bg-red-500'} shadow-sm`}></div>
            <span className="font-bold text-slate-700 text-sm md:text-base tracking-wide">
              {canteen.name || 'My Canteen'}
            </span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 md:gap-6">
        {/* Wallet Button */}
        <button 
          onClick={() => navigate('/transactions')} 
          className="p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors"
        >
          <Wallet size={20} />
        </button>

        {/* Notification Button */}
        <button 
          onClick={() => navigate('/notifications')} 
          className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors"
        >
          <Bell size={20} />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse border-2 border-white"></span>
          )}
        </button>

        {/* Profile Button - 🚀 FIXED: Only shows starting letter with nice styling */}
        <button 
          onClick={() => navigate('/profile')} 
          className="flex items-center gap-3 hover:opacity-80 transition-opacity ml-1"
        >
          {isLoading ? (
            <Skeleton className="w-10 h-10 rounded-full" />
          ) : (
            <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-black text-lg border-2 border-blue-200 overflow-hidden shadow-sm">
               {initial}
            </div>
          )}
        </button>
      </div>
    </header>
  );
};

export default Header;