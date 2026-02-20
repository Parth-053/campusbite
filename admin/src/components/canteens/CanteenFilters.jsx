import React from 'react';
import { MapPin } from 'lucide-react';

const CanteenFilters = ({ filterData, filters, setFilters }) => {
  const { states, districts } = filterData;

  const handleChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value,
      // Reset district if state changes
      ...(field === 'state' && { district: '' }) 
    }));
  };

  return (
    <div className="bg-white p-3 md:p-4 rounded-xl shadow-sm border border-gray-200 mb-6">
      <div className="flex items-center gap-2 mb-3">
        <MapPin size={16} className="text-gray-400" />
        <h3 className="text-sm font-bold text-gray-700">Filter Records</h3>
      </div>
      
      {/* flex-row and w-1/3 ensures all 3 dropdowns stay in one line on mobile */}
      <div className="flex flex-row items-center gap-2 w-full">
        <select 
          value={filters.state} 
          onChange={(e) => handleChange('state', e.target.value)} 
          className="w-1/3 border border-gray-300 p-1.5 md:p-2.5 rounded-lg text-[11px] md:text-sm focus:ring-2 focus:ring-primary outline-none"
        >
          <option value="">All States</option>
          {states?.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        
        <select 
          value={filters.district} 
          onChange={(e) => handleChange('district', e.target.value)} 
          className="w-1/3 border border-gray-300 p-1.5 md:p-2.5 rounded-lg text-[11px] md:text-sm focus:ring-2 focus:ring-primary outline-none disabled:bg-gray-50 disabled:text-gray-400"
          disabled={!filters.state}
        >
          <option value="">All Districts</option>
          {filters.state && districts[filters.state]?.map(d => <option key={d} value={d}>{d}</option>)}
        </select>

        <select 
          value={filters.status} 
          onChange={(e) => handleChange('status', e.target.value)} 
          className="w-1/3 border border-gray-300 p-1.5 md:p-2.5 rounded-lg text-[11px] md:text-sm focus:ring-2 focus:ring-primary outline-none"
        >
          <option value="All">All Statuses</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>
    </div>
  );
};

export default CanteenFilters;