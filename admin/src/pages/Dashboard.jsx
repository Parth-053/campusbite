import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { School, Coffee, Users, ShoppingBag, TrendingUp, DollarSign, Wallet, Activity } from 'lucide-react';
import StatCard from '../components/dashboard/StatCard'; // Make sure this path is correct based on your folder structure
import BarChart from '../components/dashboard/BarChart';
import Skeleton from '../components/common/Skeleton';
import { fetchDashboardData } from '../store/dashboardSlice';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { data, isLoading, error } = useSelector((state) => state.dashboard);

  useEffect(() => {
    // Fetch dashboard data on mount
    dispatch(fetchDashboardData());
  }, [dispatch]);

  if (error) {
    return <div className="p-6 text-red-500 text-center font-semibold">Error: {error}</div>;
  }

  // Icons and text configuration for mapping
  const statConfig = [
    { key: 'totalRevenue', title: 'Total Revenue', icon: Activity, color: 'bg-emerald-500', isCurrency: true },
    { key: 'totalProfit', title: 'Total Profit', icon: Wallet, color: 'bg-blue-600', isCurrency: true },
    { key: 'totalOrders', title: 'Total Orders', icon: ShoppingBag, color: 'bg-purple-500' },
    { key: 'totalUsers', title: 'Total Users', icon: Users, color: 'bg-green-500' },
    { key: 'totalOwnerCommission', title: 'Owner Commission', icon: TrendingUp, color: 'bg-indigo-600', isCurrency: true },
    { key: 'totalUserCommission', title: 'User Commission', icon: DollarSign, color: 'bg-teal-500', isCurrency: true },
    { key: 'totalColleges', title: 'Total Colleges', icon: School, color: 'bg-sky-500' },
    { key: 'totalCanteens', title: 'Total Canteens', icon: Coffee, color: 'bg-orange-500' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
      </div>

      {/* --- STAT CARDS GRID --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {isLoading
          ? Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-center">
                <Skeleton className="w-12 h-12 rounded-full mr-4" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-6 w-16" />
                </div>
              </div>
            ))
          : statConfig.map((config, index) => (
              <StatCard 
                key={index} 
                title={config.title} 
                value={config.isCurrency ? `$${data.stats[config.key].toLocaleString()}` : data.stats[config.key].toLocaleString()} 
                icon={config.icon} 
                color={config.color} 
              />
            ))
        }
      </div>

      {/* --- CHARTS GRID --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 pt-4">
        
        {/* Owner Commission Chart */}
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="mb-4">
            <h3 className="text-lg font-bold text-gray-800">Owner Commission Trend</h3>
            <p className="text-sm text-gray-500">Platform earnings from canteen sales</p>
          </div>
          {isLoading ? (
             <Skeleton className="w-full h-56 rounded-md" />
          ) : (
            <BarChart data={data.ownerCommissionChart} colorClass="bg-indigo-500" />
          )}
        </div>

        {/* User Commission Chart */}
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="mb-4">
            <h3 className="text-lg font-bold text-gray-800">User Commission Trend</h3>
            <p className="text-sm text-gray-500">Convenience fees collected from students</p>
          </div>
          {isLoading ? (
             <Skeleton className="w-full h-56 rounded-md" />
          ) : (
            <BarChart data={data.userCommissionChart} colorClass="bg-teal-500" />
          )}
        </div>

      </div>
    </div>
  );
};

export default Dashboard;