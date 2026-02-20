import React from 'react';
import { X, CheckCircle, Clock, CreditCard, Banknote, User, Phone } from 'lucide-react';

const OrderDetailModal = ({ order, onClose, onAdvance, onMarkPaid }) => {
  if (!order) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-slate-50 p-6 flex justify-between items-center border-b border-slate-100">
          <div>
            <h3 className="text-2xl font-bold text-slate-800">Token #{order.token}</h3>
            <p className="text-sm text-slate-500">{new Date(order.timestamp).toLocaleString()}</p>
          </div>
          <button onClick={onClose} className="p-2 bg-white rounded-full hover:bg-slate-200 transition-colors">
            <X size={20} className="text-slate-500" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          
          {/* Customer Details */}
          <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
            <div className="w-10 h-10 bg-primary/10 text-primary rounded-full flex items-center justify-center">
              <User size={20} />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-700">{order.customerName}</p>
              <div className="flex items-center gap-1 text-xs text-slate-500">
                <Phone size={12} /> {order.mobile}
              </div>
            </div>
          </div>

          {/* Status & Payment Info */}
          <div className="flex gap-4">
            <div className="flex-1 p-3 bg-blue-50 rounded-xl border border-blue-100">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Status</span>
              <div className="flex items-center gap-2 mt-1 font-semibold text-blue-900">
                <Clock size={16} /> {order.status}
              </div>
            </div>
            <div className={`flex-1 p-3 rounded-xl border ${order.isPaid ? 'bg-green-50 border-green-100' : 'bg-red-50 border-red-100'}`}>
              <span className={`text-xs font-bold uppercase tracking-wider ${order.isPaid ? 'text-green-600' : 'text-red-600'}`}>Payment</span>
              <div className={`flex items-center gap-2 mt-1 font-semibold ${order.isPaid ? 'text-green-900' : 'text-red-900'}`}>
                {order.paymentMode === 'Online' ? <CreditCard size={16} /> : <Banknote size={16} />}
                {order.isPaid ? 'Paid' : 'Unpaid'}
              </div>
            </div>
          </div>

          {/* Items List */}
          <div>
            <h4 className="font-semibold text-slate-700 mb-3">Order Items</h4>
            <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="bg-white w-8 h-8 flex items-center justify-center rounded-md font-bold text-slate-600 shadow-sm border border-slate-200">
                      {item.qty}x
                    </span>
                    <span className="font-medium text-slate-700">{item.name}</span>
                  </div>
                  <span className="font-semibold text-slate-800">₹{item.price * item.qty}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Total */}
          <div className="flex justify-between items-center pt-4 border-t border-slate-100">
            <span className="text-lg font-medium text-slate-500">Total Amount</span>
            <span className="text-3xl font-bold text-primary">₹{order.total}</span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row gap-3">
          {!order.isPaid && (
            <button 
              onClick={() => onMarkPaid(order.id)}
              className="flex-1 btn bg-green-600 hover:bg-green-700 text-white flex justify-center items-center gap-2"
            >
              <CheckCircle size={18} /> Mark Paid
            </button>
          )}
          {order.status !== 'Completed' && (
            <button 
              onClick={() => onAdvance(order.id)}
              className="flex-1 btn-primary flex justify-center items-center gap-2"
            >
              Move to {order.status === 'Pending' ? 'Preparing' : order.status === 'Preparing' ? 'Ready' : 'Completed'}
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

export default OrderDetailModal;