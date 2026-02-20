import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Plus, Power, Edit2, Trash2, Filter } from 'lucide-react';
import { fetchMenuItems, toggleAvailability, deleteItem, setMenuFilter } from '../../store/menuSlice';
import Skeleton from '../../components/common/Skeleton';

// --- Helper Components Defined OUTSIDE ---

const LoadingSkeleton = () => (
  <div className="flex justify-between items-center p-4 bg-white border-b border-slate-100 last:border-0">
    <div className="space-y-2">
      <Skeleton className="w-32 h-5 rounded" />
      <Skeleton className="w-20 h-4 rounded" />
    </div>
    <Skeleton className="w-16 h-8 rounded" />
  </div>
);

const StatusBadge = ({ available }) => (
  <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
    {available ? 'Available' : 'Sold Out'}
  </span>
);

const MobileMenuCard = ({ item, onToggle, onEdit, onDelete }) => (
  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex justify-between items-start">
    <div>
      <h4 className="font-bold text-slate-800">{item.name}</h4>
      <p className="text-sm text-slate-500">{item.category} • ₹{item.price}</p>
      <div className="mt-2">
        <StatusBadge available={item.available} />
      </div>
    </div>
    <div className="flex gap-2">
      <button 
        onClick={() => onToggle(item.id)}
        className={`p-2 rounded-lg transition-colors ${item.available ? 'bg-green-50 text-green-600 hover:bg-green-100' : 'bg-red-50 text-red-600 hover:bg-red-100'}`}
      >
        <Power size={18} />
      </button>
      <button onClick={() => onEdit(item.id)} className="p-2 bg-slate-50 text-slate-600 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors">
        <Edit2 size={18} />
      </button>
      <button onClick={() => onDelete(item.id)} className="p-2 bg-slate-50 text-slate-600 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors">
        <Trash2 size={18} />
      </button>
    </div>
  </div>
);

const DesktopTableRow = ({ item, onToggle, onEdit, onDelete }) => (
  <tr className="border-b border-slate-100 hover:bg-slate-50 transition-colors last:border-0">
    <td className="p-4 font-medium text-slate-800">{item.name}</td>
    <td className="p-4 text-slate-600">{item.category}</td>
    <td className="p-4 font-bold text-slate-700">₹{item.price}</td>
    <td className="p-4"><StatusBadge available={item.available} /></td>
    <td className="p-4 flex gap-2">
      <button 
        onClick={() => onToggle(item.id)}
        className={`p-2 rounded-lg transition-colors ${item.available ? 'text-green-600 hover:bg-green-50' : 'text-red-600 hover:bg-red-50'}`}
        title="Toggle Status"
      >
        <Power size={18} />
      </button>
      <button 
        onClick={() => onEdit(item.id)}
        className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
        title="Edit"
      >
        <Edit2 size={18} />
      </button>
      <button 
        onClick={() => onDelete(item.id)}
        className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        title="Delete"
      >
        <Trash2 size={18} />
      </button>
    </td>
  </tr>
);

// --- Main Component ---

const MenuManagement = () => {
  const { items, isLoading, filter } = useSelector(state => state.menu);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchMenuItems());
  }, [dispatch]);

  // Handlers
  const handleToggle = (id) => dispatch(toggleAvailability(id));
  const handleDelete = (id) => dispatch(deleteItem(id));
  const handleEdit = (id) => navigate(`/menu/edit/${id}`);

  // Filter Logic
  const filteredItems = items.filter(item => {
    if (filter === 'Available') return item.available;
    if (filter === 'Sold Out') return !item.available;
    return true;
  });

  return (
    <div className="space-y-6 pb-20 md:pb-0">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-200">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Menu</h2>
          <p className="text-sm text-slate-500">Manage your items and prices.</p>
        </div>
        
        <div className="flex gap-3 w-full sm:w-auto">
          {/* Filter Dropdown */}
          <div className="relative flex-1 sm:flex-none">
            <select 
              className="w-full appearance-none bg-slate-50 border border-slate-200 text-slate-700 py-2.5 pl-4 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 font-medium"
              value={filter}
              onChange={(e) => dispatch(setMenuFilter(e.target.value))}
            >
              <option value="All">All Items</option>
              <option value="Available">Available Only</option>
              <option value="Sold Out">Sold Out Only</option>
            </select>
            <Filter size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>

          <button 
            onClick={() => navigate('/menu/add')}
            className="btn-primary flex items-center justify-center gap-2 px-4 py-2.5 whitespace-nowrap"
          >
            <Plus size={20} /> <span className="hidden sm:inline">Add Item</span>
          </button>
        </div>
      </div>

      {/* Content Area */}
      {isLoading ? (
        <div className="space-y-4">
           {[...Array(6)].map((_, i) => <LoadingSkeleton key={i} />)}
        </div>
      ) : filteredItems.length > 0 ? (
        <>
          {/* Mobile View */}
          <div className="md:hidden grid grid-cols-1 gap-4">
            {filteredItems.map(item => (
              <MobileMenuCard 
                key={item.id} 
                item={item} 
                onToggle={handleToggle} 
                onEdit={handleEdit} 
                onDelete={handleDelete} 
              />
            ))}
          </div>

          {/* Desktop View */}
          <div className="hidden md:block bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-4">Item Name</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredItems.map(item => (
                  <DesktopTableRow 
                    key={item.id} 
                    item={item} 
                    onToggle={handleToggle} 
                    onEdit={handleEdit} 
                    onDelete={handleDelete} 
                  />
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <div className="text-center py-12 text-slate-400">
          <p>No items found.</p>
        </div>
      )}
    </div>
  );
};

export default MenuManagement;