export const calculateRevenue = (orders) => {
  return orders.reduce((acc, order) => acc + order.total, 0);
};

export const filterOrdersByStatus = (orders, status) => {
  return orders.filter(order => order.status === status);
};

export const getStatusColor = (status) => {
  switch (status) {
    case 'Pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    case 'Preparing': return 'bg-blue-100 text-blue-700 border-blue-200';
    case 'Ready': return 'bg-green-100 text-green-700 border-green-200';
    case 'Completed': return 'bg-gray-100 text-gray-600 border-gray-200';
    default: return 'bg-gray-100 text-gray-600';
  }
};