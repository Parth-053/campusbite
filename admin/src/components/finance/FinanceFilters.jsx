import React from 'react';
import { Filter } from 'lucide-react';

const FinanceFilters = ({ filters, setFilters }) => {
  const handleChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-6">
      <div className="flex items-center gap-2 mb-3">
        <Filter size={16} className="text-gray-400" />
        <h3 className="text-sm font-bold text-gray-700">Filter Transactions</h3>
      </div>
      
      <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
        <select 
          value={filters.duration} 
          onChange={(e) => handleChange('duration', e.target.value)} 
          className="w-full sm:w-1/3 border border-gray-300 p-2.5 rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none"
        >
          <option value="This Month">This Month</option>
          <option value="Last Month">Last Month</option>
          <option value="This Year">This Year</option>
          <option value="All Time">All Time</option>
        </select>

        <select 
          value={filters.type} 
          onChange={(e) => handleChange('type', e.target.value)} 
          className="w-full sm:w-1/3 border border-gray-300 p-2.5 rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none"
        >
          <option value="All">All Transaction Types</option>
          <option value="Payout">Owner Payouts</option>
          <option value="Platform Fee">Platform Fees</option>
          <option value="Refund">Refunds</option>
        </select>

        <select 
          value={filters.status} 
          onChange={(e) => handleChange('status', e.target.value)} 
          className="w-full sm:w-1/3 border border-gray-300 p-2.5 rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none"
        >
          <option value="All">All Statuses</option>
          <option value="Completed">Completed</option>
          <option value="Pending">Pending</option>
          <option value="Failed">Failed</option>
        </select>
      </div>
    </div>
  );
};

export default FinanceFilters;