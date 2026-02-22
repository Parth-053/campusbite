import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Building, CheckCircle, Plus } from "lucide-react";

import { fetchStates } from "../store/locationSlice.js";
import { fetchColleges } from "../store/collegeSlice.js";  
import {
  fetchHostels,
  addNewHostel,
  editHostel,
  deleteHostel,
  toggleHostelStatus,
} from "../store/hostelSlice.js";

import StatCard from "../components/dashboard/StatCard";
import HostelFilters from "../components/hostels/HostelFilters";
import HostelModal from "../components/hostels/HostelModal";
import HostelsTable from "../components/hostels/HostelsTable";

const Hostels = () => {
  const dispatch = useDispatch();

  const { states } = useSelector((state) => state.location);
  const { adminColleges = [] } = useSelector((state) => state.college || {});  

  const { hostels = [], isLoading, isActionLoading } = useSelector(
    (state) => state.hostel || {}
  );

  const [filterState, setFilterState] = useState("");
  const [filterDistrict, setFilterDistrict] = useState("");
  const [filterCollege, setFilterCollege] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHostel, setEditingHostel] = useState(null);

  useEffect(() => {
    dispatch(fetchStates());  
    dispatch(fetchColleges()); 
    dispatch(fetchHostels());  
  }, [dispatch]);

  const filteredHostels = hostels.filter((h) => {
    if (filterState && h.college?.district?.state?._id !== filterState) return false;
    if (filterDistrict && h.college?.district?._id !== filterDistrict) return false;
    if (filterCollege && h.college?._id !== filterCollege) return false;
    if (filterStatus !== "All") {
      const isActiveFilter = filterStatus === "Active";
      if (h.isActive !== isActiveFilter) return false;
    }
    return true;
  });

  const activeHostelsCount = hostels.filter((h) => h.isActive).length;

  const handleSaveHostel = (hostelData) => {
    if (editingHostel) {
      dispatch(editHostel({ id: hostelData.id, data: hostelData })).then((res) => {
          if (!res.error) { setIsModalOpen(false); dispatch(fetchHostels()); }
      });
    } else {
      dispatch(addNewHostel(hostelData)).then((res) => {
        if (!res.error) { setIsModalOpen(false); dispatch(fetchHostels()); }
      });
    }
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this hostel?")) {
      dispatch(deleteHostel(id)).then((res) => {
        if (res.error) alert(res.payload);
      });
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Hostels Directory</h1>
        <button onClick={() => { setEditingHostel(null); setIsModalOpen(true); }} className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2">
          <Plus size={18} /> Add Hostel
        </button>
      </div>

      <HostelFilters
        states={states}
        adminColleges={adminColleges} // 👈 PASS TO FILTERS
        filterState={filterState} setFilterState={setFilterState}
        filterDistrict={filterDistrict} setFilterDistrict={setFilterDistrict}
        filterCollege={filterCollege} setFilterCollege={setFilterCollege}
        filterStatus={filterStatus} setFilterStatus={setFilterStatus}
      />

      <div className="grid grid-cols-2 gap-4">
        <StatCard title="Total Hostels" value={hostels.length} icon={Building} color="bg-orange-500" />
        <StatCard title="Active Hostels" value={activeHostelsCount} icon={CheckCircle} color="bg-green-500" />
      </div>

      <HostelsTable
        hostels={filteredHostels} isLoading={isLoading}
        onToggleStatus={(id) => dispatch(toggleHostelStatus(id))}
        onEdit={(hostel) => { setEditingHostel(hostel); setIsModalOpen(true); }}
        onDelete={handleDelete}
      />

      <HostelModal
        isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}
        onSave={handleSaveHostel} editingData={editingHostel}
        states={states} adminColleges={adminColleges}  
        isActionLoading={isActionLoading}
      />
    </div>
  );
};
export default Hostels;