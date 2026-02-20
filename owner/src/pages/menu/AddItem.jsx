import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addItem } from '../../store/menuSlice';
import { ArrowLeft } from 'lucide-react';

const AddItem = () => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: 'Food', 
    available: true
  });
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(addItem({ ...formData, id: `m${Date.now()}` }));
    navigate('/menu');
  };

  return (
    <div className="max-w-2xl mx-auto pb-20">
      <button onClick={() => navigate('/menu')} className="flex items-center text-slate-500 hover:text-slate-800 mb-6 font-medium">
        <ArrowLeft size={20} className="mr-1" /> Back to Menu
      </button>
      
      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200">
        <h2 className="text-2xl font-bold text-slate-800 mb-6">Add New Item</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Name */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Item Name</label>
            <input 
              type="text" required 
              className="input-field" 
              placeholder="e.g. Cheese Sandwich"
              value={formData.name} 
              onChange={e => setFormData({...formData, name: e.target.value})} 
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Price */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Price (₹)</label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-slate-400 font-bold">₹</span>
                <input 
                  type="number" required 
                  className="input-field pl-8" 
                  placeholder="00"
                  value={formData.price} 
                  onChange={e => setFormData({...formData, price: Number(e.target.value)})} 
                />
              </div>
            </div>

            {/* Category */}
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

          {/* Availability Toggle */}
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
            <div>
              <p className="font-bold text-slate-700">Available Immediately</p>
              <p className="text-xs text-slate-500">Enable this if the item is in stock.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer"
                checked={formData.available}
                onChange={e => setFormData({...formData, available: e.target.checked})}
              />
              <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:bg-primary peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-100 transition-all after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full peer-checked:after:border-white"></div>
            </label>
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-4">
            <button type="button" onClick={() => navigate('/menu')} className="btn-secondary w-full py-3">Cancel</button>
            <button type="submit" className="btn-primary w-full py-3">Save Item</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddItem;