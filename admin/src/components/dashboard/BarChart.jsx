import React from 'react';

const BarChart = ({ data, colorClass = 'bg-primary' }) => {
  if (!data || data.length === 0) return null;

  // Find the maximum value to scale the bars proportionally
  const maxValue = Math.max(...data.map(item => item.value));

  return (
    <div className="flex items-end justify-between h-64 w-full pt-6 space-x-2 sm:space-x-4">
      {data.map((item, index) => {
        // Calculate percentage height, fallback to 0 if max is 0
        const heightPercentage = maxValue > 0 ? (item.value / maxValue) * 100 : 0;
        
        return (
          // Added 'h-full justify-end' to force the container to take the full 64 height
          <div key={index} className="flex flex-col items-center flex-1 group h-full justify-end">
            
            {/* Tooltip on hover */}
            <div className="opacity-0 group-hover:opacity-100 transition-opacity text-xs font-bold text-gray-700 mb-2">
              ${item.value}
            </div>
            
            {/* Bar Container */}
            <div className="w-full flex justify-center items-end h-full">
              <div 
                className={`w-full max-w-[40px] rounded-t-md transition-all duration-700 ease-out ${colorClass} hover:opacity-80`}
                style={{ 
                  height: `${heightPercentage}%`, 
                  minHeight: '4px' // Ensure even 0 values show a tiny bar
                }}
              ></div>
            </div>
            
            {/* Label */}
            <span className="text-xs text-gray-500 mt-2 truncate w-full text-center">
              {item.label}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default BarChart;