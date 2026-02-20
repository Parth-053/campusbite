import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchOrders, setOrderFilter, advanceOrderStatus, markAsPaid } from '../../store/orderSlice';
import Skeleton from '../../components/common/Skeleton';
import OrderDetailModal from '../../components/orders/OrderDetailModal';
import { Filter, ChevronRight, AlertCircle, Eye, User, Phone } from 'lucide-react';

const Orders = () => {
  const dispatch = useDispatch();
  const { orders, isLoading, filter } = useSelector(state => state.order);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  const filteredOrders = orders
    .filter(order => filter === 'All' || order.status === filter)
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  const handleAdvance = (orderId) => {
    dispatch(advanceOrderStatus({ orderId }));
    setSelectedOrder(null);
  };

  const handleMarkPaid = (orderId) => {
    dispatch(markAsPaid(orderId));
  };

  // --- Components ---

  const FilterBadge = ({ name }) => (
    <button
      onClick={() => dispatch(setOrderFilter(name))}
      className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap
        ${filter === name 
          ? 'bg-primary text-white shadow-md shadow-blue-200' 
          : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}
    >
      {name}
    </button>
  );

  const StatusBadge = ({ status }) => {
    const styles = {
      'Pending': 'bg-yellow-100 text-yellow-700',
      'Preparing': 'bg-blue-100 text-blue-700',
      'Ready': 'bg-green-100 text-green-700',
      'Completed': 'bg-slate-100 text-slate-600',
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${styles[status] || 'bg-gray-100'}`}>
        {status}
      </span>
    );
  };

  // --- Mobile Card View ---
  const MobileOrderCard = ({ order }) => (
    <div 
      onClick={() => setSelectedOrder(order)}
      className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md active:scale-95 transition-all cursor-pointer"
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-3">
          <span className="bg-slate-100 text-slate-700 font-bold px-3 py-1 rounded-lg text-lg">
            #{order.token.split('-')[1]}
          </span>
          <div>
            <h4 className="font-bold text-slate-800 text-sm">{order.customerName}</h4>
            <p className="text-xs text-slate-500">{order.mobile}</p>
          </div>
        </div>
        <StatusBadge status={order.status} />
      </div>
      <div className="flex justify-between items-center text-sm border-t border-slate-100 pt-3 mt-3">
        <span className="text-slate-500">{order.items.length} Items</span>
        <span className="font-bold text-slate-800">₹{order.total}</span>
      </div>
    </div>
  );

  // --- Desktop Table Row ---
  const TableRow = ({ order }) => (
    <tr className="hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-none">
      <td className="p-4 font-bold text-slate-700">#{order.token}</td>
      <td className="p-4">
        <div className="flex flex-col">
          <span className="font-medium text-slate-800">{order.customerName}</span>
          <span className="text-xs text-slate-500 flex items-center gap-1"><Phone size={10} /> {order.mobile}</span>
        </div>
      </td>
      <td className="p-4">
        <div className="text-sm text-slate-600 max-w-[200px] truncate" title={order.items.map(i => i.name).join(', ')}>
          {order.items.map(i => `${i.qty}x ${i.name}`).join(', ')}
        </div>
      </td>
      <td className="p-4 font-bold text-slate-700">₹{order.total}</td>
      <td className="p-4">
        <StatusBadge status={order.status} />
      </td>
      <td className="p-4">
        <span className={`text-xs font-bold px-2 py-1 rounded ${order.isPaid ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'}`}>
          {order.isPaid ? 'PAID' : 'UNPAID'}
        </span>
      </td>
      <td className="p-4">
        <button 
          onClick={() => setSelectedOrder(order)}
          className="p-2 text-slate-500 hover:text-primary hover:bg-blue-50 rounded-lg transition-colors"
        >
          <Eye size={18} />
        </button>
      </td>
    </tr>
  );

  return (
    <div className="h-[calc(100vh-100px)] flex flex-col">
      {/* Header & Filter */}
      <div className="mb-6 space-y-4">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Order Management</h2>
            <p className="text-sm text-slate-500 hidden sm:block">Track and manage customer orders.</p>
          </div>
          <div className="bg-white p-2 rounded-lg border border-slate-200 shadow-sm flex items-center gap-2 text-sm font-medium text-slate-600">
            <Filter size={16} />
            <span className="hidden sm:inline">Filter:</span>
            <span className="text-primary">{filter}</span>
          </div>
        </div>

        {/* Scrollable Filter Badges */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {['All', 'Pending', 'Preparing', 'Ready', 'Completed'].map(status => (
            <FilterBadge key={status} name={status} />
          ))}
        </div>
      </div>

      {/* Content Area */}
      {isLoading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-16 w-full rounded-xl" />)}
        </div>
      ) : filteredOrders.length > 0 ? (
        <>
          {/* Mobile View (Cards) - Hidden on md+ */}
          <div className="md:hidden grid grid-cols-1 gap-4 pb-20 overflow-y-auto">
            {filteredOrders.map(order => (
              <MobileOrderCard key={order.id} order={order} />
            ))}
          </div>

          {/* Desktop View (Table) - Hidden on mobile */}
          <div className="hidden md:block bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-4">Token</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Items</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Payment</th>
                  <th className="p-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredOrders.map(order => (
                  <TableRow key={order.id} order={order} />
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center h-64 text-slate-400">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
            <AlertCircle size={32} />
          </div>
          <p>No {filter !== 'All' ? filter.toLowerCase() : ''} orders found.</p>
        </div>
      )}

      {/* Detail Modal */}
      {selectedOrder && (
        <OrderDetailModal 
          order={selectedOrder} 
          onClose={() => setSelectedOrder(null)} 
          onAdvance={handleAdvance}
          onMarkPaid={handleMarkPaid}
        />
      )}
    </div>
  );
};

export default Orders;