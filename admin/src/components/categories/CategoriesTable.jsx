import React from 'react';
import { useDispatch } from 'react-redux';
import { Edit, Trash2, LayoutGrid, Image as ImageIcon } from 'lucide-react';
import { deleteCategory, toggleCategoryStatus } from '../../store/categorySlice';
import Skeleton from '../common/Skeleton';

const CategoriesTable = ({ categories, isLoading, onEdit }) => {
  const dispatch = useDispatch();

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this category? The image will also be removed from the server.")) {
      dispatch(deleteCategory(id));
    }
  };

  const handleToggle = (id) => {
    dispatch(toggleCategoryStatus(id));
  };

  if (isLoading) return <Skeleton className="w-full h-64 rounded-xl" />;

  if (categories.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center">
        <LayoutGrid className="mx-auto h-12 w-12 text-slate-300 mb-3" />
        <p className="text-slate-500 font-medium">No global categories found.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-xs font-bold">
            <tr>
              <th className="px-6 py-4 w-20">Image</th>
              <th className="px-6 py-4">Category Name</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {categories.map((cat) => (
              <tr key={cat._id} className="hover:bg-slate-50 transition-colors">
                
                <td className="px-6 py-3">
                  <div className="w-12 h-12 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden shrink-0">
                    {cat.image ? (
                      <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon size={20} className="text-slate-300" />
                    )}
                  </div>
                </td>
                
                <td className="px-6 py-3 font-bold text-slate-800 text-base">{cat.name}</td>
                
                <td className="px-6 py-3">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked={cat.isActive} onChange={() => handleToggle(cat._id)} />
                    <div className="w-9 h-5 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-500"></div>
                  </label>
                </td>
                
                <td className="px-6 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button onClick={() => onEdit(cat)} className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"><Edit size={16} /></button>
                    <button onClick={() => handleDelete(cat._id)} className="p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"><Trash2 size={16} /></button>
                  </div>
                </td>
                
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CategoriesTable;