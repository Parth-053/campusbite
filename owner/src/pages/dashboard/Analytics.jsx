import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchAnalyticsData, setTimeframe } from '../../store/analyticsSlice';
import Skeleton from '../../components/common/Skeleton';
import { DollarSign, ShoppingBag, Award, UtensilsCrossed } from 'lucide-react';

const StatCard = ({ title, value, icon, colorClass, loading }) => {
  if (loading) return <Skeleton className="h-28 sm:h-36 w-full rounded-2xl" />;
  const textColor = colorClass.split(' ').find(c => c.startsWith('text-'));

  return (
    <div className="relative overflow-hidden bg-surface p-5 sm:p-8 rounded-2xl border border-borderCol shadow-sm hover:shadow-md transition-all duration-300 group flex-1">
      <div className="relative z-10">
        <p className="text-textLight text-xs sm:text-sm font-bold uppercase tracking-wider mb-1 sm:mb-2 truncate">{title}</p>
        <h3 className="text-2xl sm:text-4xl font-black text-textDark truncate">{value}</h3>
      </div>
      <div className={`absolute -bottom-3 -right-3 sm:-bottom-6 sm:-right-6 w-24 h-24 sm:w-36 sm:h-36 opacity-[0.08] transform group-hover:scale-110 group-hover:-rotate-12 transition-all duration-500 ease-out flex items-center justify-center ${textColor}`}>
        {React.cloneElement(icon, { size: '100%', strokeWidth: 2 })}
      </div>
    </div>
  );
};

const Analytics = () => {
  const dispatch = useDispatch();
  const { timeframe, stats, trendData, topItems, isLoading } = useSelector(state => state.analytics);

  useEffect(() => {
    dispatch(fetchAnalyticsData(timeframe));
  }, [dispatch, timeframe]);

  const handleFilterChange = (e) => {
    dispatch(setTimeframe(e.target.value));
  };

  const maxRevenue = trendData.length > 0 ? Math.max(...trendData.map(d => d.value)) : 100;

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-20 md:pb-0">
      
      {/* HEADER & DROPDOWN FILTER */}
      <div className="flex flex-row justify-between items-center bg-surface p-4 sm:p-5 rounded-2xl border border-borderCol shadow-sm gap-4">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-textDark">Revenue Analytics</h2>
          <p className="text-xs sm:text-sm text-textLight mt-0.5 hidden sm:block">Track your business performance seamlessly.</p>
        </div>
         
        <div className="relative shrink-0">
          <select
            value={timeframe}
            onChange={handleFilterChange}
            disabled={isLoading}
            className="appearance-none bg-background border border-borderCol text-textDark text-sm font-bold rounded-xl px-4 py-2.5 pr-10 outline-none focus:ring-2 focus:ring-primary focus:border-primary cursor-pointer shadow-sm disabled:opacity-50"
          >
            <option value="till_now">Till Now</option>
            <option value="today">Today</option>
            <option value="yesterday">Yesterday</option>
            <option value="last_week">Last 7 Days</option>
            <option value="last_month">Last 30 Days</option>
            <option value="last_6_months">Last 6 Months</option>
            <option value="last_year">Last Year</option>
          </select>
          {/* Custom Chevron for select */}
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-textLight">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
          </div>
        </div>
      </div>

      {/* STATS GRID  */}
      <div className="grid grid-cols-2 gap-4 sm:gap-6">
        <StatCard title="Total Revenue" value={`₹${stats?.totalRevenue || 0}`} icon={<DollarSign />} colorClass="bg-success/10 text-success" loading={isLoading} />
        <StatCard title="Total Orders" value={stats?.totalOrders || 0} icon={<ShoppingBag />} colorClass="bg-primary/10 text-primary" loading={isLoading} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* REVENUE CHART */}
        <div className="lg:col-span-2 bg-surface border border-borderCol rounded-2xl shadow-sm p-5 sm:p-6 flex flex-col h-[450px]">
          <h3 className="text-lg font-bold text-textDark mb-6">Revenue Trend</h3>
          
          {isLoading ? (
            <div className="flex-1 flex items-end justify-between gap-2 pt-4">
              {[...Array(10)].map((_, i) => (
                <Skeleton key={i} className="w-full rounded-t-md" style={{ height: `${(i % 5 + 3) * 15}%` }} />
              ))}
            </div>
          ) : trendData.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-textLight">
              <p className="font-medium">No sales data found for this period.</p>
            </div>
          ) : (
            <div className="flex-1 flex items-end justify-between gap-1 sm:gap-3 pt-4 overflow-x-auto custom-scrollbar">
              {trendData.map((point, index) => {
                const heightPercent = maxRevenue > 0 ? (point.value / maxRevenue) * 100 : 0;
                return (
                  <div key={index} className="w-full min-w-[20px] sm:min-w-[30px] flex flex-col items-center gap-2 group relative">
                    {/* Tooltip */}
                    <span className="absolute -top-12 bg-sidebar text-white text-xs font-bold px-2.5 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity z-10 whitespace-nowrap pointer-events-none shadow-lg">
                      ₹{point.value} <br/><span className="text-[10px] text-gray-300">{point.orders} Orders</span>
                    </span>
                    
                    {/* Bar */}
                    <div className="w-full h-full flex items-end justify-center">
                      <div className="w-full bg-primary/20 group-hover:bg-primary transition-colors duration-300 rounded-t-sm sm:rounded-t-md" style={{ height: `${Math.max(heightPercent, 2)}%` }}></div>
                    </div>
                    
                    {/* Label */}
                    <span className="text-[8px] sm:text-[10px] font-semibold text-textLight whitespace-nowrap overflow-hidden text-ellipsis max-w-full px-1">
                      {point.label}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* TOP SELLING ITEMS   */}
        <div className="bg-surface border border-borderCol rounded-2xl shadow-sm p-5 sm:p-6 flex flex-col h-[450px]">
          <div className="flex items-center gap-2 mb-4 shrink-0">
            <Award className="text-warning" size={24} />
            <h3 className="text-lg font-bold text-textDark">Top 10 Performers</h3>
          </div>

          {isLoading ? (
            <div className="space-y-4 pt-2 overflow-hidden">
              {[1, 2, 3, 4, 5].map(i => <Skeleton key={i} className="w-full h-14 rounded-xl" />)}
            </div>
          ) : topItems.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-textLight">
              <UtensilsCrossed size={40} className="mb-3 opacity-20" />
              <p className="font-medium text-sm">No items sold yet.</p>
            </div>
          ) : (
            <div className="space-y-3 flex-1 overflow-y-auto pr-1 custom-scrollbar pb-2">
              {topItems.map((item, index) => (
                <div key={item.name} className="flex items-center gap-3 p-3 bg-background rounded-xl border border-borderCol/50 hover:border-borderCol transition-colors">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-primary text-white flex items-center justify-center font-black text-xs sm:text-sm shrink-0 shadow-sm">
                    #{index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-textDark text-sm truncate">{item.name}</p>
                    <p className="text-[10px] text-textLight font-medium mt-0.5">{item.totalQuantity} sold</p>
                  </div>
                  
                  {/*   Added Contribution Percentage */}
                  <div className="flex flex-col items-end shrink-0">
                    <p className="font-black text-success text-sm">₹{item.totalRevenue}</p>
                    <span className="text-[9px] font-bold text-primary mt-0.5 bg-primary/10 px-1.5 py-0.5 rounded">
                      {item.percentage}%
                    </span>
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