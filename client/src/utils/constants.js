export const COLLEGES = [
  { id: 'col_1', name: 'Institute of Technology', location: 'North Campus' },
  { id: 'col_2', name: 'School of Management', location: 'South Campus' },
  { id: 'col_3', name: 'Arts & Science College', location: 'East Campus' },
];

export const CANTEENS = [
  { id: 'can_1', collegeId: 'col_1', name: 'Tech Bites', image: '🍔' },
  { id: 'can_2', collegeId: 'col_1', name: 'Main Cafe', image: '☕' },
  { id: 'can_3', collegeId: 'col_2', name: 'Biz Food Court', image: '🍕' },
  { id: 'can_4', collegeId: 'col_3', name: 'Creative Kitchen', image: '🥗' },
];

export const MENU_ITEMS = {
  'can_1': [
    { id: 'm1', name: 'Veg Burger', price: 50, type: 'veg' },
    { id: 'm2', name: 'Chicken Wrap', price: 90, type: 'non-veg' },
    { id: 'm3', name: 'Fries', price: 40, type: 'veg' },
  ],
  'can_2': [
    { id: 'm4', name: 'Cappuccino', price: 60, type: 'veg' },
    { id: 'm5', name: 'Sandwich', price: 50, type: 'veg' },
  ],
  'can_3': [
    { id: 'm6', name: 'Pizza Slice', price: 80, type: 'veg' },
    { id: 'm7', name: 'Pasta', price: 100, type: 'veg' },
  ],
  'can_4': [
    { id: 'm8', name: 'Salad Bowl', price: 120, type: 'veg' },
    { id: 'm9', name: 'Smoothie', price: 70, type: 'veg' },
  ],
};