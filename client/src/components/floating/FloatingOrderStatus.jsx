import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { Clock, ChevronRight, CheckCircle, X, CreditCard } from 'lucide-react';
import { clearActiveOrder } from '../../store/orderSlice';

const FloatingOrderStatus = () => {
  const { activeOrder } = useSelector((state) => state.order);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // Hide if no active order or if the user is already on the tracking page
  if (!activeOrder || location.pathname === '/order-tracking') {
    return null;
  }

  const isReady = activeOrder.status === 'Ready';
  const isCompleted = activeOrder.status === 'Completed';

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'bg-orange-500';
      case 'Preparing': return 'bg-blue-500';
      case 'Ready': return 'bg-green-500 animate-pulse';
      case 'Completed': return 'bg-gray-900';
      default: return 'bg-gray-500';
    }
  };

  // --- COMPLETED STATE VIEW ---
  if (isCompleted) {
    return (
      <div className="w-full pointer-events-auto bg-gray-900 text-white p-3 rounded-2xl shadow-xl flex justify-between items-center animate-in zoom-in-95 duration-300 border border-white/10">
        <div className="flex items-center gap-3">
          <div className="bg-green-500 p-2 rounded-full text-white">
            <CheckCircle size={18} strokeWidth={3} />
          </div>
          <div>
            <p className="text-sm font-black">Order Complete!</p>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Enjoy your meal</p>
          </div>
        </div>
        
        {/* Close button to remove the floating bar from the UI */}
        <button 
          onClick={(e) => {
            e.stopPropagation();
            dispatch(clearActiveOrder());
          }}
          className="p-2 hover:bg-white/10 rounded-full transition-colors"
        >
          <X size={18} className="text-gray-400" />
        </button>
      </div>
    );
  }

  // --- TRACKING / PAY STATE VIEW ---
  return (
    <div 
      onClick={() => navigate('/order-tracking')}
      className={`w-full pointer-events-auto p-3 rounded-2xl shadow-xl flex justify-between items-center cursor-pointer transition-all active:scale-[0.98] animate-in slide-in-from-bottom-4 border-2 
        ${isReady ? 'bg-green-50 border-green-500 shadow-green-100' : 'bg-white border-primary/20'}
      `}
    >
      <div className="flex items-center gap-3">
        <div className={`${getStatusColor(activeOrder.status)} p-2.5 rounded-full text-white shadow-sm`}>
          {isReady ? <CreditCard size={20} /> : <Clock size={20} />}
        </div>
        <div>
          <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-0.5">
            {isReady ? 'Action Required' : 'Order Status'}
          </p>
          <p className={`text-sm font-black ${isReady ? 'text-green-700' : 'text-gray-900'}`}>
            {activeOrder.status}
          </p>
        </div>
      </div>
      
      <div className={`flex items-center gap-1 font-bold text-sm ${isReady ? 'text-green-600' : 'text-primary'}`}>
        {isReady ? 'Pay Now' : 'Track'} <ChevronRight size={18} strokeWidth={3} />
      </div>
    </div>
  );
};

export default FloatingOrderStatus;