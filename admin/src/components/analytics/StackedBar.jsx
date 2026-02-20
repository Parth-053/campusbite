import React from 'react';

const StackedBar = ({ data }) => {
  if (!data || data.length === 0) return null;

  return (
    <div className="w-full">
      {/* Bar */}
      <div className="flex w-full h-4 rounded-full overflow-hidden mb-4">
        {data.map((item, idx) => (
          <div 
            key={idx} 
            style={{ width: `${item.percentage}%` }} 
            className={`${item.color} h-full transition-all duration-500 hover:opacity-80`}
            title={`${item.method}: ${item.percentage}%`}
          />
        ))}
      </div>
      
      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4">
        {data.map((item, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${item.color}`} />
            <span className="text-sm text-gray-600 font-medium">{item.method} ({item.percentage}%)</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StackedBar;