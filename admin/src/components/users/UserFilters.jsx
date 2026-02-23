import React from 'react';
import { Filter } from 'lucide-react';

const UserFilters = ({ colleges, filters, setFilters }) => {
  const handleChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="bg-white p-3 md:p-4 rounded-xl shadow-sm border border-gray-200 mb-6">
      <div className="flex items-center gap-2 mb-3">
        <Filter size={16} className="text-gray-400" />
        <h3 className="text-sm font-bold text-gray-700">Filter Users</h3>
      </div>
      
      <div className="flex flex-row items-center gap-2 w-full">
        <select 
          value={filters.college} 
          onChange={(e) => handleChange('college', e.target.value)} 
          className="w-1/2 border border-gray-300 p-2 rounded-lg text-[11px] md:text-sm focus:ring-2 focus:ring-primary outline-none"
        >
          <option value="">All Colleges</option>
          {colleges?.map(c => <option key={c} value={c}>{c}</option>)}
        </select>

        <select 
          value={filters.status} 
          onChange={(e) => handleChange('status', e.target.value)} 
          className="w-1/2 border border-gray-300 p-2 rounded-lg text-[11px] md:text-sm focus:ring-2 focus:ring-primary outline-none"
        >
          <option value="All">All Statuses</option>
          <option value="Active">Active</option>
          <option value="Inactive">Blocked</option>
        </select>
      </div>
    </div>
  );
};

export default UserFilters;