import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { ArrowLeft, MapPin, User, Calendar, CreditCard, ShoppingBag, Coffee } from 'lucide-react';
import { fetchOrderById, clearCurrentOrder } from '../store/orderSlice';
import Skeleton from '../components/common/Skeleton';

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { currentOrder: order, isDetailLoading } = useSelector(state => state.order);

  useEffect(() => {
    dispatch(fetchOrderById(id));
    return () => dispatch(clearCurrentOrder());
  }, [dispatch, id]);

  if (isDetailLoading || !order) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white h-16 shadow-sm sticky top-0" />
        <div className="p-8 max-w-4xl mx-auto space-y-4">
          <Skeleton className="h-32 w-full rounded-2xl" />
          <Skeleton className="h-64 w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch(status) {
      case 'Completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'Pending': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* Top Header */}
      <div className="bg-white h-16 flex items-center shadow-sm px-4 sticky top-0 z-30 border-b border-gray-200">
        <button onClick={() => navigate(-1)} className="p-2 mr-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeft size={22} />
        </button>
        <h1 className="flex-1 text-center text-lg font-bold text-gray-800 pr-10">Order Detail</h1>
      </div>

      <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-6 animate-in fade-in duration-300 pb-20">
        
        {/* Main Header Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-black text-gray-900 mb-1">{order.id}</h2>
            <p className="text-gray-500 text-sm flex items-center gap-1.5"><Calendar size={14}/> {order.date}</p>
          </div>
          <div className="text-right">
            <span className={`px-4 py-1.5 text-xs font-bold uppercase rounded-full border ${getStatusColor(order.status)}`}>
              {order.status}
            </span>
            <h3 className="text-2xl font-black text-gray-900 mt-2">₹{order.amount}</h3>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Customer & Payment Info */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-6">
            <div>
              <h3 className="text-sm font-bold text-gray-500 uppercase mb-3 flex items-center gap-2"><User size={16}/> Customer</h3>
              <p className="font-bold text-gray-900 text-lg">{order.user}</p>
            </div>
            <div className="border-t pt-4">
              <h3 className="text-sm font-bold text-gray-500 uppercase mb-3 flex items-center gap-2"><CreditCard size={16}/> Payment Details</h3>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Method</span>
                <span className="font-bold text-gray-900">{order.paymentMode}</span>
              </div>
            </div>
          </div>

          {/* Canteen Info */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-6">
            <div>
              <h3 className="text-sm font-bold text-gray-500 uppercase mb-3 flex items-center gap-2"><Coffee size={16}/> Prepared By</h3>
              <p className="font-bold text-gray-900 text-lg">{order.canteen}</p>
            </div>
            <div className="border-t pt-4">
              <h3 className="text-sm font-bold text-gray-500 uppercase mb-3 flex items-center gap-2"><MapPin size={16}/> Location</h3>
              <p className="font-bold text-gray-900 text-sm">{order.college}</p>
            </div>
          </div>
        </div>

        {/* Order Items Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-200 flex items-center gap-2 bg-gray-50">
            <ShoppingBag size={18} className="text-gray-500" />
            <h3 className="text-sm font-bold text-gray-700 uppercase">Items Ordered</h3>
          </div>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-white">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Item Name</th>
                <th className="px-6 py-3 text-center text-xs font-bold text-gray-500 uppercase">Qty</th>
                <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase">Price</th>
                <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase">Total</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {order.items.map((item, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 text-sm font-bold text-gray-900">{item.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 text-center">x{item.qty}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 text-right">₹{item.price}</td>
                  <td className="px-6 py-4 text-sm font-bold text-gray-900 text-right">₹{item.qty * item.price}</td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-gray-50">
              <tr>
                <td colSpan="3" className="px-6 py-4 text-right text-sm font-bold text-gray-600 uppercase">Grand Total</td>
                <td className="px-6 py-4 text-right text-lg font-black text-primary">₹{order.amount}</td>
              </tr>
            </tfoot>
          </table>
        </div>

      </div>
    </div>
  );
};

export default OrderDetail;