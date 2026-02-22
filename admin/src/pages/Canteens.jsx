import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Coffee, CheckCircle, Clock } from 'lucide-react'; 

import { fetchStates } from '../store/locationSlice.js';
import { fetchColleges } from '../store/collegeSlice.js'; 
import { fetchCanteens, updateOwnerStatus, deleteCanteen, toggleCanteenStatus } from '../store/canteenSlice.js';

import StatCard from '../components/dashboard/StatCard';
import CanteenFilters from '../components/canteens/CanteenFilters';
import CanteensTable from '../components/canteens/CanteensTable'; 

const Canteens = () => {
  const dispatch = useDispatch();
  
  const { states = [] } = useSelector((state) => state.location || {});
  const { adminColleges = [] } = useSelector((state) => state.college || {});
  const { adminCanteens = [], isLoading } = useSelector((state) => state.canteen || {});

  const [filterState, setFilterState] = useState('');
  const [filterDistrict, setFilterDistrict] = useState('');
  const [filterCollege, setFilterCollege] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');

  useEffect(() => {
    dispatch(fetchStates());
    dispatch(fetchColleges());
    dispatch(fetchCanteens());
  }, [dispatch]);

  const filteredCanteens = (adminCanteens || []).filter((c) => {
    if (filterState && c.college?.district?.state?._id !== filterState) return false;
    if (filterDistrict && c.college?.district?._id !== filterDistrict) return false;
    if (filterCollege && c.college?._id !== filterCollege) return false;
    if (filterStatus !== 'All') {
      const isActiveFilter = filterStatus === 'Active';
      if (c.isActive !== isActiveFilter) return false;
    }
    return true;
  });

  const activeCanteensCount = adminCanteens.filter(c => c.isActive && c.owner?.status === 'approved').length;
  const pendingRequestsCount = adminCanteens.filter(c => c.owner?.status === 'pending').length;

  const handleApproveReject = (ownerId, newStatus) => {
    if (window.confirm(`Are you sure you want to mark this request as ${newStatus}?`)) {
      dispatch(updateOwnerStatus({ ownerId, status: newStatus }));
    }
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this canteen?")) {
      dispatch(deleteCanteen(id));
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Canteens & Requests</h1>
      </div>

      <CanteenFilters 
        states={states} adminColleges={adminColleges}
        filterState={filterState} setFilterState={setFilterState}
        filterDistrict={filterDistrict} setFilterDistrict={setFilterDistrict}
        filterCollege={filterCollege} setFilterCollege={setFilterCollege}
        filterStatus={filterStatus} setFilterStatus={setFilterStatus}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-6">
        <StatCard title="Total Registrations" value={adminCanteens.length} icon={Coffee} color="bg-blue-500" />
        <StatCard title="Active Canteens" value={activeCanteensCount} icon={CheckCircle} color="bg-green-500" />
        <StatCard title="Pending Requests" value={pendingRequestsCount} icon={Clock} color="bg-amber-500" />
      </div>

      <CanteensTable 
        canteens={filteredCanteens} 
        isLoading={isLoading} 
        onToggleStatus={(id) => dispatch(toggleCanteenStatus(id))}
        onApproveReject={handleApproveReject} 
        onDelete={handleDelete} 
      />
    </div>
  );
};

export default Canteens;