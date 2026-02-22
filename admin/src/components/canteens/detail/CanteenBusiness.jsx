import React from 'react';
import { ShoppingBag, Wallet } from 'lucide-react';

const CanteenBusiness = ({ canteen }) => {
  const totalOrders = canteen.totalOrders || 0;
  const revenue = canteen.revenue || 0;
  const transactions = canteen.transactions || [];

  return (
    <div className="space-y-6 animate-in fade-in duration-300 mt-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 p-6 rounded-xl text-white shadow-md relative overflow-hidden">
          <div className="absolute -right-6 -top-6 bg-white/10 p-8 rounded-full blur-xl"></div>
          <p className="text-indigo-100 text-xs font-bold uppercase mb-1 flex items-center gap-1"><ShoppingBag size={14}/> Total Lifetime Orders</p>
          <h3 className="text-3xl font-bold relative z-10">{totalOrders.toLocaleString()}</h3>
        </div>
        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 p-6 rounded-xl text-white shadow-md relative overflow-hidden">
          <div className="absolute -right-6 -top-6 bg-white/10 p-8 rounded-full blur-xl"></div>
          <p className="text-emerald-100 text-xs font-bold uppercase mb-1 flex items-center gap-1"><Wallet size={14}/> Total Turnover</p>
          <h3 className="text-3xl font-bold relative z-10">₹{revenue.toLocaleString()}</h3>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="text-base font-bold text-gray-800 mb-4">Settlement History</h3>
        {transactions.length > 0 ? (
          <div className="space-y-3">
            {transactions.map((tx, idx) => (
              <div key={idx} className="flex justify-between items-center p-3 border border-gray-100 rounded-lg hover:bg-gray-50">
                <div>
                  <p className="font-bold text-gray-900 text-sm">{tx.type}</p>
                  <p className="text-xs text-gray-500">{tx.date}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-red-600 text-sm">-₹{tx.amount.toLocaleString()}</p>
                  <span className="text-[10px] text-green-700 bg-green-50 px-2 py-0.5 rounded-full font-bold">{tx.status}</span>
                </div>
              </div>
            ))}
          </div>
        ) : <p className="text-sm text-gray-500">No transactions recorded yet.</p>}
      </div>
    </div>
  );
};
export default CanteenBusiness;