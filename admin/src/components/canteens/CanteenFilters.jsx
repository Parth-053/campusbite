import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MapPin } from 'lucide-react';
import { fetchDistricts, clearDistricts } from '../../store/locationSlice.js';

const CanteenFilters = ({ 
  states = [], adminColleges = [], 
  filterState, setFilterState, 
  filterDistrict, setFilterDistrict, 
  filterCollege, setFilterCollege,
  filterStatus, setFilterStatus 
}) => {
  const dispatch = useDispatch();
  const { districts = [] } = useSelector((state) => state.location || {});

  useEffect(() => {
    if (filterState) { dispatch(fetchDistricts(filterState)); } 
    else { dispatch(clearDistricts()); }
  }, [filterState, dispatch]);

  const availableColleges = adminColleges.filter((c) => c.district?._id === filterDistrict);

  return (
    <div className="bg-white p-3 md:p-4 rounded-xl shadow-sm border border-gray-200 mb-6">
      <div className="flex items-center gap-2 mb-3">
        <MapPin size={16} className="text-gray-400" />
        <h3 className="text-sm font-bold text-gray-700">Filter Records</h3>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 w-full">
        <select value={filterState} onChange={(e) => { setFilterState(e.target.value); setFilterDistrict(''); setFilterCollege(''); }} className="w-full border border-gray-300 p-2 rounded-lg text-xs md:text-sm focus:ring-2 focus:ring-primary outline-none bg-white">
          <option value="">All States</option>
          {states.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
        </select>
        
        <select value={filterDistrict} onChange={(e) => { setFilterDistrict(e.target.value); setFilterCollege(''); }} className="w-full border border-gray-300 p-2 rounded-lg text-xs md:text-sm focus:ring-2 focus:ring-primary outline-none disabled:bg-gray-50 bg-white" disabled={!filterState}>
          <option value="">All Districts</option>
          {districts.map(d => <option key={d._id} value={d._id}>{d.name}</option>)}
        </select>

        <select value={filterCollege} onChange={(e) => setFilterCollege(e.target.value)} className="w-full border border-gray-300 p-2 rounded-lg text-xs md:text-sm focus:ring-2 focus:ring-primary outline-none disabled:bg-gray-50 bg-white" disabled={!filterDistrict}>
          <option value="">All Colleges</option>
          {availableColleges.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
        </select>

        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="w-full border border-gray-300 p-2 rounded-lg text-xs md:text-sm focus:ring-2 focus:ring-primary outline-none bg-white">
          <option value="All">All Statuses</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>
    </div>
  );
};
export default CanteenFilters;