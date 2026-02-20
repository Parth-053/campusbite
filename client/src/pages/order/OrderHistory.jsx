import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, ChevronRight, Receipt } from 'lucide-react';

const OrderHistory = () => {
  const navigate = useNavigate();
  const { pastOrders } = useSelector((state) => state.orderHistory);

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pb-10 animate-in slide-in-from-right-4 duration-300">
      <header className="bg-white px-4 py-4 shadow-sm flex items-center gap-4 sticky top-0 z-40">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-gray-700 hover:bg-gray-100 rounded-full">
          <ArrowLeft size={22} />
        </button>
        <h1 className="text-xl font-black text-gray-900 flex-1">Order History</h1>
      </header>

      <main className="p-4 space-y-4">
        {pastOrders.length > 0 ? (
          pastOrders.map((order) => (
            <div key={order.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-3">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-black text-gray-900">{order.canteenName}</h3>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest flex items-center gap-1">
                    <Clock size={10} /> {formatDate(order.date)}
                  </p>
                </div>
                <span className="bg-green-100 text-green-700 text-[10px] font-black px-2 py-1 rounded-lg uppercase">
                  {order.status}
                </span>
              </div>

              <div className="border-t border-dashed border-gray-100 pt-3">
                <p className="text-xs text-gray-600 truncate">
                  {order.items.map(item => `${item.qty}x ${item.name}`).join(', ')}
                </p>
              </div>

              <div className="flex justify-between items-center mt-1">
                <p className="font-black text-sm text-gray-900">₹{order.totalAmount}</p>
                <button className="flex items-center gap-1 text-primary text-xs font-black">
                  View Receipt <ChevronRight size={14} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Receipt size={48} className="text-gray-200 mb-4" />
            <p className="text-gray-500 font-bold">No orders found.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default OrderHistory;