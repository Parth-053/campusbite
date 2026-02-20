import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ShoppingBag } from 'lucide-react';
import { fetchOrders } from '../store/orderSlice';
import StatCard from '../components/dashboard/StatCard';
import Skeleton from '../components/common/Skeleton';
import OrderFilters from '../components/orders/OrderFilters';
import OrdersTable from '../components/orders/OrdersTable';

const Orders = () => {
  const dispatch = useDispatch();
  const { orders, totalOrders, isLoading } = useSelector(state => state.order);
  
  const [filters, setFilters] = useState({ duration: 'All', customDate: '', status: 'All' });

  useEffect(() => {
    dispatch(fetchOrders(filters));
  }, [dispatch, filters]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <h1 className="text-2xl font-bold text-gray-800">Order Management</h1>

      <OrderFilters filters={filters} setFilters={setFilters} />

      {/* Single Stat Card - Limit width to 1/3 on desktop for neatness */}
      <div className="w-full sm:w-1/2 lg:w-1/3">
        {isLoading ? (
          <Skeleton className="h-20 sm:h-24 w-full rounded-xl" />
        ) : (
          <StatCard title="Total Filtered Orders" value={totalOrders} icon={ShoppingBag} color="bg-purple-500" />
        )}
      </div>

      <OrdersTable orders={orders} isLoading={isLoading} />
    </div>
  );
};

export default Orders;