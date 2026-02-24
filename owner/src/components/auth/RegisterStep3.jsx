import React from 'react';
import { Loader2, ShieldCheck } from 'lucide-react';

const RegisterStep3 = ({ data, updateData, onSubmit, onBack, isLoading }) => {
  const handleSubmit = (e) => { e.preventDefault(); onSubmit(); };
  const inputClass = "w-full px-4 py-3 bg-background border border-borderCol rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-textDark placeholder:text-textLight";

  return (
    <form onSubmit={handleSubmit} className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
      <h3 className="text-lg font-bold text-textDark border-b border-borderCol pb-2 mb-4">Step 3: Payout Details</h3>
      <p className="text-sm text-textLight mb-4">Provide your UPI ID to receive earnings directly to your bank account.</p>

      <div>
        <label className="block text-sm font-semibold text-textDark mb-1.5">UPI ID</label>
        <input type="text" required className={inputClass} placeholder="e.g. businessname@upi or 9876543210@paytm" value={data.upiId} onChange={e => updateData('payment', 'upiId', e.target.value)} />
      </div>

      <div className="bg-primary/10 text-primary p-4 rounded-xl text-xs border border-primary/20 mt-6 flex items-start gap-3">
        <ShieldCheck size={20} className="shrink-0 mt-0.5" />
        <div>
          <span className="font-bold block text-sm mb-1">Approval Required</span> 
          Your application will be securely verified. You can start operating and managing orders once the Administration approves your business.
        </div>
      </div>

      <div className="flex gap-4 pt-6">
        <button type="button" onClick={onBack} disabled={isLoading} className="w-full py-3.5 bg-background text-textDark border border-borderCol font-bold rounded-xl hover:bg-borderCol transition-colors disabled:opacity-50">
          Back
        </button>
        <button type="submit" disabled={isLoading} className="w-full py-3.5 bg-success text-white font-bold rounded-xl hover:bg-green-700 transition-colors shadow-md disabled:opacity-70 flex justify-center items-center">
          {isLoading ? <span className="flex items-center gap-2"><Loader2 className="animate-spin" size={18}/> Submitting...</span> : 'Submit Application'}
        </button>
      </div>
    </form>
  );
};

export default RegisterStep3;