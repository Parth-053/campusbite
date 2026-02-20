import React from 'react';
import { Loader2 } from 'lucide-react';

const Loader = ({ fullScreen = false, text = 'Loading...' }) => {
  return (
    <div className={`flex flex-col items-center justify-center text-primary ${fullScreen ? 'min-h-screen bg-gray-50/80 backdrop-blur-sm fixed inset-0 z-50' : 'h-full min-h-[200px]'}`}>
      <Loader2 className="w-10 h-10 animate-spin mb-3" />
      {text && <p className="text-sm font-bold text-gray-500 animate-pulse">{text}</p>}
    </div>
  );
};

export default Loader;