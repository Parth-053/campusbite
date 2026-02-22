import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { X } from "lucide-react";
import { fetchDistricts, clearDistricts, fetchPublicHostels, clearPublicHostels } from "../../store/locationSlice.js";

const ModalForm = ({ onSave, states, adminColleges = [], isActionLoading, editingData }) => {
  const dispatch = useDispatch();
  const { districts, publicHostels } = useSelector((state) => state.location);

  const [newState, setNewState] = useState(editingData?.college?.district?.state?._id || "");
  const [newDistrict, setNewDistrict] = useState(editingData?.college?.district?._id || "");
  const [newCollege, setNewCollege] = useState(editingData?.college?._id || "");
  
  // SIMPLIFIED SCHEMA FIELDS
  const [newType, setNewType] = useState(editingData?.canteenType || "central");
  const [newHostel, setNewHostel] = useState(editingData?.hostel?._id || "");
  const [newName, setNewName] = useState(editingData?.name || "");
  const [newGstin, setNewGstin] = useState(editingData?.gstin || "");
  
  // Status
  const [newStatus, setNewStatus] = useState(editingData ? (editingData.isActive ? "Active" : "Inactive") : "Active");

  const isEditMode = !!editingData;

  useEffect(() => {
    if (newState) { dispatch(fetchDistricts(newState)); } 
    else { dispatch(clearDistricts()); }
  }, [newState, dispatch]);

  useEffect(() => {
    if (newCollege) { dispatch(fetchPublicHostels(newCollege)); } 
    else { dispatch(clearPublicHostels()); }
  }, [newCollege, dispatch]);

  const availableColleges = adminColleges.filter((c) => c.district?._id === newDistrict);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newCollege || !newName) {
      return alert("Please fill all required fields");
    }
    if (newType === 'hostel' && !newHostel) {
      return alert("Please select a linked Hostel");
    }

    onSave({
      id: editingData?._id,
      name: newName,
      college: newCollege,
      canteenType: newType,
      hostel: newType === 'hostel' ? newHostel : null,
      gstin: newGstin,
      isActive: newStatus === "Active",
    });
  };

  return (
    <div className="p-6 md:p-8 max-h-[85vh] overflow-y-auto custom-scrollbar">
      <h3 className="text-xl font-bold text-gray-800 mb-6 border-b pb-3">
        {isEditMode ? "Edit Canteen Details" : "Register New Canteen"}
      </h3>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">State *</label>
          <select value={newState} onChange={(e) => { setNewState(e.target.value); setNewDistrict(""); setNewCollege(""); setNewHostel(""); }} className="w-full border border-gray-300 p-2.5 rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none" required>
            <option value="">Select State</option>
            {states.map((s) => (<option key={s._id} value={s._id}>{s.name}</option>))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">District *</label>
          <select value={newDistrict} onChange={(e) => { setNewDistrict(e.target.value); setNewCollege(""); setNewHostel(""); }} className="w-full border border-gray-300 p-2.5 rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none disabled:bg-gray-50" required disabled={!newState}>
            <option value="">Select District</option>
            {districts.map((d) => (<option key={d._id} value={d._id}>{d.name}</option>))}
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Linked College *</label>
          <select value={newCollege} onChange={(e) => { setNewCollege(e.target.value); setNewHostel(""); }} className="w-full border border-gray-300 p-2.5 rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none disabled:bg-gray-50" required disabled={!newDistrict}>
            <option value="">Select College</option>
            {availableColleges.map((c) => (<option key={c._id} value={c._id}>{c.name}</option>))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Canteen Type *</label>
          <select value={newType} onChange={(e) => { setNewType(e.target.value); setNewHostel(""); }} className="w-full border border-gray-300 p-2.5 rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none" required>
            <option value="central">Central Canteen (For everyone)</option>
            <option value="hostel">Hostel Canteen (Specific Hostel)</option>
          </select>
        </div>

        {newType === 'hostel' && (
          <div className="md:col-span-2 p-3 bg-orange-50 border border-orange-200 rounded-lg">
            <label className="block text-xs font-bold text-orange-800 uppercase mb-1">Select Linked Hostel *</label>
            <select value={newHostel} onChange={(e) => setNewHostel(e.target.value)} className="w-full border-orange-300 p-2.5 rounded-lg text-sm focus:ring-orange-500 bg-white" required={newType === 'hostel'} disabled={!newCollege}>
              <option value="">Select Hostel</option>
              {publicHostels?.map((h) => (<option key={h._id} value={h._id}>{h.name}</option>))}
            </select>
          </div>
        )}

        <div className="md:col-span-2">
          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Canteen Name *</label>
          <input type="text" placeholder="E.g., Engineering Cafe" value={newName} onChange={(e) => setNewName(e.target.value)} className="w-full border border-gray-300 p-2.5 rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none" required />
        </div>

        <div className="md:col-span-2">
          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">GSTIN Number (Optional)</label>
          <input type="text" placeholder="Enter GSTIN if available" value={newGstin} onChange={(e) => setNewGstin(e.target.value)} className="w-full border border-gray-300 p-2.5 rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none" />
        </div>

        {/* SUBMIT ROW */}
        <div className="md:col-span-2 flex flex-col sm:flex-row justify-between items-center gap-4 mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200 w-full sm:w-auto">
            <span className="text-xs font-bold text-gray-600">Admin Status:</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" checked={newStatus === "Active"} onChange={(e) => setNewStatus(e.target.checked ? "Active" : "Inactive")} />
              <div className="w-7 h-4 bg-gray-300 rounded-full peer peer-checked:bg-green-500 peer-checked:after:translate-x-full after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all"></div>
            </label>
          </div>

          <button type="submit" disabled={isActionLoading} className="w-full sm:w-auto bg-primary text-white px-8 py-2.5 rounded-lg text-sm font-bold hover:bg-indigo-700 disabled:opacity-70 transition-colors">
            {isActionLoading ? "Saving..." : isEditMode ? "Update Canteen" : "Save Canteen"}
          </button>
        </div>
      </form>
    </div>
  );
};

const CanteenModal = ({ isOpen, onClose, onSave, states, adminColleges, isActionLoading, editingData }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl relative animate-in zoom-in-95 duration-200">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors z-10">
          <X size={20} />
        </button>
        <ModalForm key={editingData ? editingData._id : "new-canteen"} onSave={onSave} states={states} adminColleges={adminColleges} isActionLoading={isActionLoading} editingData={editingData} />
      </div>
    </div>
  );
};

export default CanteenModal;