import React from 'react';

const RegisterStep1 = ({ data, updateData, onNext }) => {
  const handleSubmit = (e) => { e.preventDefault(); onNext(); };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
      <h3 className="text-lg font-bold text-slate-800 border-b pb-2 mb-4">Step 1: Personal Details</h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">First Name</label>
          <input type="text" required className="input-field" placeholder="John" value={data.firstName} onChange={e => updateData('personal', 'firstName', e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Last Name</label>
          <input type="text" required className="input-field" placeholder="Doe" value={data.lastName} onChange={e => updateData('personal', 'lastName', e.target.value)} />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
        <input type="email" required className="input-field" placeholder="john@example.com" value={data.email} onChange={e => updateData('personal', 'email', e.target.value)} />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Mobile Number</label>
        <input type="tel" required className="input-field" placeholder="10-digit number" pattern="[0-9]{10}" maxLength="10" value={data.mobile} onChange={e => updateData('personal', 'mobile', e.target.value)} />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
        <input type="password" required className="input-field" placeholder="Min 6 characters" minLength="6" value={data.password} onChange={e => updateData('personal', 'password', e.target.value)} />
      </div>
      <button type="submit" className="btn-primary w-full mt-2">Next: Canteen Info</button>
    </form>
  );
};
export default RegisterStep1;