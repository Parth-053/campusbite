export const MOCK_COLLEGES = [
  { id: 'col_1', name: 'Tech Institute', location: 'New York', status: 'Active' },
  { id: 'col_2', name: 'City University', location: 'Chicago', status: 'Active' },
  { id: 'col_3', name: 'Valley College', location: 'San Francisco', status: 'Inactive' },
];

export const MOCK_CANTEENS = [
  { id: 'can_1', collegeId: 'col_1', name: 'Tech Bites', ownerId: 'own_1', status: 'Active', revenue: 15000 },
  { id: 'can_2', collegeId: 'col_1', name: 'Coffee Hub', ownerId: 'own_2', status: 'Active', revenue: 8000 },
  { id: 'can_3', collegeId: 'col_2', name: 'City Snacks', ownerId: 'own_3', status: 'Active', revenue: 12000 },
];

export const MOCK_OWNERS = [
  { id: 'own_1', name: 'John Doe', email: 'john@test.com', phone: '1234567890', status: 'Active' },
  { id: 'own_2', name: 'Jane Smith', email: 'jane@test.com', phone: '0987654321', status: 'Active' },
  { id: 'own_3', name: 'Mike Ross', email: 'mike@test.com', phone: '1122334455', status: 'Suspended' },
];

export const MOCK_USERS = [
  { id: 'usr_1', name: 'Student A', email: 'studentA@edu.com', collegeId: 'col_1', status: 'Active' },
  { id: 'usr_2', name: 'Student B', email: 'studentB@edu.com', collegeId: 'col_2', status: 'Active' },
];

export const MOCK_ORDERS = [
  { id: 'ord_1', collegeId: 'col_1', canteenId: 'can_1', userId: 'usr_1', amount: 50, status: 'Completed', date: '2023-10-25', paymentMode: 'Online' },
  { id: 'ord_2', collegeId: 'col_1', canteenId: 'can_2', userId: 'usr_1', amount: 120, status: 'Completed', date: '2023-10-25', paymentMode: 'Cash' },
  { id: 'ord_3', collegeId: 'col_2', canteenId: 'can_3', userId: 'usr_2', amount: 80, status: 'Pending', date: '2023-10-26', paymentMode: 'Online' },
  { id: 'ord_4', collegeId: 'col_1', canteenId: 'can_1', userId: 'usr_1', amount: 200, status: 'Completed', date: '2023-10-26', paymentMode: 'Online' },
];