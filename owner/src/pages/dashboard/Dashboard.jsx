import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchDashboardData, toggleCanteenStatus, setOptimisticStatus } from '../../store/dashboardSlice';
import Skeleton from '../../components/common/Skeleton';
import { DollarSign, ShoppingBag, Clock, CheckCircle, Store, ChevronRight, PowerOff } from 'lucide-react';
import toast from 'react-hot-toast';

const StatCard = ({ title, value, icon, colorClass, loading }) => {
  if (loading) return <Skeleton className="h-24 sm:h-32 w-full rounded-2xl" />;
  const textColor = colorClass.split(' ').find(c => c.startsWith('text-'));

  return (
    <div className="relative overflow-hidden bg-surface p-4 sm:p-6 rounded-2xl border border-borderCol shadow-sm hover:shadow-md transition-all duration-300 group">
      <div className="relative z-10">
        <p className="text-textLight text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-1 sm:mb-2 truncate">{title}</p>
        <h3 className="text-xl sm:text-3xl font-black text-textDark truncate">{value}</h3>
      </div>
      <div className={`absolute -bottom-3 -right-3 sm:-bottom-5 sm:-right-5 w-20 h-20 sm:w-28 sm:h-28 opacity-[0.12] transform group-hover:scale-110 group-hover:-rotate-12 transition-all duration-500 ease-out flex items-center justify-center ${textColor}`}>
        {React.cloneElement(icon, { size: '100%', strokeWidth: 2 })}
      </div>
    </div>
  );
};

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { isOpen, stats, recentOrders, revenueTrend, isLoading } = useSelector(state => state.dashboard);

  useEffect(() => {
    dispatch(fetchDashboardData());
    const intervalId = setInterval(() => { dispatch(fetchDashboardData()); }, 30000); 
    return () => clearInterval(intervalId);
  }, [dispatch]);
 
  const handleToggleStatus = async () => {
    const currentStatus = isOpen;
    const newStatus = !currentStatus;
     
    const actionText = newStatus ? "OPEN" : "CLOSE";
    const isConfirmed = window.confirm(`Are you sure you want to ${actionText} the canteen?`);
     
    if (!isConfirmed) return;
 
    dispatch(setOptimisticStatus(newStatus));

    try { 
      await dispatch(toggleCanteenStatus()).unwrap();
      toast.success(`Canteen is now ${newStatus ? 'OPEN' : 'CLOSED'}`);
    } catch {
      dispatch(setOptimisticStatus(currentStatus));
      toast.error("Failed to update status. Please try again.");
    }
  };

  const maxRevenue = revenueTrend.length > 0 ? Math.max(...revenueTrend.map(d => d.value)) : 100;

  return (
    <div className="space-y-6 pb-20 md:pb-0 animate-in fade-in duration-300">
      
      {/* 1. HERO TOGGLE BUTTON */}
      <button
        onClick={handleToggleStatus}
        disabled={isLoading && stats.totalOrders === 0} 
        className={`w-full relative overflow-hidden rounded-2xl p-5 sm:p-6 md:p-8 text-left transition-all duration-300 shadow-sm border
          ${isOpen ? 'bg-success/10 border-success/30 text-success' : 'bg-background border-borderCol text-textLight hover:bg-borderCol/50'}
        `}
      >
        <div className="flex items-center justify-between relative z-10 gap-3">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className={`p-3 sm:p-4 rounded-full shrink-0 ${isOpen ? 'bg-success text-white shadow-md' : 'bg-surface border border-borderCol text-textLight'}`}>
              <Store className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-textDark tracking-tight">
                {isOpen ? 'Opened Canteen' : 'Closed Canteen'}
              </h2>
              <p className={`text-xs sm:text-sm font-medium mt-0.5 sm:mt-1 ${isOpen ? 'text-success' : 'text-textLight'}`}>
                {isOpen ? 'Your canteen is live and visible to customers.' : 'Click to go online and receive orders.'}
              </p>
            </div>
          </div>
          
          <div className={`shrink-0 w-12 h-7 sm:w-14 sm:h-8 rounded-full flex items-center p-1 transition-colors duration-300 ${isOpen ? 'bg-success' : 'bg-borderCol'}`}>
            <div className={`w-5 h-5 sm:w-6 sm:h-6 bg-white rounded-full shadow-md transform transition-transform duration-300 ${isOpen ? 'translate-x-5 sm:translate-x-6' : 'translate-x-0'}`}></div>
          </div>
        </div>
      </button>

      {/* 2. STATS GRID */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
        <StatCard title="Revenue" value={`₹${stats?.totalRevenue || 0}`} icon={<DollarSign />} colorClass="bg-success/10 text-success" loading={isLoading} />
        <StatCard title="Total" value={stats?.totalOrders || 0} icon={<ShoppingBag />} colorClass="bg-primary/10 text-primary" loading={isLoading} />
        <StatCard title="Pending" value={stats?.pendingOrders || 0} icon={<Clock />} colorClass="bg-alert/10 text-alert" loading={isLoading} />
        <StatCard title="Completed" value={stats?.completedOrders || 0} icon={<CheckCircle />} colorClass="bg-primary/10 text-primary-dark" loading={isLoading} />
      </div>

      {/* 3. LATEST ORDERS & REVENUE TREND */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Latest Orders */}
        <div className="bg-surface border border-borderCol rounded-2xl shadow-sm p-5 sm:p-6 flex flex-col h-full">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-textDark">Recent Orders</h3>
              {isOpen && (
                <span className="relative flex h-2.5 w-2.5 ml-1">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-success"></span>
                </span>
              )}
            </div>
            <button onClick={() => navigate('/orders')} className="text-sm font-bold text-primary hover:text-primary-dark flex items-center transition-colors">
              View All <ChevronRight size={16} />
            </button>
          </div>

          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => <Skeleton key={i} className="w-full h-16" />)}
            </div>
          ) : recentOrders?.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-textLight min-h-[200px]">
              <ShoppingBag size={40} className="mb-3 opacity-20" />
              <p className="font-medium">No recent orders yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentOrders.map((order) => (
                <div key={order._id} className="flex items-center justify-between p-3.5 sm:p-4 bg-background rounded-xl border border-borderCol/50 hover:border-borderCol transition-colors">
                  <div>
                    <p className="font-bold text-textDark text-sm">Order #{order._id.slice(-6).toUpperCase()}</p>
                    <p className="text-xs text-textLight mt-1">{order.items?.length || 0} items • ₹{order.totalAmount}</p>
                  </div>
                  <span className={`px-2.5 sm:px-3 py-1 text-[10px] sm:text-xs font-bold rounded-full 
                    ${order.status === 'Pending' ? 'bg-alert/10 text-alert' : 
                      order.status === 'Preparing' ? 'bg-warning/20 text-yellow-700' :
                      order.status === 'Completed' ? 'bg-success/10 text-success' : 
                      'bg-error/10 text-error'}`}
                  >
                    {order.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Live Hourly Revenue Trend Chart */}
        <div className="bg-surface border border-borderCol rounded-2xl shadow-sm p-5 sm:p-6 flex flex-col h-[350px]">
          <div className="flex items-center gap-2 mb-6">
            <h3 className="text-lg font-bold text-textDark">Today's Live Revenue</h3>
            {isOpen && <span className="text-xs font-bold bg-success/10 text-success px-2 py-0.5 rounded-md">LIVE</span>}
          </div>
          
          {isLoading ? (
            <div className="flex-1 flex items-end justify-between gap-3 pt-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="w-full rounded-t-md" style={{ height: `${(i % 3 + 2) * 20}%` }} />
              ))}
            </div>
          ) : !isOpen ? (
            <div className="flex-1 flex flex-col items-center justify-center text-textLight">
              <PowerOff size={40} className="mb-3 opacity-20" />
              <p className="font-medium text-center">Business Offline.<br/>Go online to track live revenue.</p>
            </div>
          ) : revenueTrend?.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-textLight">
              <p className="font-medium">Waiting for new orders...</p>
            </div>
          ) : (
            <div className="flex-1 flex items-end justify-around gap-2 md:gap-4 pt-4">
              {revenueTrend.map((point, index) => {
                const heightPercent = maxRevenue > 0 ? (point.value / maxRevenue) * 100 : 0;
                const isCurrentHour = index === revenueTrend.length - 1;

                return (
                  <div key={index} className="w-full max-w-[40px] flex flex-col items-center gap-3 group relative">
                    <span className="absolute -top-10 bg-sidebar text-white text-xs font-bold px-2.5 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity z-10 whitespace-nowrap pointer-events-none">
                      ₹{point.value}
                    </span>
                    <div className="w-full h-full flex items-end justify-center">
                      <div className={`w-full rounded-t-md transition-all duration-500 
                        ${isCurrentHour ? 'bg-primary' : 'bg-primary/20 group-hover:bg-primary/50'}`} 
                        style={{ height: `${Math.max(heightPercent, 2)}%` }}>
                      </div>
                    </div>
                    <span className={`text-[10px] sm:text-xs font-semibold ${isCurrentHour ? 'text-primary' : 'text-textLight'}`}>
                      {point.time}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Dashboard;