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
    <div className="min-h-screen bg-gradient-hero flex flex-col items-center justify-center p-4">
      <div className="w-28 h-28 bg-surface rounded-full flex items-center justify-center shadow-floating mb-6 animate-bounce-slight">
        <img src="/logo.png" alt="CampusBite" className="w-20 h-20 object-contain" />
      </div>
      <h1 className="text-4xl md:text-5xl font-black text-surface tracking-tight mb-2 animate-slide-up">CampusBite</h1>
      <p className="text-surface/90 font-medium text-lg md:text-xl animate-fade-in delay-200">Order Your Food 🍔</p>
    </div>
  );
};

export default Splash;