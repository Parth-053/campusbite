import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Coffee, CheckCircle, Plus } from 'lucide-react';

import { fetchStates } from '../store/locationSlice.js';
import { fetchColleges } from '../store/collegeSlice.js'; 

import { 
  fetchCanteens, addNewCanteen, editCanteen, 
  deleteCanteen, toggleCanteenStatus 
} from '../store/canteenSlice.js';

import StatCard from '../components/dashboard/StatCard';
import Skeleton from '../components/common/Skeleton';
import CanteenFilters from '../components/canteens/CanteenFilters';
import CanteenModal from '../components/canteens/CanteenModal';
import CanteensTable from '../components/canteens/CanteensTable';

const Canteens = () => {
  const dispatch = useDispatch();
  
  const { states = [] } = useSelector((state) => state.location || {});
  const { adminColleges = [] } = useSelector((state) => state.college || {});
  
  const { adminCanteens = [], isLoading, isActionLoading } = useSelector(
    (state) => state.canteen || {}
  );

  const [filterState, setFilterState] = useState('');
  const [filterDistrict, setFilterDistrict] = useState('');
  const [filterCollege, setFilterCollege] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCanteen, setEditingCanteen] = useState(null);

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

  const activeCanteensCount = (adminCanteens || []).filter(c => c.isActive).length;

  const handleSaveCanteen = (canteenData) => {
    const formData = new FormData();

    Object.keys(canteenData).forEach((key) => {
      if (key !== 'id' && canteenData[key] !== null && canteenData[key] !== undefined && canteenData[key] !== '') {
        formData.append(key, canteenData[key]);
      }
    });
 
    if (editingCanteen) {
      dispatch(editCanteen({ id: canteenData.id, data: formData })).then((res) => {
        if (!res.error) { setIsModalOpen(false); dispatch(fetchCanteens()); }
      });
    } else {
      dispatch(addNewCanteen(formData)).then((res) => {
        if (!res.error) { setIsModalOpen(false); dispatch(fetchCanteens()); }
      });
    }
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this canteen?")) {
      dispatch(deleteCanteen(id)).then(res => {
        if(res.error) alert(res.payload);
      });
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Canteens Directory</h1>
        <button onClick={() => { setEditingCanteen(null); setIsModalOpen(true); }} className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2">
          <Plus size={18} /> Add Canteen
        </button>
      </div>

      <CanteenFilters 
        states={states} adminColleges={adminColleges}
        filterState={filterState} setFilterState={setFilterState}
        filterDistrict={filterDistrict} setFilterDistrict={setFilterDistrict}
        filterCollege={filterCollege} setFilterCollege={setFilterCollege}
        filterStatus={filterStatus} setFilterStatus={setFilterStatus}
      />

      <div className="grid grid-cols-2 gap-3 md:gap-6">
        <StatCard title="Total Canteens" value={adminCanteens.length} icon={Coffee} color="bg-orange-500" />
        <StatCard title="Active Canteens" value={activeCanteensCount} icon={CheckCircle} color="bg-green-500" />
      </div>

      <CanteensTable 
        canteens={filteredCanteens} isLoading={isLoading} 
        onToggleStatus={(id) => dispatch(toggleCanteenStatus(id))}
        onEdit={(canteen) => { setEditingCanteen(canteen); setIsModalOpen(true); }}
        onDelete={handleDelete} 
      />

      <CanteenModal 
        isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} 
        onSave={handleSaveCanteen} editingData={editingCanteen}
        states={states} adminColleges={adminColleges}
        isActionLoading={isActionLoading}
      />
    </div>
  );
};

export default Canteens;