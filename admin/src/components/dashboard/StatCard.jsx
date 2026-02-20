import React from 'react';

const StatCard = ({ title, value, icon: Icon, color }) => {
  return (
    <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100 flex items-center">
      {/* Icon Container: Smaller on mobile, normal on sm+ */}
      <div className={`p-2 sm:p-3 rounded-full ${color} bg-opacity-10 mr-3 sm:mr-4 shrink-0`}>
        <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${color.replace('bg-', 'text-')}`} />
      </div>
      
      {/* Text Container */}
      <div className="min-w-0 flex-1">
        <p className="text-gray-500 text-xs sm:text-sm font-medium truncate">{title}</p>
        <h3 className="text-lg sm:text-2xl font-bold text-gray-800 truncate">{value}</h3>
      </div>
    </div>
  );
};

export default StatCard;