import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { School, CheckCircle, Plus } from "lucide-react";

import { fetchStates } from "../store/locationSlice.js";

import {
  fetchColleges,
  addNewCollege, 
  editCollege,
  deleteCollege,
  toggleCollegeStatus,
} from "../store/collegeSlice.js";

import StatCard from "../components/dashboard/StatCard";
import Skeleton from "../components/common/Skeleton";
import CollegeFilters from "../components/colleges/CollegeFilters";
import CollegeModal from "../components/colleges/CollegeModal";
import CollegesTable from "../components/colleges/CollegesTable";

const Colleges = () => {
  const dispatch = useDispatch();

  const { states = [] } = useSelector((state) => state.location || {});

  const { adminColleges = [], isLoading, isActionLoading } = useSelector(
    (state) => state.college || {}
  );

  const [filterState, setFilterState] = useState("");
  const [filterDistrict, setFilterDistrict] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCollege, setEditingCollege] = useState(null);

  useEffect(() => {
    dispatch(fetchStates());
    dispatch(fetchColleges());
  }, [dispatch]);

  const filteredColleges = (adminColleges || []).filter((c) => {
    if (filterState && c.district?.state?._id !== filterState) return false;
    if (filterDistrict && c.district?._id !== filterDistrict) return false;
    if (filterStatus !== "All") {
      const isActiveFilter = filterStatus === "Active";
      if (c.isActive !== isActiveFilter) return false;
    }
    return true;
  });

  const activeCollegesCount = (adminColleges || []).filter((c) => c.isActive).length;

  const handleSaveCollege = (collegeData) => {
    if (editingCollege) {
      dispatch(editCollege({ id: collegeData.id, data: collegeData })).then(
        (res) => {
          if (!res.error) {
            setIsModalOpen(false);
            dispatch(fetchColleges());
          }
        },
      );
    } else {
      dispatch(addNewCollege(collegeData)).then((res) => {
        if (!res.error) {
          setIsModalOpen(false);
          dispatch(fetchColleges());
        }
      });
    }
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this college?")) {
      dispatch(deleteCollege(id)).then((res) => {
        if (res.error) alert(res.payload);
      });
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Colleges Directory</h1>
        <button
          onClick={() => {
            setEditingCollege(null);
            setIsModalOpen(true);
          }}
          className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 text-sm font-medium"
        >
          <Plus size={18} /> Add New College
        </button>
      </div>

      <CollegeFilters
        states={states}
        filterState={filterState} setFilterState={setFilterState}
        filterDistrict={filterDistrict} setFilterDistrict={setFilterDistrict}
        filterStatus={filterStatus} setFilterStatus={setFilterStatus}
      />

      <div className="grid grid-cols-2 gap-3 md:gap-6">
        <StatCard title="Total Colleges" value={adminColleges.length} icon={School} color="bg-blue-500" />
        <StatCard title="Active Colleges" value={activeCollegesCount} icon={CheckCircle} color="bg-green-500" />
      </div>

      <CollegesTable
        colleges={filteredColleges}
        isLoading={isLoading}
        onToggleStatus={(id) => dispatch(toggleCollegeStatus(id))}
        onEdit={(college) => {
          setEditingCollege(college);
          setIsModalOpen(true);
        }}
        onDelete={handleDelete}
      />

      <CollegeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveCollege}
        editingData={editingCollege}
        states={states}
        isActionLoading={isActionLoading}
      />
    </div>
  );
};
export default Colleges;