import React, { useState } from 'react';
import { X } from 'lucide-react';

// --- Sub-component: Manages state without useEffect ---
const ModalForm = ({ onSave, states, districtsMap, isActionLoading, editingData }) => {
  // State is initialized directly from props. It automatically resets because of the `key` prop in the parent.
  const [newState, setNewState] = useState(editingData?.state || '');
  const [newDistrict, setNewDistrict] = useState(editingData?.district || '');
  const [newName, setNewName] = useState(editingData?.name || '');
  const [newStatus, setNewStatus] = useState(editingData?.status || 'Active');

  const isEditMode = !!editingData;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newState || !newDistrict || !newName) return alert("Please fill all required fields");
    
    onSave({
      id: editingData?.id, // Passing ID matters for edits
      name: newName,
      state: newState,
      district: newDistrict,
      status: newStatus
    });
  };

  return (
    <div className="p-6 md:p-8">
      <h3 className="text-xl font-bold text-gray-800 mb-6 border-b pb-3">
        {isEditMode ? 'Edit College Details' : 'Register New College'}
      </h3>
      
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Country */}
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Country</label>
          <input type="text" value="India" disabled className="w-full border border-gray-200 bg-gray-50 text-gray-500 p-2.5 rounded-lg text-sm cursor-not-allowed" />
        </div>

        {/* State */}
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">State *</label>
          <select 
            value={newState} 
            onChange={(e) => { setNewState(e.target.value); setNewDistrict(''); }} 
            className="w-full border border-gray-300 p-2.5 rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none"
            required
          >
            <option value="">Select State</option>
            {states.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        {/* District */}
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">District *</label>
          <select 
            value={newDistrict} 
            onChange={(e) => setNewDistrict(e.target.value)} 
            className="w-full border border-gray-300 p-2.5 rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none disabled:bg-gray-50"
            required
            disabled={!newState}
          >
            <option value="">Select District</option>
            {newState && districtsMap[newState]?.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>

        {/* College Name */}
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">College Name *</label>
          <input 
            type="text" 
            placeholder="E.g., Tech Institute" 
            value={newName} 
            onChange={(e) => setNewName(e.target.value)} 
            className="w-full border border-gray-300 p-2.5 rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none"
            required 
          />
        </div>

        {/* Status & Submit */}
        <div className="md:col-span-2 flex flex-col sm:flex-row justify-between items-center gap-4 mt-4 pt-4 border-t">
          <div className="flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-lg border border-gray-200 w-full sm:w-auto">
            <span className="text-sm font-bold text-gray-600">Status:</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" checked={newStatus === 'Active'} onChange={(e) => setNewStatus(e.target.checked ? 'Active' : 'Inactive')} />
              <div className="w-9 h-5 bg-gray-300 rounded-full peer peer-checked:bg-green-500 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
            </label>
          </div>
          
          <button 
            type="submit" 
            disabled={isActionLoading}
            className="w-full sm:w-auto bg-primary text-white px-8 py-2.5 rounded-lg text-sm font-bold hover:bg-indigo-700 disabled:opacity-70 transition-colors"
          >
            {isActionLoading ? 'Saving...' : (isEditMode ? 'Update College' : 'Save College')}
          </button>
        </div>
      </form>
    </div>
  );
};

// --- Main Modal Wrapper ---
const CollegeModal = ({ isOpen, onClose, onSave, states, districtsMap, isActionLoading, editingData }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl relative animate-in zoom-in-95 duration-200">
        
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors z-10"
        >
          <X size={20} />
        </button>

        {/* The 'key' prop ensures the form completely resets if editingData changes */}
        <ModalForm 
          key={editingData ? editingData.id : 'new-college'}
          onSave={onSave}
          states={states}
          districtsMap={districtsMap}
          isActionLoading={isActionLoading}
          editingData={editingData}
        />

      </div>
    </div>
  );
};

export default CollegeModal;