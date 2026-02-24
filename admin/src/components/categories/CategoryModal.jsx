import React, { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { X, Camera, Loader2 } from 'lucide-react';
import { createCategory, updateCategory } from '../../store/categorySlice';

const CategoryModal = ({ isOpen, onClose, editingCategory }) => {
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);

  const [name, setName] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editingCategory) {
      setName(editingCategory.name);
      setImagePreview(editingCategory.image || null);
      setImageFile(null); 
    } else {
      setName('');
      setImageFile(null);
      setImagePreview(null);
    }
  }, [editingCategory, isOpen]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('name', name);
    if (imageFile) formData.append('image', imageFile);

    try {
      if (editingCategory) {
        await dispatch(updateCategory({ id: editingCategory._id, formData })).unwrap();
      } else {
        await dispatch(createCategory(formData)).unwrap();
      }
      onClose();
    } catch (error) {
      console.error("Submission failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden animate-in zoom-in-95 duration-200">
        
        <div className="flex justify-between items-center p-5 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-800">{editingCategory ? 'Edit Category' : 'Add New Category'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 bg-gray-100 p-1.5 rounded-full transition-colors"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          
          <div className="flex flex-col items-center justify-center gap-3">
            <div 
              onClick={() => fileInputRef.current.click()} 
              className="w-24 h-24 rounded-2xl bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors overflow-hidden relative group shadow-sm"
            >
              {imagePreview ? (
                <>
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="text-white" size={24} />
                  </div>
                </>
              ) : (
                <div className="text-gray-400 flex flex-col items-center"><Camera size={24} /><span className="text-[10px] mt-1 font-bold uppercase tracking-wider">Upload</span></div>
              )}
            </div>
            <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" className="hidden" />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">Category Name</label>
            <input 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              placeholder="e.g. Fast Food, Beverages" 
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all"
              required 
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors">Cancel</button>
            <button type="submit" disabled={isSubmitting || !name.trim()} className="flex-1 px-4 py-2.5 rounded-xl font-bold text-white bg-primary hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2">
              {isSubmitting && <Loader2 size={16} className="animate-spin"/>}
              {editingCategory ? 'Save Changes' : 'Create Category'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default CategoryModal;