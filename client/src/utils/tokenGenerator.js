export const generateToken = () => {
  // Generates a random 3-digit number and prepends a letter based on time
  const randomNum = Math.floor(100 + Math.random() * 900);
  const prefix = String.fromCharCode(65 + Math.floor(Math.random() * 26)); 
  return `${prefix}-${randomNum}`;
};