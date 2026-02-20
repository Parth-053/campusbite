export const calculateTotalRevenue = (orders) => {
  return orders
    .filter(order => order.status === 'Completed')
    .reduce((acc, order) => acc + order.amount, 0);
};

export const calculateCommission = (revenue, percentage) => {
  return (revenue * (percentage / 100)).toFixed(2);
};

export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString();
};

export const getStatusColor = (status) => {
  switch (status) {
    case 'Active': return 'bg-green-100 text-green-800';
    case 'Completed': return 'bg-green-100 text-green-800';
    case 'Pending': return 'bg-yellow-100 text-yellow-800';
    case 'Inactive': return 'bg-gray-100 text-gray-800';
    case 'Suspended': return 'bg-red-100 text-red-800';
    default: return 'bg-blue-100 text-blue-800';
  }
};