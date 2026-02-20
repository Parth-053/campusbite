import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { ShoppingBag, ChevronRight } from 'lucide-react';

const FloatingCart = () => {
  const { totalQuantity, totalPrice } = useSelector((state) => state.cart);
  const navigate = useNavigate();
  const location = useLocation();

  if (totalQuantity === 0 || location.pathname === '/cart' || location.pathname === '/payment') {
    return null;
  }

  return (
    <div 
      onClick={() => navigate('/cart')}
      className="w-full pointer-events-auto bg-primary text-white p-4 rounded-2xl shadow-xl shadow-primary/30 flex justify-between items-center cursor-pointer hover:bg-red-600 transition-colors active:scale-[0.98] animate-in slide-in-from-bottom-4"
    >
      <div className="flex items-center gap-3">
        <div className="bg-white/20 p-2 rounded-full">
          <ShoppingBag size={20} className="text-white" />
        </div>
        <div>
          <p className="text-[10px] font-black text-white/80 uppercase tracking-widest mb-0.5">Your Order</p>
          <p className="text-sm font-black">{totalQuantity} Items • ₹{totalPrice}</p>
        </div>
      </div>
      
      <div className="flex items-center gap-1 font-bold text-sm">
        View Cart <ChevronRight size={18} strokeWidth={3} />
      </div>
    </div>
  );
};

export default FloatingCart;