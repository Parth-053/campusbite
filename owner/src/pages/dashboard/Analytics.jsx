import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchAnalyticsData, setAnalyticsFilter } from '../../store/analyticsSlice';
import Skeleton from '../../components/common/Skeleton';
import { DollarSign, ShoppingBag, Calendar } from 'lucide-react';

const StatCard = ({ title, value, icon, color, isLoading }) => {
  if (isLoading) return <Skeleton className="h-32 w-full rounded-xl" />;
  
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

const Analytics = () => {
  const dispatch = useDispatch();
  const { stats, revenueTrend, topItems, filter, isLoading } = useSelector(state => state.analytics);

  useEffect(() => {
    dispatch(fetchAnalyticsData(filter));
  }, [dispatch, filter]);

  const filters = ['Today', 'Yesterday', 'Last Week', 'Last Month', 'Last 3 Months', 'Last 6 Months', 'Last Year', 'Total'];

  return (
    <div className="space-y-6 pb-20 md:pb-0">
      
      {/* Header & Filter */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-200">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Analytics</h2>
          <p className="text-sm text-slate-500">Performance metrics and reports.</p>
        </div>

        <div className="relative w-full sm:w-auto">
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <select 
            className="w-full sm:w-48 appearance-none bg-slate-50 border border-slate-200 text-slate-700 py-2.5 pl-10 pr-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 font-medium cursor-pointer"
            value={filter}
            onChange={(e) => dispatch(setAnalyticsFilter(e.target.value))}
          >
            {filters.map(f => <option key={f} value={f}>{f}</option>)}
          </select>
        </div>
      </div>

      {/* Stats Grid (Only Revenue & Orders) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
        <StatCard 
          title={`Revenue (${filter})`} 
          value={`₹${stats.totalRevenue.toLocaleString()}`} 
          icon={<DollarSign size={28} />} 
          color="bg-green-500" 
          isLoading={isLoading}
        />
        <StatCard 
          title={`Orders (${filter})`} 
          value={stats.totalOrders} 
          icon={<ShoppingBag size={28} />} 
          color="bg-blue-500" 
          isLoading={isLoading}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Dynamic Revenue Chart */}
        <div className="card h-96 flex flex-col">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Revenue Trend</h3>
          {isLoading ? (
            <div className="flex items-end justify-between h-full px-2 gap-2">
              {[...Array(6)].map((_, i) => (
                <Skeleton 
                  key={i} 
                  className="w-full rounded-t-lg" 
                  style={{ height: `${(i % 3 + 2) * 20}%` }} 
                />
              ))}
            </div>
          ) : (
            <div className="flex-1 flex items-end justify-between gap-2 px-2 pb-2">
              {revenueTrend.map((point, index) => {
                // Calculate height percentage relative to max value (mock logic)
                const maxVal = Math.max(...revenueTrend.map(p => p.value)) || 1;
                const height = (point.value / maxVal) * 80 + 10; // Min 10% height

                return (
                  <div key={index} className="w-full flex flex-col items-center gap-2 group cursor-pointer">
                    <div 
                      className="w-full bg-primary/20 hover:bg-primary/80 transition-all duration-500 rounded-t-lg relative min-h-[4px]"
                      style={{ height: `${height}%` }}
                    >
                      <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
                        ₹{point.value}
                      </span>
                    </div>
                    <span className="text-[10px] sm:text-xs text-slate-400 font-medium whitespace-nowrap overflow-hidden text-ellipsis w-full text-center">
                      {point.label}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Top Items List */}
        <div className="card h-96 flex flex-col">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Top Selling Items</h3>
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex justify-between items-center">
                  <Skeleton className="w-32 h-4" />
                  <Skeleton className="w-16 h-3 rounded-full" />
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-6 overflow-y-auto pr-2 custom-scrollbar">
              {topItems.map((item, index) => (
                <div key={index} className="group">
                  <div className="flex justify-between items-center text-sm mb-2">
                    <div className="flex items-center gap-3">
                      <span className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold ${index < 3 ? 'bg-yellow-100 text-yellow-700' : 'bg-slate-100 text-slate-500'}`}>
                        {index + 1}
                      </span>
                      <span className="font-medium text-slate-700">{item.name}</span>
                    </div>
                    <span className="font-bold text-slate-800 bg-slate-50 px-2 py-1 rounded text-xs">
                      {item.orders} Orders
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden ml-9 w-[calc(100%-2.25rem)]">
                    <div 
                      className={`h-full rounded-full ${item.color} transition-all duration-1000 ease-out`}
                      style={{ width: `${item.percentage}%` }}
                    ></div>
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

export default Analytics;