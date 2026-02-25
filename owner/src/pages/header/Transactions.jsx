import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchWalletData, requestWithdrawal } from '../../store/transactionSlice';
import Skeleton from '../../components/common/Skeleton';
import { Wallet, Clock, CheckCircle2, AlertCircle, Loader2, Receipt } from 'lucide-react';
import toast from 'react-hot-toast';

const Transactions = () => {
  const dispatch = useDispatch();
   
  const walletData = useSelector(state => state.transactions?.wallet);
  const orderHistoryData = useSelector(state => state.transactions?.orderHistory);
  const withdrawalHistoryData = useSelector(state => state.transactions?.withdrawalHistory);
  const isLoading = useSelector(state => state.transactions?.isLoading) || false;
  const isActionLoading = useSelector(state => state.transactions?.isActionLoading) || false;
 
  const wallet = walletData || { availableBalance: 0, minWithdrawalLimit: 500, commissionRatePercent: 10 };
  const orderHistory = orderHistoryData || [];
  const withdrawalHistory = withdrawalHistoryData || [];

  const [activeTab, setActiveTab] = useState('Earnings'); 
  const [withdrawAmount, setWithdrawAmount] = useState('');

  useEffect(() => {
    dispatch(fetchWalletData());
  }, [dispatch]);

  const handleWithdraw = (e) => {
    e.preventDefault();
    const amount = Number(withdrawAmount);
    if (amount < wallet.minWithdrawalLimit) return toast.error(`Minimum withdrawal is ₹${wallet.minWithdrawalLimit}`);
    if (amount > wallet.availableBalance) return toast.error("Insufficient balance");

    dispatch(requestWithdrawal(amount)).then((res) => {
      if(!res.error) setWithdrawAmount('');
    });
  };

  // Safe Math calculation
  const progressPercent = Math.min(((wallet.availableBalance || 0) / (wallet.minWithdrawalLimit || 500)) * 100, 100);

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-20 md:pb-0 max-w-5xl mx-auto">
      
      {/* 1. HERO WALLET CARD */}
      <div className="bg-surface rounded-3xl p-6 sm:p-8 border border-borderCol shadow-sm relative overflow-hidden">
        <div className="absolute -right-10 -top-10 text-primary opacity-5 transform rotate-12">
          <Wallet size={200} />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row gap-8 justify-between items-start md:items-center">
          
          <div className="space-y-4 flex-1 w-full">
            <div>
              <p className="text-sm font-bold text-textLight uppercase tracking-widest mb-1 flex items-center gap-2">
                <Wallet size={16} className="text-primary"/> Available Balance
              </p>
              {isLoading ? (
                 <Skeleton className="h-10 w-48" />
              ) : (
                <h1 className="text-4xl sm:text-5xl font-black text-textDark tracking-tight">
                  ₹{wallet.availableBalance?.toLocaleString() || 0}
                </h1>
              )}
            </div>

            <div className="max-w-sm">
              <div className="flex justify-between text-xs font-bold text-textLight mb-2">
                <span>Withdrawal Threshold</span>
                <span>₹{wallet.minWithdrawalLimit || 500}</span>
              </div>
              <div className="h-2 w-full bg-background rounded-full overflow-hidden border border-borderCol">
                <div 
                  className={`h-full rounded-full transition-all duration-1000 ${progressPercent === 100 ? 'bg-success' : 'bg-primary'}`} 
                  style={{ width: `${progressPercent || 0}%` }}>
                </div>
              </div>
              {progressPercent < 100 && (
                <p className="text-[10px] font-medium text-alert mt-2 flex items-center gap-1">
                  <AlertCircle size={12}/> Earn ₹{(wallet.minWithdrawalLimit || 500) - (wallet.availableBalance || 0)} more to unlock withdrawals
                </p>
              )}
            </div>
          </div>

          <div className="bg-background rounded-2xl p-5 border border-borderCol w-full md:w-80 shrink-0 shadow-inner">
            <h3 className="font-bold text-sm text-textDark mb-3">Request Payout</h3>
            <form onSubmit={handleWithdraw} className="space-y-3">
              <div className="relative">
                <span className="absolute left-4 top-3 font-bold text-textLight">₹</span>
                <input 
                  type="number" 
                  min={wallet.minWithdrawalLimit || 500} 
                  max={wallet.availableBalance || 0}
                  required
                  disabled={(wallet.availableBalance || 0) < (wallet.minWithdrawalLimit || 500) || isActionLoading}
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full pl-8 pr-4 py-3 bg-surface border border-borderCol rounded-xl focus:ring-2 focus:ring-primary outline-none font-bold text-textDark disabled:opacity-50"
                />
              </div>
              
              <p className="text-[9px] text-textLight leading-tight">
                *Platform commission of <span className="font-bold text-primary">{wallet.commissionRatePercent || 10}%</span> will be deducted at the time of payout transfer.
              </p>

              <button 
                type="submit" 
                disabled={(wallet.availableBalance || 0) < (wallet.minWithdrawalLimit || 500) || isActionLoading}
                className="w-full py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2 shadow-sm"
              >
                {isActionLoading ? <Loader2 size={18} className="animate-spin"/> : 'Withdraw Funds'}
              </button>
            </form>
          </div>

        </div>
      </div>

      {/* 2. HISTORY TABS */}
      <div className="flex bg-surface border border-borderCol rounded-xl p-1 w-full shadow-sm">
        {['Earnings', 'Withdrawals'].map(tab => (
          <button 
            key={tab} 
            onClick={() => setActiveTab(tab)} 
            className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all ${activeTab === tab ? 'bg-background text-primary shadow-sm border border-borderCol' : 'text-textLight hover:text-textDark'}`}
          >
            {tab} History
          </button>
        ))}
      </div>

      {/* 3. HISTORY LISTS */}
      <div className="bg-surface border border-borderCol rounded-2xl shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-4 space-y-3">
            {[1, 2, 3, 4].map(i => <Skeleton key={i} className="w-full h-16 rounded-xl" />)}
          </div>
        ) : activeTab === 'Earnings' ? (
          
          orderHistory.length === 0 ? (
            <div className="p-10 text-center text-textLight">No completed orders yet.</div>
          ) : (
            <div className="divide-y divide-borderCol">
              {orderHistory.map((order) => (
                <div key={order.orderId} className="p-4 hover:bg-background/50 transition-colors flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-success/10 text-success flex items-center justify-center shrink-0">
                      <Receipt size={18} />
                    </div>
                    <div>
                      <p className="font-bold text-textDark text-sm">Order #{order.orderId.slice(-6).toUpperCase()}</p>
                      <p className="text-xs text-textLight mt-0.5">{new Date(order.date).toLocaleString()} • {order.itemsCount} Items</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-textLight uppercase tracking-widest mb-0.5">Item Total</p>
                    <p className="font-black text-success text-base">+ ₹{order.earnedAmount}</p>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          
          withdrawalHistory.length === 0 ? (
            <div className="p-10 text-center text-textLight">No withdrawals requested yet.</div>
          ) : (
            <div className="divide-y divide-borderCol">
              {withdrawalHistory.map((wd) => (
                <div key={wd._id} className="p-4 hover:bg-background/50 transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0
                      ${wd.status === 'Completed' ? 'bg-success/10 text-success' : 
                        wd.status === 'Rejected' ? 'bg-error/10 text-error' : 'bg-warning/10 text-warning'}`}
                    >
                      {wd.status === 'Completed' ? <CheckCircle2 size={18}/> : 
                       wd.status === 'Rejected' ? <AlertCircle size={18}/> : <Clock size={18}/>}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-textDark text-sm">Payout Request</p>
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-md border 
                          ${wd.status === 'Completed' ? 'bg-success/10 text-success border-success/20' : 
                            wd.status === 'Rejected' ? 'bg-error/10 text-error border-error/20' : 'bg-warning/10 text-warning border-warning/20'}`}>
                          {wd.status}
                        </span>
                      </div>
                      <p className="text-xs text-textLight mt-0.5">{new Date(wd.createdAt).toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="w-full sm:w-auto flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center bg-background sm:bg-transparent p-3 sm:p-0 rounded-xl border sm:border-none border-borderCol">
                    <div className="text-left sm:text-right">
                      <p className="text-[10px] font-bold text-textLight uppercase tracking-widest">Gross</p>
                      <p className="font-bold text-textDark text-sm">₹{wd.amountRequested}</p>
                    </div>
                    <div className="text-left sm:text-right px-4 sm:px-0 sm:mt-1 border-l border-r sm:border-none border-borderCol">
                      <p className="text-[10px] font-bold text-textLight uppercase tracking-widest">Platform Fee</p>
                      <p className="font-bold text-error text-xs">- ₹{wd.ownerCommissionDeducted}</p>
                    </div>
                    <div className="text-right sm:mt-1">
                      <p className="text-[10px] font-bold text-textLight uppercase tracking-widest">To Bank</p>
                      <p className="font-black text-primary text-base">₹{wd.netPayable}</p>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          )
        )}
      </div>

    </div>
  );
};

export default Transactions;