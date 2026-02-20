import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { updateItem } from '../../store/menuSlice'; // Adjusted import path if needed
import { ArrowLeft } from 'lucide-react';
import Skeleton from '../../components/common/Skeleton';

// --- Form Component (Only renders when data is ready) ---
const EditItemForm = ({ initialData }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Safe to use initial state here because this component 
  // only mounts when initialData is guaranteed to exist.
  const [formData, setFormData] = useState(initialData);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateItem(formData));
    navigate('/menu');
  };

  return (
    <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Edit Item</h2>
        <span className="text-xs text-slate-400 font-mono">ID: {formData.id}</span>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Item Name</label>
          <input 
            type="text" required 
            className="input-field" 
            value={formData.name} 
            onChange={e => setFormData({...formData, name: e.target.value})} 
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Price (₹)</label>
            <div className="relative">
              <span className="absolute left-3 top-3 text-slate-400 font-bold">₹</span>
              <input 
                type="number" required 
                className="input-field pl-8" 
                value={formData.price} 
                onChange={e => setFormData({...formData, price: Number(e.target.value)})} 
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Category</label>
            <select 
              className="input-field bg-white" 
              value={formData.category} 
              onChange={e => setFormData({...formData, category: e.target.value})}
            >
              <option value="Food">Food</option>
              <option value="Drink">Drink</option>
              <option value="Ice Cream">Ice Cream</option>
            </select>
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <button type="button" onClick={() => navigate('/menu')} className="btn-secondary w-full py-3">Cancel</button>
          <button type="submit" className="btn-primary w-full py-3">Update Item</button>
        </div>
      </form>
    </div>
  );
};

// --- Main Container Component ---
const EditItem = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { items, isLoading } = useSelector(state => state.menu);
  
  // Derive state immediately
  const itemToEdit = items.find(i => i.id === id);

  // 1. Loading State
  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto p-8">
        <Skeleton className="h-96 w-full rounded-2xl" />
      </div>
    );
  }

  // 2. Not Found / Redirect State
  if (!itemToEdit && items.length > 0) {
    // Using setTimeout to avoid render-time navigation warnings, 
    // or simply render a "Not Found" message.
    setTimeout(() => navigate('/menu'), 0);
    return null;
  }

  // 3. Waiting for data (e.g., initial load before fetch completes)
  if (!itemToEdit) {
    return (
      <div className="max-w-2xl mx-auto p-8">
        <Skeleton className="h-96 w-full rounded-2xl" />
      </div>
    );
  }

  // 4. Data Ready - Render Form
  return (
    <div className="max-w-2xl mx-auto pb-20">
      <button onClick={() => navigate('/menu')} className="flex items-center text-slate-500 hover:text-slate-800 mb-6 font-medium">
        <ArrowLeft size={20} className="mr-1" /> Back to Menu
      </button>
      
      {/* Key prop ensures component resets if ID changes */}
      <EditItemForm key={id} initialData={itemToEdit} />
    </div>
  );
};

export default EditItem;