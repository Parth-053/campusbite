import React from 'react';

const Loader = () => (
  <div className="flex justify-center items-center h-full min-h-[200px]">
    <div className="animate-spin rounded-full h-10 w-10 border-4 border-slate-200 border-t-primary"></div>
  </div>
);

export default Loader;