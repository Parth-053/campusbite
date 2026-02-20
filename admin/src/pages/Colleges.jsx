import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { School, CheckCircle, Plus } from 'lucide-react';

// Actions
import { 
  fetchColleges, fetchLocationData, addNewCollege, 
  editCollege, deleteCollege, toggleCollegeStatus 
} from '../store/collegeSlice';

// Components
import StatCard from '../components/dashboard/StatCard';
import Skeleton from '../components/common/Skeleton';
import CollegeFilters from '../components/colleges/CollegeFilters';
import CollegeModal from '../components/colleges/CollegeModal';
import CollegesTable from '../components/colleges/CollegesTable';

const Colleges = () => {
  const dispatch = useDispatch();
  
  const { 
    colleges, states, districtsMap, totalColleges, activeColleges, 
    isLoading, isActionLoading 
  } = useSelector((state) => state.college);

  // Filters
  const [filterState, setFilterState] = useState('');
  const [filterDistrict, setFilterDistrict] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCollege, setEditingCollege] = useState(null); // Holds data of college being edited

  useEffect(() => {
    dispatch(fetchLocationData());
    dispatch(fetchColleges()); 
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchColleges({
      state: filterState,
      district: filterDistrict,
      status: filterStatus
    }));
  }, [filterState, filterDistrict, filterStatus, dispatch]);

  // Open Modal to Add
  const handleOpenAdd = () => {
    setEditingCollege(null);
    setIsModalOpen(true);
  };

  // Open Modal to Edit
  const handleOpenEdit = (college) => {
    setEditingCollege(college);
    setIsModalOpen(true);
  };

  // Save (Add or Edit)
  const handleSaveCollege = (collegeData) => {
    if (editingCollege) {
      dispatch(editCollege({ id: collegeData.id, data: collegeData })).then(() => {
        setIsModalOpen(false);
      });
    } else {
      dispatch(addNewCollege(collegeData)).then(() => {
        setIsModalOpen(false);
      });
    }
  };

  // Delete
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this college?")) {
      dispatch(deleteCollege(id));
    }
  };

  // Toggle Status
  const handleToggleStatus = (id) => {
    dispatch(toggleCollegeStatus(id));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 relative">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Colleges Directory</h1>
        <button 
          onClick={handleOpenAdd}
          className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 text-sm font-medium shadow-sm"
        >
          <Plus size={18} /> Add New College
        </button>
      </div>
      
      {/* Filters Component */}
      <CollegeFilters 
        states={states}
        districtsMap={districtsMap}
        filterState={filterState} setFilterState={setFilterState}
        filterDistrict={filterDistrict} setFilterDistrict={setFilterDistrict}
        filterStatus={filterStatus} setFilterStatus={setFilterStatus}
      />

     {/* Stats - Changed to grid-cols-2 to force single row on mobile */}
      <div className="grid grid-cols-2 gap-3 md:gap-6">
        {isLoading ? (
          <>
            <Skeleton className="h-20 sm:h-24 w-full rounded-xl" />
            <Skeleton className="h-20 sm:h-24 w-full rounded-xl" />
          </>
        ) : (
          <>
            <StatCard title="Total Colleges" value={totalColleges} icon={School} color="bg-blue-500" />
            <StatCard title="Active Colleges" value={activeColleges} icon={CheckCircle} color="bg-green-500" />
          </>
        )}
      </div>
s

      {/* Table Component */}
      <CollegesTable 
        colleges={colleges} 
        isLoading={isLoading} 
        onToggleStatus={handleToggleStatus} 
        onEdit={handleOpenEdit}
        onDelete={handleDelete}
      />

      {/* Add / Edit Modal Overlay */}
      <CollegeModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleSaveCollege}
        editingData={editingCollege}
        states={states}
        districtsMap={districtsMap}
        isActionLoading={isActionLoading}
      />

    </div>
  );
};

export default Colleges;