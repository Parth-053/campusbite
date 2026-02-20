import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'; 
import { Bell, Wallet } from 'lucide-react';
import Skeleton from './Skeleton';

const Header = () => {
  const { user, isLoading } = useSelector(state => state.auth);
  const { canteen } = useSelector(state => state.canteen);
  const { unreadCount } = useSelector(state => state.notification);
  
  const navigate = useNavigate(); 

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-20 w-full">
      <div className="flex items-center gap-4">
        {isLoading ? (
           <Skeleton className="w-32 h-6" />
        ) : (
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${canteen.status === 'Open' ? 'bg-success' : 'bg-danger'}`}></div>
            <span className="font-medium text-slate-600 text-sm md:text-base">
              {canteen.canteenName}
            </span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 md:gap-6">
        {/* Wallet Button - Now visible on mobile */}
        <button 
          onClick={() => navigate('/transactions')} 
          className="p-2 text-slate-500 hover:bg-slate-50 rounded-full transition-colors"
        >
          <Wallet size={20} />
        </button>

        {/* Notification Button */}
        <button 
          onClick={() => navigate('/notifications')} 
          className="relative p-2 text-slate-500 hover:bg-slate-50 rounded-full transition-colors"
        >
          <Bell size={20} />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 bg-danger rounded-full animate-pulse ring-2 ring-white"></span>
          )}
        </button>

        {/* Profile Button */}
        <button 
          onClick={() => navigate('/profile')} 
          className="flex items-center gap-3 hover:opacity-80 transition-opacity ml-1"
        >
          {isLoading ? (
            <Skeleton className="w-10 h-10 rounded-full" />
          ) : (
            <div className="w-10 h-10 bg-primary/10 text-primary rounded-full flex items-center justify-center font-bold text-lg border border-primary/20 overflow-hidden">
               {user?.image ? (
                 <img src={user.image} alt="User" className="w-full h-full object-cover" />
               ) : (
                 user?.name?.charAt(0)
               )}
            </div>
          )}
        </button>
      </div>
    </header>
  );
};

export default Header;