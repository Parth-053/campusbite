import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Wallet, Activity, ArrowUpRight, Clock, Download } from 'lucide-react';
import { fetchFinanceData } from '../store/financeSlice';

import StatCard from '../components/dashboard/StatCard';
import Skeleton from '../components/common/Skeleton';
import FinanceFilters from '../components/finance/FinanceFilters';
import TransactionTable from '../components/finance/TransactionTable';

const Finance = () => {
  const dispatch = useDispatch();
  const { metrics, transactions, isLoading } = useSelector(state => state.finance);
  
  const [filters, setFilters] = useState({ duration: 'This Month', type: 'All', status: 'All' });

  useEffect(() => {
    dispatch(fetchFinanceData(filters));
  }, [dispatch, filters]);

  const handleExport = () => {
    // Mock export functionality
    alert(`Exporting ${filters.duration} financial report as CSV/PDF...`);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-10">
      
      {/* Header & Export Action */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Financial Reports & Settlements</h1>
          <p className="text-sm text-gray-500">Manage platform revenue, payouts, and transaction history.</p>
        </div>
        
        <button 
          onClick={handleExport}
          className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-gray-800 transition-colors shadow-sm w-full sm:w-auto justify-center"
        >
          <Download size={16} /> Export Report
        </button>
      </div>

      {/* --- Key Financial Metrics Grid --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {isLoading || !metrics ? (
          Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24 w-full rounded-xl" />)
        ) : (
          <>
            <StatCard 
              title="Total Processed Volume" 
              value={`₹${metrics.totalVolume.toLocaleString()}`} 
              icon={Activity} 
              color="bg-blue-500" 
            />
            <StatCard 
              title="Net Platform Earnings" 
              value={`₹${metrics.platformEarnings.toLocaleString()}`} 
              icon={Wallet} 
              color="bg-green-500" 
            />
            <StatCard 
              title="Settled Owner Payouts" 
              value={`₹${metrics.totalPayouts.toLocaleString()}`} 
              icon={ArrowUpRight} 
              color="bg-indigo-500" 
            />
            <StatCard 
              title="Pending Payables" 
              value={`₹${metrics.pendingPayouts.toLocaleString()}`} 
              icon={Clock} 
              color="bg-amber-500" 
            />
          </>
        )}
      </div>

      {/* --- Filters & Transactions Table --- */}
      <div className="mt-8">
        <h2 className="text-lg font-bold text-gray-800 mb-4">Transaction Ledger</h2>
        <FinanceFilters filters={filters} setFilters={setFilters} />
        <TransactionTable transactions={transactions} isLoading={isLoading} />
      </div>

    </div>
  );
};

export default Finance;