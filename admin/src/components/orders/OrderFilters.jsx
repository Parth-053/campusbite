import React from 'react';
import { Filter, Calendar } from 'lucide-react';

const OrderFilters = ({ filters, setFilters }) => {
  const handleChange = (field, value) => {
    setFilters(prev => ({ 
      ...prev, 
      [field]: value,
      // Clear custom date if changing duration away from Custom
      ...(field === 'duration' && value !== 'Custom' && { customDate: '' })
    }));
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-6">
      <div className="flex items-center gap-2 mb-3">
        <Filter size={16} className="text-gray-400" />
        <h3 className="text-sm font-bold text-gray-700">Filter Orders</h3>
      </div>
      
      <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
        <select 
          value={filters.duration} 
          onChange={(e) => handleChange('duration', e.target.value)} 
          className="w-full sm:w-1/3 border border-gray-300 p-2.5 rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none"
        >
          <option value="All">All Time</option>
          <option value="Today">Today</option>
          <option value="Yesterday">Yesterday</option>
          <option value="Last Week">Last 7 Days</option>
          <option value="Last Month">Last 30 Days</option>
          <option value="Last Year">Last Year</option>
          <option value="Custom">Custom Date</option>
        </select>

        {filters.duration === 'Custom' && (
          <div className="w-full sm:w-1/3 relative">
            <Calendar size={16} className="absolute left-3 top-3 text-gray-400" />
            <input 
              type="date" 
              value={filters.customDate} 
              onChange={(e) => handleChange('customDate', e.target.value)} 
              className="w-full border border-gray-300 p-2.5 pl-9 rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none"
            />
          </div>
        )}

        <select 
          value={filters.status} 
          onChange={(e) => handleChange('status', e.target.value)} 
          className={`w-full ${filters.duration === 'Custom' ? 'sm:w-1/3' : 'sm:w-1/2'} border border-gray-300 p-2.5 rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none`}
        >
          <option value="All">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>
    </div>
  );
};

export default OrderFilters;