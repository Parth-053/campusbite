import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchDashboardData } from '../../store/dashboardSlice';
import { updateProfileData } from '../../store/profileSlice';  
import Skeleton from '../../components/common/Skeleton';
import { DollarSign, ShoppingBag, Clock, CheckCircle, Power, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

// StatCard Component
const StatCard = ({ title, value, icon, color, loading }) => {
  if (loading) {
    return <Skeleton className="h-32 w-full rounded-xl" />;
  }
  return (
    <div className="card flex items-center gap-4 hover:-translate-y-1 transition-transform duration-200">
      <div className={`p-4 rounded-full ${color} bg-opacity-10 text-${color.split('-')[1]}-600`}>
        {icon}
      </div>
      <div>
        <p className="text-slate-500 text-sm font-medium">{title}</p>
        <h3 className="text-2xl font-bold text-slate-800 mt-1">{value}</h3>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const dispatch = useDispatch();
  
  // Selectors
  const { ownerData } = useSelector(state => state.auth);
  const { stats, revenueTrend, topItems, isLoading } = useSelector(state => state.dashboard);
  
  // Local state to manage toggle loading to prevent double-clicks
  const [isToggling, setIsToggling] = useState(false);

  useEffect(() => {
    dispatch(fetchDashboardData());
  }, [dispatch]);
 
  const handleToggleStatus = async () => {
    if (!ownerData?.canteen) return;
    setIsToggling(true);
    
    const currentStatus = ownerData.canteen.isOpen ?? true;
    const newStatus = !currentStatus;

    try { 
      await dispatch(updateProfileData({ isOpen: newStatus })).unwrap();
      toast.success(`Canteen is now ${newStatus ? 'OPEN' : 'CLOSED'}`);
    } catch {
      toast.error("Failed to update status");
    } finally {
      setIsToggling(false);
    }
  };

  const isCanteenOpen = ownerData?.canteen?.isOpen ?? true;

  return (
    <div className="space-y-6 pb-20 md:pb-0">
      
      {/* Top Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-200">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Dashboard</h2>
          <p className="text-sm text-slate-500">Welcome back, {ownerData?.name?.split(' ')[0] || 'Owner'}!</p>
        </div>
 
        <button
          onClick={handleToggleStatus}
          disabled={isToggling}
          className={`
            group flex items-center gap-3 px-5 py-2.5 rounded-full font-bold transition-all duration-300 shadow-sm
            ${isCanteenOpen 
              ? 'bg-green-50 text-green-700 border border-green-200 hover:bg-green-100' 
              : 'bg-red-50 text-red-700 border border-red-200 hover:bg-red-100'}
            disabled:opacity-70
          `}
        >
          {isToggling ? (
             <Loader2 size={18} className="animate-spin" />
          ) : (
             <div className={`w-8 h-4 rounded-full relative transition-colors duration-300 ${isCanteenOpen ? 'bg-green-500' : 'bg-slate-300'}`}>
                <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full shadow-sm transition-transform duration-300 ${isCanteenOpen ? 'translate-x-4' : 'translate-x-0.5'}`}></div>
             </div>
          )}
          
          <span className="uppercase tracking-wide text-sm w-32 text-left">
            {isToggling ? 'Updating...' : (isCanteenOpen ? 'Canteen Open' : 'Canteen Closed')}
          </span>
          {!isToggling && <Power size={18} className={`transition-transform duration-300 ${isCanteenOpen ? 'rotate-0' : 'rotate-180'}`} />}
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard title="Total Revenue" value={`₹${stats.totalRevenue}`} icon={<DollarSign size={28} />} color="bg-green-500" loading={isLoading} />
        <StatCard title="Total Orders" value={stats.totalOrders} icon={<ShoppingBag size={28} />} color="bg-blue-500" loading={isLoading} />
        <StatCard title="Pending Orders" value={stats.pendingOrders} icon={<Clock size={28} />} color="bg-amber-500" loading={isLoading} />
        <StatCard title="Completed" value={stats.completedOrders} icon={<CheckCircle size={28} />} color="bg-indigo-500" loading={isLoading} />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Revenue Trend Chart */}
        <div className="card h-80 flex flex-col">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Live Revenue Trend</h3>
          {isLoading ? (
            <div className="flex items-end justify-between h-full px-2 gap-2">
              {[...Array(7)].map((_, i) => (
                <Skeleton key={i} className="w-full rounded-t-lg" style={{ height: `${(i % 3 + 2) * 20}%` }} />
              ))}
            </div>
          ) : (
            <div className="flex-1 flex items-end justify-between gap-2 px-2 pb-2">
              {revenueTrend.map((point, index) => (
                <div key={index} className="w-full flex flex-col items-center gap-2 group cursor-pointer">
                  <div className="w-full bg-primary/20 hover:bg-primary/80 transition-all duration-500 rounded-t-lg relative" style={{ height: `${point.value}%` }}>
                    <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                      {point.value}%
                    </span>
                  </div>
                  <span className="text-xs text-slate-400 font-medium">{point.time}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top Items Chart */}
        <div className="card h-80 flex flex-col">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Top Selling Items</h3>
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex justify-between items-center">
                  <Skeleton className="w-32 h-4" />
                  <Skeleton className="w-48 h-3 rounded-full" />
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-6 overflow-y-auto">
              {topItems.map((item, index) => (
                <div key={index} className="group">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-slate-600">{item.name}</span>
                    <span className="font-bold text-slate-800">{item.percentage}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                    <div className={`h-full rounded-full ${item.color} transition-all duration-1000 ease-out`} style={{ width: `${item.percentage}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Dashboard;