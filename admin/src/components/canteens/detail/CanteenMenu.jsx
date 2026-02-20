import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateMenuItem } from '../../../store/canteenSlice';
import { Pencil, Check, X } from 'lucide-react';

const CanteenMenu = ({ canteen }) => {
  const dispatch = useDispatch();
  const [editingId, setEditingId] = useState(null);
  const [editPrice, setEditPrice] = useState('');

  const handleEdit = (item) => {
    setEditingId(item.id);
    setEditPrice(item.price);
  };

  const handleSave = (item) => {
    dispatch(updateMenuItem({ canteenId: canteen.id, item: { ...item, price: Number(editPrice) } }));
    setEditingId(null);
  };

  const toggleStock = (item) => {
    dispatch(updateMenuItem({ canteenId: canteen.id, item: { ...item, inStock: !item.inStock } }));
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 animate-in fade-in duration-300">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-base font-bold text-gray-800">Menu Items ({canteen.menu.length})</h3>
      </div>

      {canteen.menu.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {canteen.menu.map(item => (
            <div key={item.id} className="p-4 border border-gray-200 rounded-xl hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="font-bold text-gray-900">{item.name}</p>
                  <p className="text-xs text-gray-500">{item.category}</p>
                </div>
                <button onClick={() => toggleStock(item)} className={`text-[10px] px-2 py-1 rounded-full font-bold transition-colors ${item.inStock ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-red-100 text-red-700 hover:bg-red-200'}`}>
                  {item.inStock ? 'In Stock' : 'Out of Stock'}
                </button>
              </div>

              <div className="flex items-center justify-between mt-4 pt-3 border-t">
                {editingId === item.id ? (
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold">$</span>
                    <input type="number" value={editPrice} onChange={(e) => setEditPrice(e.target.value)} className="w-16 border rounded px-1 text-sm font-bold outline-none" autoFocus />
                  </div>
                ) : (
                  <p className="font-bold text-gray-800">${item.price}</p>
                )}

                {editingId === item.id ? (
                  <div className="flex gap-2">
                    <button onClick={() => handleSave(item)} className="p-1.5 bg-green-50 text-green-600 rounded hover:bg-green-100"><Check size={14}/></button>
                    <button onClick={() => setEditingId(null)} className="p-1.5 bg-gray-50 text-gray-600 rounded hover:bg-gray-100"><X size={14}/></button>
                  </div>
                ) : (
                  <button onClick={() => handleEdit(item)} className="p-1.5 bg-blue-50 text-blue-600 rounded hover:bg-blue-100"><Pencil size={14}/></button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-10 text-gray-400 border-2 border-dashed rounded-xl">
          <p className="font-medium text-sm">No items available in the menu.</p>
        </div>
      )}
    </div>
  );
};

export default CanteenMenu;