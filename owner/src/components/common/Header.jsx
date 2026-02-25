import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { Bell, WalletCards, User, Calendar, PowerOff, ArrowLeft } from 'lucide-react';
import Skeleton from './Skeleton';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;

  const { canteen, isLoading} = useSelector((state) => state.canteen);
  const { isOpen } = useSelector((state) => state.dashboard);


  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });

  const businessName = canteen?.canteenName || canteen?.name || 'My Business';
 
  const isDashboard = path === '/dashboard' || path === '/';
  const hideRightIconsMobile = path.includes('/transactions') || path.includes('/notifications');

  const getPageTitle = () => {
    if (path.includes('/orders')) return 'Orders';
    if (path.includes('/menu')) return 'Menu Management';
    if (path.includes('/analytics')) return 'Analytics';
    if (path.includes('/profile')) return 'Profile';
    if (path.includes('/transactions')) return 'Transactions';
    if (path.includes('/notifications')) return 'Notifications';
    return businessName;
  };

  return (
    <header className="h-20 bg-surface border-b border-borderCol shadow-sm fixed top-0 right-0 w-full md:w-[calc(100%-16rem)] z-30 flex items-center justify-between px-4 md:px-8">
      
      <div className="flex items-center gap-3 md:gap-0 w-[60%] sm:w-[70%] md:w-auto">
         
        <div className="md:hidden flex items-center shrink-0">
          {isDashboard ? (
            <img src="/logo.png" alt="Logo" className="w-10 h-10 object-contain" />
          ) : (
            <button 
              onClick={() => navigate(-1)} 
              className="p-2 -ml-2 text-textDark hover:bg-background rounded-full transition-colors"
            >
              <ArrowLeft size={24} />
            </button>
          )}
        </div>
        
        <div className="flex-1 min-w-0 md:ml-0 ml-1">
          {isLoading ? (
            <>
              <Skeleton className="h-6 w-32 md:w-48 mb-1" />
              <Skeleton className="h-3 w-20 md:w-32 hidden md:block" />
            </>
          ) : (
            <> 
              <div className="hidden md:block">
                <h2 className="text-xl font-bold text-textDark truncate leading-tight" title={businessName}>
                  {businessName}
                </h2>
              </div>
 
              <div className="md:hidden">
                <h2 className="text-lg sm:text-xl font-bold text-textDark truncate leading-tight">
                  {isDashboard ? businessName : getPageTitle()}
                </h2>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        
        {/* DESKTOP EXTRAS (Always visible on Laptop) */}
        <div className="hidden md:flex items-center gap-4 mr-2">
          
          <div className="flex items-center gap-2 px-3 py-1.5 bg-background border border-borderCol rounded-lg text-sm text-textLight font-medium cursor-default">
            <Calendar size={16} className="text-primary" />
            {today}
          </div>

          {isOpen ? (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-success/10 border border-success/20 rounded-lg text-sm text-success font-bold cursor-default transition-all">
              <div className="w-2 h-2 rounded-full bg-success animate-ping"></div>
              Opened
            </div>
          ) : (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-background border border-borderCol rounded-lg text-sm text-textLight font-bold cursor-default transition-all">
              <PowerOff size={14} />
              Closed
            </div>
          )}

          <div className="h-8 w-px bg-borderCol mx-1"></div>

          <button onClick={() => navigate('/profile')} className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-white transition-colors border border-primary/20 shadow-sm" title="My Profile">
            <User size={18} />
          </button>
        </div>

        {/* 📱 MOBILE ONLY ICONS */} 
        {!hideRightIconsMobile && (
          <div className="flex md:hidden items-center gap-2">
            <button onClick={() => navigate('/transactions')} className="relative p-2.5 text-textLight hover:text-primary hover:bg-background rounded-full transition-colors group">
              <WalletCards size={22} className="group-hover:scale-110 transition-transform duration-200" />
            </button>

            <button onClick={() => navigate('/notifications')} className="relative p-2.5 text-textLight hover:text-primary hover:bg-background rounded-full transition-colors group">
              <Bell size={22} className="group-hover:scale-110 transition-transform duration-200" />
              <span className="absolute top-2 right-2.5 w-2.5 h-2.5 bg-alert rounded-full border-2 border-surface"></span>
            </button>
          </div>
        )}

      </div>
    </header>
  );
};

export default Header;