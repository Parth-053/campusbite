import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Activity, Wallet, ShoppingBag, PieChart, TrendingUp, Filter, Calendar } from 'lucide-react';

import { fetchAnalyticsData } from '../store/analyticsSlice';
import Skeleton from '../components/common/Skeleton';
import BarChart from '../components/dashboard/BarChart';
import TrendCard from '../components/analytics/TrendCard';

const Analytics = () => {
  const dispatch = useDispatch();
  const { data, isLoading } = useSelector(state => state.analytics);
  
  const [filters, setFilters] = useState({ duration: 'This Month', customDate: '' });

  useEffect(() => {
    dispatch(fetchAnalyticsData(filters));
  }, [dispatch, filters]);

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value,
      // Clear the custom date if the user switches away from the "Custom" option
      ...(field === 'duration' && value !== 'Custom' && { customDate: '' })
    }));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-10">
      
      {/* Header & Global Filters */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Analytics Overview</h1>
          <p className="text-sm text-gray-500">Track your platform's performance and growth.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          
          {/* Custom Date Picker (Only visible if 'Custom' is selected) */}
          {filters.duration === 'Custom' && (
            <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg shadow-sm border border-gray-200 w-full sm:w-auto">
              <Calendar size={16} className="text-gray-400" />
              <input 
                type="date" 
                value={filters.customDate} 
                onChange={(e) => handleFilterChange('customDate', e.target.value)} 
                className="text-sm font-bold text-gray-700 bg-transparent outline-none w-full"
              />
            </div>
          )}

          {/* Duration Dropdown */}
          <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg shadow-sm border border-gray-200 w-full sm:w-auto">
            <Filter size={16} className="text-gray-400" />
            <select 
              value={filters.duration} 
              onChange={(e) => handleFilterChange('duration', e.target.value)}
              className="text-sm font-bold text-gray-700 bg-transparent outline-none cursor-pointer w-full"
            >
              <option value="Today">Today</option>
              <option value="Yesterday">Yesterday</option>
              <option value="Last Week">Last Week</option>
              <option value="This Month">This Month</option>
              <option value="This Year">This Year</option>
              <option value="All Time">All Time</option>
              <option value="Custom">Custom Date</option>
            </select>
          </div>
        </div>
      </div>

      {/* --- KPI Grid --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {isLoading || !data ? (
          Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-32 w-full rounded-xl" />)
        ) : (
          <>
            <TrendCard title="Gross Revenue" value={data.kpis.revenue.value} trend={data.kpis.revenue.trend} icon={Activity} isCurrency />
            <TrendCard title="Platform Profit" value={data.kpis.profit.value} trend={data.kpis.profit.trend} icon={Wallet} isCurrency />
            <TrendCard title="Total Orders" value={data.kpis.orders.value} trend={data.kpis.orders.trend} icon={ShoppingBag} />
            <TrendCard title="Avg. Order Value" value={data.kpis.aov.value} trend={data.kpis.aov.trend} icon={PieChart} isCurrency />
          </>
        )}
      </div>

      {/* --- Charts & Breakdowns --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Revenue Chart */}
        <div className="lg:col-span-2 bg-white p-5 md:p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-gray-800">Revenue Trend</h3>
              <p className="text-xs text-gray-500">Gross processing volume for selected period</p>
            </div>
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg"><TrendingUp size={20} /></div>
          </div>
          <div className="flex-1 flex items-end min-h-[250px]">
            {isLoading ? <Skeleton className="h-full w-full rounded-lg" /> : <BarChart data={data.revenueTrend} colorClass="bg-indigo-500" />}
          </div>
        </div>

        {/* Top Canteens List */}
        <div className="bg-white p-5 md:p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col">
          <h3 className="text-base font-bold text-gray-800 mb-6">Top Canteens by Revenue</h3>
          <div className="space-y-5 flex-1">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-2"><Skeleton className="h-4 w-full" /><Skeleton className="h-2 w-full" /></div>
              ))
            ) : (
              data.topCanteens.map((canteen, idx) => (
                <div key={canteen.id}>
                  <div className="flex justify-between text-sm font-bold text-gray-800 mb-1.5">
                    <span className="flex items-center gap-2">
                      <span className="text-gray-400 text-xs">#{idx + 1}</span> {canteen.name}
                    </span>
                    <span>₹{canteen.revenue.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5">
                    <div className="bg-primary h-1.5 rounded-full transition-all duration-500" style={{ width: `${canteen.percentage}%` }} />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Top Items List - Spanning full width at the bottom */}
        <div className="lg:col-span-3 bg-white p-5 md:p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-base font-bold text-gray-800 mb-4">Most Ordered Items</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-14 w-full rounded-lg" />)
            ) : (
              data.topItems.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center p-3 border border-gray-100 rounded-lg bg-gray-50">
                  <span className="text-sm font-bold text-gray-700">{item.name}</span>
                  <span className="text-xs font-bold text-primary bg-indigo-50 px-2 py-1 rounded-md">
                    {item.orders.toLocaleString()} orders
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Analytics;