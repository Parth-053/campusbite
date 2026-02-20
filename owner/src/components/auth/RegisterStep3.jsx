import React from 'react';

const RegisterStep3 = ({ data, updateData, onSubmit, onBack, isLoading }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
      <h3 className="text-lg font-bold text-slate-800 border-b pb-2 mb-4">Step 3: Bank Details</h3>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Account Holder Name</label>
        <input 
          type="text" required className="input-field" 
          value={data.holderName} onChange={e => updateData('bank', 'holderName', e.target.value)} 
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Account Number</label>
        <input 
          type="text" required pattern="[0-9]{9,18}" className="input-field" 
          value={data.accountNumber} onChange={e => updateData('bank', 'accountNumber', e.target.value)} 
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">IFSC Code</label>
        <input 
          type="text" required pattern="^[A-Z]{4}0[A-Z0-9]{6}$" placeholder="e.g. SBIN0001234" className="input-field uppercase" 
          value={data.ifsc} onChange={e => updateData('bank', 'ifsc', e.target.value)} 
        />
      </div>

      <div className="flex gap-4 pt-4">
        <button type="button" onClick={onBack} className="btn-secondary w-full" disabled={isLoading}>Back</button>
        <button type="submit" className="btn-primary w-full" disabled={isLoading}>
          {isLoading ? 'Submitting...' : 'Complete Registration'}
        </button>
      </div>
    </form>
  );
};

export default RegisterStep3;