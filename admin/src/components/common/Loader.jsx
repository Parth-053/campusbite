import React from 'react';
import { Loader2 } from 'lucide-react';

const Loader = ({ className = '' }) => {
  return (
    <div className={`flex justify-center items-center w-full h-full min-h-[150px] ${className}`}>
      <Loader2 className="w-8 h-8 text-primary animate-spin" />
    </div>
  );
};

export default Loader;