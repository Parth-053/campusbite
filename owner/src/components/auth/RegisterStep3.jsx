import React from 'react';
import { Loader2 } from 'lucide-react';

const RegisterStep3 = ({ data, updateData, onSubmit, onBack, isLoading }) => {
  const handleSubmit = (e) => { e.preventDefault(); onSubmit(); };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
      <h3 className="text-lg font-bold text-slate-800 border-b pb-2 mb-4">Step 3: Payout Details</h3>
      <p className="text-sm text-slate-500 mb-4">Provide your UPI ID to receive payments directly to your bank account.</p>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">UPI ID</label>
        <input type="text" required className="input-field" placeholder="e.g. yourname@upi or 9876543210@paytm" value={data.upiId} onChange={e => updateData('payment', 'upiId', e.target.value)} />
      </div>

      <div className="bg-blue-50 text-blue-800 p-3 rounded-lg text-xs border border-blue-100 mt-4">
        <span className="font-bold">Note:</span> Your application will be sent for review. You can start operating once the Admin approves your canteen.
      </div>

      <div className="flex gap-4 pt-4">
        <button type="button" onClick={onBack} disabled={isLoading} className="btn-secondary w-full border border-slate-300 rounded-lg p-3 font-semibold text-slate-700 hover:bg-slate-50">
          Back
        </button>
        <button type="submit" disabled={isLoading} className="btn-primary w-full flex items-center justify-center gap-2">
          {isLoading ? <><Loader2 className="animate-spin" size={18}/> Submitting...</> : 'Complete Registration'}
        </button>
      </div>
    </form>
  );
};
export default RegisterStep3;