import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Splash = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/home');
    }, 2000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="splash-screen">
      <h1>Campus Canteen 🍔</h1>
      <p>Order delicious food instantly!</p>
    </div>
  );
};

export default Splash;