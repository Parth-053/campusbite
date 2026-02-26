import React from 'react';

const RegisterStep1 = ({ data, updateData, onNext }) => {
  const handleSubmit = (e) => { e.preventDefault(); onNext(); };
  const inputClass = "w-full px-4 py-3 bg-background border border-borderCol rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all text-textDark placeholder:text-textLight/60 font-medium";

  return (
    <form onSubmit={handleSubmit} className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
      <h3 className="text-lg font-black text-textDark border-b border-borderCol pb-2 mb-4">Step 1: Personal Details</h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-textLight uppercase tracking-widest mb-1.5">First Name</label>
          <input type="text" required className={inputClass} placeholder="John" value={data.firstName} onChange={e => updateData('personal', 'firstName', e.target.value)} />
        </div>
        <div>
          <label className="block text-xs font-bold text-textLight uppercase tracking-widest mb-1.5">Last Name</label>
          <input type="text" required className={inputClass} placeholder="Doe" value={data.lastName} onChange={e => updateData('personal', 'lastName', e.target.value)} />
        </div>
      </div>
      <div>
        <label className="block text-xs font-bold text-textLight uppercase tracking-widest mb-1.5">Email Address</label>
        <input type="email" required className={inputClass} placeholder="john@business.com" value={data.email} onChange={e => updateData('personal', 'email', e.target.value)} />
      </div>
      <div>
        <label className="block text-xs font-bold text-textLight uppercase tracking-widest mb-1.5">Mobile Number</label>
        <input type="tel" required className={inputClass} placeholder="10-digit number" pattern="[0-9]{10}" maxLength="10" value={data.mobile} onChange={e => updateData('personal', 'mobile', e.target.value)} />
      </div>
      <div>
        <label className="block text-xs font-bold text-textLight uppercase tracking-widest mb-1.5">Password</label>
        <input type="password" required className={inputClass} placeholder="Min 6 characters" minLength="6" value={data.password} onChange={e => updateData('personal', 'password', e.target.value)} />
      </div>
      <div className="pt-4">
        <button type="submit" className="w-full py-4 bg-primary text-white font-black rounded-xl hover:bg-primary-dark transition-all shadow-lg hover:shadow-primary/30">Next Step</button>
      </div>
    </form>
  );
};
export default RegisterStep1;