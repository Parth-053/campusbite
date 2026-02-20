import React from 'react';
import { MapPin } from 'lucide-react';

const CollegeFilters = ({ 
  states, 
  districtsMap, 
  filterState, 
  setFilterState, 
  filterDistrict, 
  setFilterDistrict, 
  filterStatus, 
  setFilterStatus 
}) => {
  return (
    <div className="bg-white p-3 md:p-4 rounded-xl shadow-sm border border-gray-200 mb-6">
      <div className="flex items-center gap-2 mb-3">
        <MapPin size={16} className="text-gray-400" />
        <h3 className="text-sm font-bold text-gray-700">Filter Records</h3>
      </div>
      
      {/* flex-row ensures they stay in one line even on mobile.
        gap-2 provides small spacing.
      */}
      <div className="flex flex-row items-center gap-2 w-full">
        <select 
          value={filterState} 
          onChange={(e) => { setFilterState(e.target.value); setFilterDistrict(''); }} 
          className="w-1/3 border border-gray-300 p-1.5 md:p-2.5 rounded-lg text-[11px] md:text-sm focus:ring-2 focus:ring-primary outline-none"
        >
          <option value="">All States</option>
          {states.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        
        <select 
          value={filterDistrict} 
          onChange={(e) => setFilterDistrict(e.target.value)} 
          className="w-1/3 border border-gray-300 p-1.5 md:p-2.5 rounded-lg text-[11px] md:text-sm focus:ring-2 focus:ring-primary outline-none disabled:bg-gray-50 disabled:text-gray-400"
          disabled={!filterState}
        >
          <option value="">All Districts</option>
          {filterState && districtsMap[filterState]?.map(d => <option key={d} value={d}>{d}</option>)}
        </select>

        <select 
          value={filterStatus} 
          onChange={(e) => setFilterStatus(e.target.value)} 
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

export default CollegeFilters;