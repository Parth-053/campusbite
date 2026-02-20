import React from 'react';

const Skeleton = ({ className = '', ...props }) => {
  return (
    <div
      className={`relative overflow-hidden bg-gray-200 rounded-lg ${className}`}
      {...props}
    >
      {/* Shimmer shining effect */}
      <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/60 to-transparent animate-[shimmer_1.5s_infinite]" />
    </div>
  );
};

export default Skeleton;