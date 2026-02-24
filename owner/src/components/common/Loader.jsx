import React from 'react';
import { Loader2 } from 'lucide-react';

const Loader = ({ fullScreen = false }) => { 
  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background backdrop-blur-sm">
        <img 
          src="/logo.png" 
          alt="CampusBite Logo" 
          className="w-16 h-16 mb-6 animate-pulse drop-shadow-md object-contain" 
        />
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <p className="mt-4 font-bold text-textLight text-sm uppercase tracking-[0.2em]">
          Loading Data...
        </p>
      </div>
    );
  }
 
  return (
    <div className="flex justify-center items-center w-full h-full min-h-[200px]">
      <Loader2 className="w-10 h-10 text-primary animate-spin" />
    </div>
  );
};

export default Loader;