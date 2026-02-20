import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const TrendCard = ({ title, value, trend, icon: Icon, isCurrency }) => {
  const isPositive = trend >= 0;

  return (
    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between">
      <div className="flex justify-between items-start mb-4">
        <div className="p-2.5 rounded-lg bg-gray-50 text-gray-500 border border-gray-100">
          <Icon size={20} />
        </div>
        <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${isPositive ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
          {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          {Math.abs(trend)}%
        </div>
      </div>
      
      <div>
        <h3 className="text-2xl font-black text-gray-900 mb-1">
          {isCurrency ? '₹' : ''}{value.toLocaleString()}
        </h3>
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{title}</p>
      </div>
    </div>
  );
};

export default TrendCard;