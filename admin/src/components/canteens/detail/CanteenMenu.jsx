import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMenuByCanteen } from '../../../store/menuSlice';

const CanteenMenu = ({ canteen }) => {
  const dispatch = useDispatch();
  const { items, isLoading } = useSelector(state => state.menu);

  useEffect(() => {
    if (canteen && canteen._id) dispatch(fetchMenuByCanteen(canteen._id));
  }, [dispatch, canteen]);

  if (isLoading) return <div className="p-10 text-center animate-pulse mt-4 bg-white rounded-xl">Loading Menu...</div>;

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 animate-in fade-in duration-300 mt-4">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-base font-bold text-gray-800">Menu Catalog (Read-Only)</h3>
      </div>

      {items && items.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map(item => (
            <div key={item.id} className="p-4 border border-gray-200 rounded-xl bg-gray-50">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="font-bold text-gray-900">{item.name}</p>
                  <p className="text-xs text-gray-500">{item.category}</p>
                </div>
                <span className={`text-[10px] px-2 py-1 rounded-full font-bold ${item.inStock ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {item.inStock ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>
              <div className="mt-4 pt-3 border-t flex justify-between items-center">
                <p className="font-bold text-gray-800">₹{item.price}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-10 text-gray-400 border-2 border-dashed rounded-xl">
          <p className="font-medium text-sm">No items added by owner yet.</p>
        </div>
      )}
    </div>
  );
};
export default CanteenMenu;