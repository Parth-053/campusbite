import React from 'react';

const Skeleton = ({ className }) => {
  return (
    <div className={`relative overflow-hidden bg-slate-200 rounded-md ${className}`}>
      {/* Sparkling/Shimmer Effect */}
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/50 to-transparent"></div>
    </div>
  );
};

export default Skeleton;