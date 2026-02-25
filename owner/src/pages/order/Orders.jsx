import React, { useEffect, useState, useRef, useMemo } from 'react'; 
import { useSelector, useDispatch } from 'react-redux';
import { fetchOrders, updateOrderStatus, optimisticStatusUpdate } from '../../store/orderSlice';
import Skeleton from '../../components/common/Skeleton';
import { Search, Clock, ChefHat, CheckCircle, XCircle, ChevronRight, X, BellRing, Receipt } from 'lucide-react';

const statusConfig = {
  'Pending': { icon: Clock, color: 'text-alert', bg: 'bg-alert/10', border: 'border-alert/20' },
  'Preparing': { icon: ChefHat, color: 'text-warning', bg: 'bg-warning/10', border: 'border-warning/20' },
  'Completed': { icon: CheckCircle, color: 'text-success', bg: 'bg-success/10', border: 'border-success/20' },
  'Cancelled': { icon: XCircle, color: 'text-error', bg: 'bg-error/10', border: 'border-error/20' }
};

const Orders = () => {
  const dispatch = useDispatch();
   
  const ordersState = useSelector(state => state.orders) || {};
   
  const orders = useMemo(() => ordersState.items || [], [ordersState.items]);
  
  const isLoading = ordersState.isLoading || false;
  
  const [activeTab, setActiveTab] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  
  const [newOrderAlert, setNewOrderAlert] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const prevOrdersRef = useRef([]);

  useEffect(() => {
    dispatch(fetchOrders({ status: activeTab }));
    const intervalId = setInterval(() => {
      dispatch(fetchOrders({ status: activeTab }));
    }, 15000); 
    return () => clearInterval(intervalId);
  }, [dispatch, activeTab]);

  useEffect(() => {
    if (prevOrdersRef.current.length > 0 && orders.length > 0) {
      const prevIds = new Set(prevOrdersRef.current.map(o => o._id));
      const completelyNewOrders = orders.filter(o => !prevIds.has(o._id) && o.status === 'Pending');
      
      if (completelyNewOrders.length > 0) {
        setNewOrderAlert(completelyNewOrders[0]);
      }
    }
    prevOrdersRef.current = orders;
  }, [orders]);  

  const handleStatusChange = (id, newStatus) => {
    if (newStatus === 'Cancelled' && !window.confirm("Are you sure you want to cancel?")) return;
    
    dispatch(optimisticStatusUpdate({ id, status: newStatus }));
    dispatch(updateOrderStatus({ id, status: newStatus }));
  };

  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      if (!searchTerm) return true;
      const term = searchTerm.toLowerCase();
      const tokenMatch = order._id?.slice(-4).toLowerCase().includes(term); 
      const nameMatch = order.customer?.name?.toLowerCase().includes(term);
      return tokenMatch || nameMatch;
    });
  }, [orders, searchTerm]); 

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-20 md:pb-0 relative">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-surface p-4 sm:p-5 rounded-2xl border border-borderCol shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-textDark">Live Orders</h2>
          <p className="text-xs sm:text-sm text-textLight mt-0.5">Manage and track your active orders.</p>
        </div>
        <div className="relative w-full sm:w-72 shrink-0">
          <Search className="absolute left-3 top-2.5 text-textLight" size={18} />
          <input 
            type="text" 
            placeholder="Search by Token or Name..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-background border border-borderCol rounded-xl focus:ring-2 focus:ring-primary outline-none text-sm text-textDark"
          />
        </div>
      </div>

      <div className="flex bg-surface border border-borderCol rounded-xl w-full overflow-x-auto custom-scrollbar shadow-sm">
        {['All', 'Pending', 'Preparing', 'Completed', 'Cancelled'].map(tab => (
          <button 
            key={tab} 
            onClick={() => setActiveTab(tab)} 
            className={`flex-1 min-w-[100px] px-4 py-3 text-sm font-bold transition-all whitespace-nowrap border-b-2
              ${activeTab === tab ? 'bg-primary/5 text-primary border-primary' : 'text-textLight hover:text-textDark border-transparent hover:bg-background'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map(i => <Skeleton key={i} className="w-full h-48 rounded-2xl" />)}
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="bg-surface border border-borderCol rounded-2xl p-10 flex flex-col items-center justify-center text-center shadow-sm">
          <Clock size={48} className="text-textLight opacity-20 mb-4" />
          <h3 className="text-lg font-bold text-textDark">No orders found</h3>
          <p className="text-sm text-textLight mt-1">Wait for new orders or adjust your filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
          {filteredOrders.map((order) => {
            const StatusIcon = statusConfig[order.status]?.icon || Clock;
            const statusStyle = statusConfig[order.status] || statusConfig['Pending'];
            const token = order._id ? order._id.slice(-4).toUpperCase() : '----';

            return (
              <div key={order._id} className="bg-surface border border-borderCol rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col overflow-hidden group">
                
                <div className={`p-4 border-b ${statusStyle.border} ${statusStyle.bg} flex justify-between items-start`}>
                  <div>
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-white/80 backdrop-blur-sm ${statusStyle.color} shadow-sm border ${statusStyle.border}`}>
                      <StatusIcon size={14} />
                      {order.status}
                    </span>
                    <div className="mt-2.5 flex items-center gap-2">
                       <Receipt size={16} className="text-textDark opacity-50" />
                       <h3 className="text-lg font-black text-textDark tracking-widest">#{token}</h3>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-textLight uppercase tracking-widest">Amount</p>
                    <p className="text-xl font-black text-textDark mt-0.5">₹{order.totalAmount}</p>
                  </div>
                </div>

                <div className="p-4 border-b border-borderCol/50 bg-background/50 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-textDark truncate max-w-[150px] sm:max-w-[200px]">
                      {order.customer?.name || 'Guest User'}
                    </p>
                    <p className="text-xs text-textLight font-medium mt-0.5">
                      {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {order.items?.length || 0} items
                    </p>
                  </div>
                  <button onClick={() => setSelectedOrder(order)} className="text-xs font-bold text-primary hover:bg-primary/10 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1">
                    Details <ChevronRight size={14} />
                  </button>
                </div>

                <div className="p-3 bg-background border-t border-borderCol grid grid-cols-2 gap-2 mt-auto">
                  {order.status === 'Pending' && (
                    <>
                      <button onClick={() => handleStatusChange(order._id, 'Cancelled')} className="py-2.5 rounded-xl text-xs font-bold text-error bg-error/10 hover:bg-error/20 transition-colors">
                        Reject
                      </button>
                      <button onClick={() => handleStatusChange(order._id, 'Preparing')} className="py-2.5 rounded-xl text-xs font-bold text-white bg-primary hover:bg-primary-dark shadow-sm transition-colors">
                        Accept & Prepare
                      </button>
                    </>
                  )}
                  {order.status === 'Preparing' && (
                    <button onClick={() => handleStatusChange(order._id, 'Completed')} className="col-span-2 py-2.5 rounded-xl text-sm font-bold text-white bg-success hover:bg-green-600 shadow-sm transition-colors flex items-center justify-center gap-2">
                      <CheckCircle size={16} /> Mark Completed
                    </button>
                  )}
                  {(order.status === 'Completed' || order.status === 'Cancelled') && (
                    <div className="col-span-2 py-2.5 text-center text-xs font-bold text-textLight bg-surface border border-borderCol rounded-xl cursor-not-allowed">
                      Order Closed
                    </div>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* INCOMING ORDER ALERT POPUP */}
      {newOrderAlert && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in zoom-in-95 duration-300">
          <div className="bg-surface w-full max-w-sm rounded-3xl shadow-2xl border border-primary overflow-hidden">
            <div className="bg-primary p-6 text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-20"><BellRing size={64}/></div>
              <h2 className="text-white text-2xl font-black relative z-10 flex items-center justify-center gap-2">
                <span className="relative flex h-4 w-4">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-white"></span>
                </span>
                NEW ORDER!
              </h2>
            </div>
            
            <div className="p-6 text-center space-y-4 bg-background">
              <div>
                <p className="text-sm text-textLight font-bold uppercase tracking-wider mb-1">Order Token</p>
                <div className="text-4xl font-black text-textDark tracking-widest bg-surface border border-borderCol py-3 rounded-2xl shadow-inner">
                  #{newOrderAlert._id?.slice(-4).toUpperCase()}
                </div>
              </div>
              
              <div className="bg-surface p-4 rounded-xl border border-borderCol text-left">
                <p className="font-bold text-textDark border-b border-borderCol pb-2 mb-2 flex justify-between">
                  <span>{newOrderAlert.customer?.name || 'Guest'}</span>
                  <span className="text-primary">₹{newOrderAlert.totalAmount}</span>
                </p>
                <div className="space-y-1.5 max-h-32 overflow-y-auto custom-scrollbar">
                  {newOrderAlert.items?.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <span className="text-textLight font-medium truncate pr-2"><span className="font-bold text-textDark mr-1">{item.quantity}x</span> {item.menuItem?.name || 'Item'}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 bg-surface border-t border-borderCol grid grid-cols-2 gap-3">
              <button 
                onClick={() => { handleStatusChange(newOrderAlert._id, 'Cancelled'); setNewOrderAlert(null); }} 
                className="py-3.5 rounded-xl font-bold text-error bg-error/10 hover:bg-error/20 transition-all"
              >
                Reject Order
              </button>
              <button 
                onClick={() => { handleStatusChange(newOrderAlert._id, 'Preparing'); setNewOrderAlert(null); }} 
                className="py-3.5 rounded-xl font-bold text-white bg-primary hover:bg-primary-dark shadow-md transition-all flex justify-center items-center gap-2"
              >
                <ChefHat size={18}/> Accept
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FULL ORDER DETAILS MODAL */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-surface w-full max-w-md rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
            
            <div className={`p-5 flex justify-between items-center ${statusConfig[selectedOrder.status]?.bg || 'bg-background'}`}>
              <div>
                <h3 className="font-black text-xl text-textDark tracking-widest flex items-center gap-2">
                   <Receipt size={20} className="text-primary"/> 
                   TOKEN: #{selectedOrder._id?.slice(-4).toUpperCase()}
                </h3>
                <p className="text-xs font-bold mt-1 text-textLight">Full Order ID: {selectedOrder._id}</p>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="p-2 bg-white/50 hover:bg-white rounded-full transition-colors text-textDark"><X size={20}/></button>
            </div>

            <div className="p-5 overflow-y-auto custom-scrollbar bg-background flex-1">
              
              <div className="mb-6">
                <p className="text-xs font-bold text-textLight uppercase tracking-wider mb-2">Customer Details</p>
                <div className="bg-surface p-4 rounded-xl border border-borderCol">
                  <p className="font-bold text-textDark text-lg">{selectedOrder.customer?.name || 'Guest User'}</p>
                  <p className="text-sm text-textLight mt-1">{selectedOrder.customer?.phone || 'No phone provided'}</p>
                  <p className="text-xs text-textLight mt-1">{new Date(selectedOrder.createdAt).toLocaleString()}</p>
                </div>
              </div>

              <div>
                <p className="text-xs font-bold text-textLight uppercase tracking-wider mb-2">Order Summary</p>
                <div className="bg-surface border border-borderCol rounded-xl divide-y divide-borderCol">
                  {selectedOrder.items?.map((item, idx) => (
                    <div key={idx} className="p-3.5 flex justify-between items-center gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-background border border-borderCol flex items-center justify-center font-bold text-textDark shrink-0">
                          {item.quantity}x
                        </div>
                        <p className="font-bold text-textDark text-sm truncate">{item.menuItem?.name || 'Unknown Item'}</p>
                      </div>
                      <p className="font-black text-textDark shrink-0">₹{item.price * item.quantity}</p>
                    </div>
                  ))}
                  
                  <div className="p-4 bg-primary/5 flex justify-between items-center rounded-b-xl">
                    <p className="font-black text-textDark">Grand Total</p>
                    <p className="text-2xl font-black text-primary">₹{selectedOrder.totalAmount}</p>
                  </div>
                </div>
              </div>

            </div>

            {(selectedOrder.status === 'Pending' || selectedOrder.status === 'Preparing') && (
              <div className="p-4 bg-surface border-t border-borderCol flex gap-3">
                 {selectedOrder.status === 'Pending' && (
                    <button onClick={() => { handleStatusChange(selectedOrder._id, 'Preparing'); setSelectedOrder(null); }} className="flex-1 py-3.5 rounded-xl font-bold text-white bg-primary hover:bg-primary-dark shadow-md transition-all">
                      Accept & Prepare
                    </button>
                  )}
                  {selectedOrder.status === 'Preparing' && (
                    <button onClick={() => { handleStatusChange(selectedOrder._id, 'Completed'); setSelectedOrder(null); }} className="flex-1 py-3.5 rounded-xl font-bold text-white bg-success hover:bg-green-600 shadow-md transition-all">
                      Mark as Completed
                    </button>
                  )}
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;