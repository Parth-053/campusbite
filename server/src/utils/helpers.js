/**
 * Generates a readable Order ID  
 */
export const generateOrderId = () => {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `ORD-${timestamp}${random}`;
};

/**
 * Generates a unique Transaction ID
 */
export const generateTransactionId = () => {
  return `TXN-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
};