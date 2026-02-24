import React from 'react';

const Skeleton = ({ className, circle = false }) => {
  return (
    <div 
      className={`animate-pulse bg-borderCol ${circle ? 'rounded-full' : 'rounded-md'} ${className}`}
    ></div>
  );
};

export default Skeleton;