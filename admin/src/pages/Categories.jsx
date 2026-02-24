import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { LayoutGrid, Plus } from 'lucide-react';
import { fetchCategories } from '../store/categorySlice';
import CategoriesTable from '../components/categories/CategoriesTable';
import CategoryModal from '../components/categories/CategoryModal';
import StatCard from '../components/dashboard/StatCard';

const Categories = () => {
  const dispatch = useDispatch();
  const { categories, isLoading } = useSelector((state) => state.category);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleOpenAdd = () => {
    setEditingCategory(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (category) => {
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  const activeCount = categories.filter(c => c.isActive).length;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Global Categories</h1>
          <p className="text-sm text-slate-500 mt-1">Manage master food categories for all canteens.</p>
        </div>
        <button onClick={handleOpenAdd} className="bg-primary text-white px-5 py-2.5 rounded-xl font-bold hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-sm">
          <Plus size={18} /> Add Category
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <StatCard title="Total Categories" value={categories.length} icon={LayoutGrid} color="bg-indigo-500" />
        <StatCard title="Active Categories" value={activeCount} icon={LayoutGrid} color="bg-green-500" />
      </div>

      <CategoriesTable 
        categories={categories} 
        isLoading={isLoading} 
        onEdit={handleOpenEdit} 
      />

      <CategoryModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        editingCategory={editingCategory} 
      />

    </div>
  );
};

export default Categories;