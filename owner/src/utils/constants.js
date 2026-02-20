export const OWNER_PROFILE = {
  id: 'own_001',
  name: 'Rajesh Kumar',
  email: 'owner@techbites.com',
  canteenName: 'Tech Bites',
  collegeName: 'Institute of Technology',
  collegeId: 'col_1',
  status: 'Open'
};

export const MENU_ITEMS_DATA = [
  { id: 'm1', name: 'Veg Burger', price: 60, category: 'Snacks', available: true, image: '🍔' },
  { id: 'm2', name: 'Chicken Wrap', price: 120, category: 'Main Course', available: true, image: '🌯' },
  { id: 'm3', name: 'Cold Coffee', price: 80, category: 'Beverages', available: true, image: '🥤' },
  { id: 'm4', name: 'French Fries', price: 50, category: 'Snacks', available: false, image: '🍟' },
  { id: 'm5', name: 'Veg Biryani', price: 150, category: 'Main Course', available: true, image: '🍛' },
];

export const DUMMY_ORDERS = [
  { 
    id: 'ord_1', token: 'A-101', status: 'Pending', total: 140, paymentMode: 'Online', timestamp: new Date().toISOString(),
    items: [{ name: 'Veg Burger', qty: 1 }, { name: 'Cold Coffee', qty: 1 }]
  },
  { 
    id: 'ord_2', token: 'A-102', status: 'Preparing', total: 120, paymentMode: 'Cash', timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    items: [{ name: 'Chicken Wrap', qty: 1 }]
  },
  { 
    id: 'ord_3', token: 'A-103', status: 'Ready', total: 50, paymentMode: 'Online', timestamp: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
    items: [{ name: 'French Fries', qty: 1 }]
  },
  { 
    id: 'ord_4', token: 'A-104', status: 'Completed', total: 200, paymentMode: 'Online', timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    items: [{ name: 'Veg Biryani', qty: 1 }, { name: 'Veg Burger', qty: 1 }]
  },
];