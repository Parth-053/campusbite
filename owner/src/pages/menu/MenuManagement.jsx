import React, { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  fetchMenuItems, fetchCategories, toggleAvailability, 
  deleteMenuItem, optimisticToggle, optimisticDelete, 
  addMenuItem, updateMenuItem 
} from '../../store/menuSlice';
import Skeleton from '../../components/common/Skeleton';
import { Search, Plus, Edit2, Trash2, Image as ImageIcon, X, Loader2, ListOrdered, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

const MenuManagement = () => {
  const dispatch = useDispatch();
  const { items, categories, isLoading, isActionLoading } = useSelector(state => state.menu);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('All');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('All');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({ name: '', price: '', category: '', isNonVeg: false, image: null });
  const [preview, setPreview] = useState(null);
 
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);
 
  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(fetchMenuItems({
        search: searchTerm,
        type: activeTab,
        category: selectedCategoryFilter
      }));
    }, 400);  

    return () => clearTimeout(timer);
  }, [searchTerm, activeTab, selectedCategoryFilter, dispatch]);

  const handleToggle = (id) => {
    dispatch(optimisticToggle(id)); 
    dispatch(toggleAvailability(id)); 
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to completely delete this item?")) {
      dispatch(optimisticDelete(id)); 
      dispatch(deleteMenuItem(id));
    }
  };

  const openModal = (item = null) => {
    if (item) {
      setEditItem(item);
      setFormData({ name: item.name, price: item.price, category: item.category?._id || '', isNonVeg: item.isNonVeg, image: null });
      setPreview(item.image);
    } else {
      setEditItem(null);
      setFormData({ name: '', price: '', category: '', isNonVeg: false, image: null });
      setPreview(null);
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.category) return toast.error("Please select a valid Category!");

    const data = new FormData();
    data.append('name', formData.name);
    data.append('price', formData.price);
    data.append('category', formData.category);
    data.append('isNonVeg', formData.isNonVeg);
    if (formData.image) data.append('image', formData.image);

    try {
      if (editItem) {
        await dispatch(updateMenuItem({ id: editItem._id, formData: data })).unwrap();
      } else {
        await dispatch(addMenuItem(data)).unwrap();
      }
      setIsModalOpen(false); 
    } catch (error) {
      toast.error(error || "Action failed");
    }
  };

  const isFilterApplied = searchTerm !== '' || activeTab !== 'All' || selectedCategoryFilter !== 'All';
  const clearFilters = () => {
    setSearchTerm('');
    setActiveTab('All');
    setSelectedCategoryFilter('All');
  };
 
  const totalItemsCount = items.length;
  const availableItemsCount = items.filter(i => i.isAvailable).length;

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-20 md:pb-0">
      
      {/* 1. Header Actions (Search & Add Button) */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-surface p-4 sm:p-5 rounded-2xl border border-borderCol shadow-sm">
        <div className="relative w-full sm:w-72 shrink-0">
          <Search className="absolute left-3 top-2.5 text-textLight" size={18} />
          <input 
            type="text" 
            placeholder="Search in backend..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-background border border-borderCol rounded-xl focus:ring-2 focus:ring-primary outline-none text-sm text-textDark"
          />
        </div>
        <button onClick={() => openModal()} className="w-full sm:w-auto bg-primary text-white px-5 py-2.5 rounded-xl font-bold hover:bg-primary-dark transition-colors flex items-center justify-center gap-2 shadow-md">
          <Plus size={18} /> Add New Item
        </button>
      </div>

      {/*  2. Dynamic Stats Row */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-surface border border-borderCol rounded-2xl p-4 sm:p-5 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-primary/10 text-primary rounded-xl shrink-0"><ListOrdered size={24} /></div>
          <div>
            <p className="text-xs sm:text-sm font-bold text-textLight uppercase tracking-wide">Total Items</p>
            <h3 className="text-2xl sm:text-3xl font-black text-textDark">{totalItemsCount}</h3>
          </div>
        </div>
        <div className="bg-surface border border-borderCol rounded-2xl p-4 sm:p-5 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-success/10 text-success rounded-xl shrink-0"><CheckCircle2 size={24} /></div>
          <div>
            <p className="text-xs sm:text-sm font-bold text-textLight uppercase tracking-wide">Available</p>
            <h3 className="text-2xl sm:text-3xl font-black text-textDark">{availableItemsCount}</h3>
          </div>
        </div>
      </div>

      {/* 3. Advanced Filter Row */}
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4">
        <div className="flex bg-surface border border-borderCol rounded-xl p-1 w-full sm:w-fit shadow-sm">
          {['All', 'Veg', 'Non-Veg'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`flex-1 sm:px-6 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === tab ? 'bg-background text-primary shadow-sm border border-borderCol' : 'text-textLight hover:text-textDark'}`}>
              {tab}
            </button>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/*  Clear Filters Button */}
          {isFilterApplied && (
            <button onClick={clearFilters} className="text-error bg-error/10 hover:bg-error/20 px-4 py-2.5 rounded-xl text-sm font-bold transition-colors flex items-center justify-center gap-1.5 shrink-0">
              <X size={16}/> Clear Filters
            </button>
          )}

          <div className="relative w-full sm:w-64 shrink-0">
            <select
              value={selectedCategoryFilter}
              onChange={(e) => setSelectedCategoryFilter(e.target.value)}
              className="appearance-none w-full bg-surface border border-borderCol text-textDark text-sm font-bold rounded-xl px-4 py-2.5 pr-10 outline-none focus:ring-2 focus:ring-primary focus:border-primary cursor-pointer shadow-sm"
            >
              <option value="All">All Categories</option>
              {categories.map(c => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-textLight">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Item List View */}
      <div className="bg-surface border border-borderCol rounded-2xl shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-4 space-y-4">
            {[1,2,3,4].map(i => <Skeleton key={i} className="w-full h-20 rounded-xl" />)}
          </div>
        ) : items.length === 0 ? (
          <div className="p-10 flex flex-col items-center justify-center text-center text-textLight">
             <Search size={40} className="opacity-20 mb-3" />
             <p className="font-medium text-sm">No items found for the selected filters.</p>
          </div>
        ) : (
          <div className="divide-y divide-borderCol">
            {items.map((item) => (
              <div key={item._id} className="p-4 hover:bg-background/50 transition-colors flex items-center justify-between gap-4">
                
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-background border border-borderCol shrink-0 overflow-hidden flex items-center justify-center">
                    {item.image ? <img src={item.image} alt={item.name} className="w-full h-full object-cover" /> : <ImageIcon className="text-textLight opacity-50" size={24} />}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <div className={`w-4 h-4 border-2 flex items-center justify-center shrink-0 ${item.isNonVeg ? 'border-error' : 'border-success'}`}>
                        <div className={`w-2 h-2 rounded-full ${item.isNonVeg ? 'bg-error' : 'bg-success'}`}></div>
                      </div>
                      <h3 className="font-bold text-textDark text-sm sm:text-base truncate">{item.name}</h3>
                    </div>
                    <p className="text-xs text-textLight font-medium mb-1 truncate">{item.category?.name || 'Uncategorized'}</p>
                    <p className="font-black text-primary text-sm">₹{item.price}</p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-end sm:items-center gap-3 sm:gap-6 shrink-0">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <span className={`text-[10px] font-bold ${item.isAvailable ? 'text-success' : 'text-error'}`}>{item.isAvailable ? 'IN STOCK' : 'OUT'}</span>
                    <div className={`w-10 h-6 rounded-full p-1 transition-colors ${item.isAvailable ? 'bg-success' : 'bg-borderCol'}`}>
                       <input type="checkbox" className="hidden" checked={item.isAvailable} onChange={() => handleToggle(item._id)} />
                       <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${item.isAvailable ? 'translate-x-4' : 'translate-x-0'}`}></div>
                    </div>
                  </label>

                  <div className="flex items-center gap-2 border-t sm:border-t-0 sm:border-l border-borderCol pt-2 sm:pt-0 sm:pl-4">
                    <button onClick={() => openModal(item)} className="p-2 text-textLight hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"><Edit2 size={18} /></button>
                    <button onClick={() => handleDelete(item._id)} className="p-2 text-textLight hover:text-error hover:bg-error/10 rounded-lg transition-colors"><Trash2 size={18} /></button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

      {/* 5. Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-surface w-full max-w-lg rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh] relative">
            
            {isActionLoading && (
              <div className="absolute inset-0 z-50 bg-surface/80 backdrop-blur-sm flex flex-col items-center justify-center rounded-2xl">
                <Loader2 className="w-12 h-12 text-primary animate-spin mb-3" />
                <p className="text-lg font-bold text-textDark tracking-tight">Saving Details...</p>
                <p className="text-xs text-textLight mt-1 font-medium">Please wait, do not close the window.</p>
              </div>
            )}

            <div className="px-6 py-4 border-b border-borderCol flex justify-between items-center bg-background">
              <h3 className="font-bold text-lg text-textDark">{editItem ? 'Edit Item' : 'Add New Item'}</h3>
              <button 
                onClick={() => !isActionLoading && setIsModalOpen(false)} 
                disabled={isActionLoading}
                className="text-textLight hover:text-error disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <X size={20}/>
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 overflow-y-auto custom-scrollbar space-y-4">
              
              <div className={`flex flex-col items-center justify-center border-2 border-dashed border-borderCol rounded-xl p-4 bg-background transition-colors ${isActionLoading ? 'opacity-50 cursor-not-allowed' : 'hover:border-primary cursor-pointer'}`} onClick={() => !isActionLoading && fileInputRef.current?.click()}>
                {preview ? (
                   <img src={preview} alt="Preview" className="h-32 object-contain rounded-lg" />
                ) : (
                  <div className="text-center text-textLight">
                    <ImageIcon className="mx-auto mb-2 opacity-50" size={32} />
                    <p className="text-sm font-semibold">Click to upload image</p>
                  </div>
                )}
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" disabled={isActionLoading} onChange={(e) => {
                  const file = e.target.files[0];
                  if(file) { setFormData({...formData, image: file}); setPreview(URL.createObjectURL(file)); }
                }}/>
              </div>

              <div>
                <label className="block text-sm font-bold text-textDark mb-1">Item Name</label>
                <input type="text" required disabled={isActionLoading} value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2.5 bg-background border border-borderCol rounded-xl focus:ring-2 focus:ring-primary outline-none disabled:opacity-60" placeholder="e.g. Aloo Tikki Burger" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-textDark mb-1">Price (₹)</label>
                  <input type="number" min="0" required disabled={isActionLoading} value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full px-4 py-2.5 bg-background border border-borderCol rounded-xl focus:ring-2 focus:ring-primary outline-none disabled:opacity-60" placeholder="0" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-textDark mb-1">Category</label>
                  <select required disabled={isActionLoading} value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full px-4 py-2.5 bg-background border border-borderCol rounded-xl focus:ring-2 focus:ring-primary outline-none disabled:opacity-60">
                    <option value="" disabled>Select Category</option>
                    {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-textDark mb-2">Dietary Type</label>
                <div className="flex gap-4">
                  <label className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border ${isActionLoading ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'} font-bold transition-all ${!formData.isNonVeg ? 'border-success bg-success/10 text-success' : 'border-borderCol bg-background text-textLight'}`}>
                    <input type="radio" name="diet" className="hidden" disabled={isActionLoading} checked={!formData.isNonVeg} onChange={() => setFormData({...formData, isNonVeg: false})} />
                    <div className="w-4 h-4 border-2 border-success flex items-center justify-center"><div className="w-2 h-2 bg-success rounded-full"></div></div> Veg
                  </label>
                  <label className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border ${isActionLoading ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'} font-bold transition-all ${formData.isNonVeg ? 'border-error bg-error/10 text-error' : 'border-borderCol bg-background text-textLight'}`}>
                    <input type="radio" name="diet" className="hidden" disabled={isActionLoading} checked={formData.isNonVeg} onChange={() => setFormData({...formData, isNonVeg: true})} />
                    <div className="w-4 h-4 border-2 border-error flex items-center justify-center"><div className="w-2 h-2 bg-error rounded-full"></div></div> Non-Veg
                  </label>
                </div>
              </div>

              <button type="submit" disabled={isActionLoading} className="w-full py-3.5 mt-4 bg-primary text-white font-bold rounded-xl shadow-md disabled:opacity-100 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                 Save Menu Item
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuManagement;