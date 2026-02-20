import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Wallet, ArrowDownLeft, ArrowUpRight, AlertCircle, IndianRupee } from 'lucide-react';
import { fetchWalletData, requestWithdrawal } from '../../store/transactionSlice';
import Skeleton from '../../components/common/Skeleton';

const Transactions = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { balance, commission, minWithdraw, history, isLoading } = useSelector(state => state.transaction);

  useEffect(() => {
    dispatch(fetchWalletData());
  }, [dispatch]);

  const handleWithdraw = () => {
    const finalAmount = balance - (balance * (commission / 100));
    if (window.confirm(`Withdraw ₹${balance}? \n\nAdmin Commission (${commission}%): -₹${(balance * commission / 100).toFixed(2)}\nNet Payout: ₹${finalAmount.toFixed(2)}`)) {
      dispatch(requestWithdrawal(balance));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      
      {/* --- Standalone Header --- */}
      <div className="bg-white px-4 h-16 flex items-center shadow-sm sticky top-0 z-30">
        <button 
          onClick={() => navigate(-1)} 
          className="p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
        >
          <ArrowLeft size={22} />
        </button>
        <h1 className="flex-1 text-center text-lg font-bold text-slate-800 pr-8">
          Wallet & Transactions
        </h1>
      </div>

      <div className="max-w-2xl mx-auto p-4 space-y-6">
        
        {/* --- Wallet Card --- */}
        {isLoading ? (
          <Skeleton className="h-48 w-full rounded-2xl" />
        ) : (
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 p-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2 text-slate-400 text-sm font-medium uppercase tracking-wider">
                <Wallet size={16} /> Total Balance
              </div>
              <div className="text-4xl font-bold mb-1 flex items-center">
                <IndianRupee size={32} /> {balance.toFixed(2)}
              </div>
              <p className="text-xs text-slate-400 mb-6">
                Funds held by Admin from your orders.
              </p>

              {/* Withdraw Button */}
              <div className="flex flex-col gap-2">
                <button
                  onClick={handleWithdraw}
                  disabled={balance < minWithdraw}
                  className={`w-full py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2
                    ${balance >= minWithdraw 
                      ? 'bg-green-500 hover:bg-green-400 text-white shadow-lg shadow-green-900/20' 
                      : 'bg-slate-700 text-slate-500 cursor-not-allowed'}
                  `}
                >
                  {balance >= minWithdraw ? 'Withdraw Funds' : `Minimum withdrawal ₹${minWithdraw}`}
                </button>
                <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-400">
                  <AlertCircle size={10} />
                  <span>Admin charges {commission}% commission on withdrawal.</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- Transaction History --- */}
        <div>
          <h3 className="text-base font-bold text-slate-800 mb-3 px-1">Transaction History</h3>
          <div className="space-y-3">
            {isLoading ? (
              [...Array(4)].map((_, i) => (
                <div key={i} className="bg-white p-4 rounded-xl border border-slate-100 flex justify-between items-center">
                  <div className="flex gap-3">
                    <Skeleton className="w-10 h-10 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="w-24 h-4" />
                      <Skeleton className="w-16 h-3" />
                    </div>
                  </div>
                  <Skeleton className="w-16 h-6" />
                </div>
              ))
            ) : history.length > 0 ? (
              history.map((tx) => (
                <div key={tx.id} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 
                      ${tx.type === 'credit' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}
                    `}>
                      {tx.type === 'credit' ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800">
                        {tx.type === 'credit' ? 'Order Payment' : 'Withdrawal to Bank'}
                      </p>
                      <p className="text-xs text-slate-500">
                        {tx.orderId ? tx.orderId : 'Wallet Transfer'} • {new Date(tx.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold text-sm ${tx.type === 'credit' ? 'text-green-600' : 'text-slate-800'}`}>
                      {tx.type === 'credit' ? '+' : '-'}₹{tx.amount}
                    </p>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded border
                      ${tx.status === 'Success' ? 'bg-green-50 border-green-100 text-green-700' : 'bg-amber-50 border-amber-100 text-amber-700'}
                    `}>
                      {tx.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10 text-slate-400">
                <p>No transactions yet.</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Transactions;