import React, { useState } from 'react';
import { ReceiptText, ChevronLeft, ChevronRight, ArrowUpRight, ArrowDownRight, RefreshCcw } from 'lucide-react';
import Skeleton from '../common/Skeleton';

const TransactionTable = ({ transactions, isLoading }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const totalPages = Math.ceil(transactions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = transactions.slice(startIndex, startIndex + itemsPerPage);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-700';
      case 'Pending': return 'bg-amber-100 text-amber-700';
      case 'Failed': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getTypeDetails = (type) => {
    switch (type) {
      case 'Payout': return { icon: ArrowUpRight, color: 'text-red-500', bg: 'bg-red-50' };
      case 'Platform Fee': return { icon: ArrowDownRight, color: 'text-green-500', bg: 'bg-green-50' };
      case 'Refund': return { icon: RefreshCcw, color: 'text-amber-500', bg: 'bg-amber-50' };
      default: return { icon: ReceiptText, color: 'text-gray-500', bg: 'bg-gray-50' };
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mt-6">
      <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
        <h3 className="text-sm font-bold text-gray-700">Recent Transactions</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-white">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Transaction ID</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Date</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Entity / Canteen</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Type & Method</th>
              <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase">Amount</th>
              <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}>
                  <td className="px-6 py-4"><Skeleton className="h-4 w-20" /></td>
                  <td className="px-6 py-4"><Skeleton className="h-4 w-24" /></td>
                  <td className="px-6 py-4"><Skeleton className="h-4 w-32" /></td>
                  <td className="px-6 py-4"><Skeleton className="h-8 w-24 rounded-lg" /></td>
                  <td className="px-6 py-4"><Skeleton className="h-4 w-16 ml-auto" /></td>
                  <td className="px-6 py-4"><Skeleton className="h-6 w-20 rounded-full ml-auto" /></td>
                </tr>
              ))
            ) : currentData.length > 0 ? (
              currentData.map((tx) => {
                const { icon: TypeIcon, color, bg } = getTypeDetails(tx.type);
                return (
                  <tr key={tx.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-bold text-gray-900">{tx.id}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{tx.date}</td>
                    <td className="px-6 py-4 text-sm font-bold text-gray-800">{tx.canteen}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className={`p-1.5 rounded-md ${bg} ${color}`}>
                          <TypeIcon size={14} />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-gray-900">{tx.type}</p>
                          <p className="text-[10px] text-gray-500 uppercase">{tx.method}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-black text-gray-900 text-right">
                      {tx.type === 'Payout' || tx.type === 'Refund' ? '-' : '+'}₹{tx.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className={`px-2.5 py-1 text-[11px] font-bold uppercase rounded-full ${getStatusBadge(tx.status)}`}>
                        {tx.status}
                      </span>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="6" className="px-6 py-12 text-center text-gray-400">
                  <ReceiptText className="w-12 h-12 mx-auto mb-3 opacity-20" />
                  <p className="font-medium text-sm">No transactions found matching criteria.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {!isLoading && transactions.length > itemsPerPage && (
        <div className="flex justify-between px-6 py-3 border-t bg-gray-50 text-sm text-gray-600">
           <span>Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, transactions.length)}</span>
           <div className="flex gap-2">
            <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage===1} className="p-1 rounded bg-white border hover:bg-gray-100 disabled:opacity-50"><ChevronLeft size={16}/></button>
            <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage===totalPages} className="p-1 rounded bg-white border hover:bg-gray-100 disabled:opacity-50"><ChevronRight size={16}/></button>
           </div>
        </div>
      )}
    </div>
  );
};

export default TransactionTable;