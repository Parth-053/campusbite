import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Phone, Lock, ArrowRight, MapPin, Loader2, AlertCircle } from 'lucide-react';
import { sendRegistrationOtp, clearAuthError } from '../../store/authSlice';
import { fetchStates, fetchDistricts, fetchColleges, fetchHostels } from '../../store/locationSlice';

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error } = useSelector(state => state.auth);
  const locationData = useSelector(state => state.location);
  
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', password: '', state: '', district: '', college: '', hostel: '', roomNo: ''
  });

  useEffect(() => {
    dispatch(fetchStates());
    dispatch(clearAuthError());
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (name === 'state') { setFormData(prev => ({ ...prev, district: '', college: '', hostel: '' })); dispatch(fetchDistricts(value)); }
    if (name === 'district') { setFormData(prev => ({ ...prev, college: '', hostel: '' })); dispatch(fetchColleges(value)); }
    if (name === 'college') { setFormData(prev => ({ ...prev, hostel: '' })); dispatch(fetchHostels(value)); }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(sendRegistrationOtp(formData)).then((res) => {
      if(!res.error) navigate('/verify-email');
    });
  };

  const inputClass = "w-full pl-12 pr-4 py-3.5 border border-borderCol rounded-xl font-bold text-textDark focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all placeholder:font-normal";
  const selectClass = "w-full px-4 py-3.5 border border-borderCol rounded-xl font-bold text-textDark focus:ring-2 focus:ring-primary outline-none disabled:opacity-50 transition-all";

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center p-4 py-10 relative overflow-hidden">
      <div className="w-full max-w-md bg-surface rounded-3xl shadow-soft border border-borderCol p-8 relative z-10">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-black text-textDark tracking-tight">Create Account</h1>
          <p className="text-textLight text-sm mt-1 font-medium">Join the ultimate campus food network!</p>
        </div>

        {error && (
          <div className="mb-6 p-3.5 bg-error/10 text-error text-sm rounded-xl flex items-start gap-2 border border-error/20">
            <AlertCircle size={18} className="shrink-0 mt-0.5" />
            <p className="font-bold">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <User className="absolute left-4 top-3.5 text-textLight" size={18} />
              <input type="text" name="name" required value={formData.name} onChange={handleChange} className={inputClass} placeholder="Full Name" />
            </div>
            <div className="relative">
              <Mail className="absolute left-4 top-3.5 text-textLight" size={18} />
              <input type="email" name="email" required value={formData.email} onChange={handleChange} className={inputClass} placeholder="Email Address" />
            </div>
            <div className="relative">
              <Phone className="absolute left-4 top-3.5 text-textLight" size={18} />
              <input type="tel" name="phone" required value={formData.phone} onChange={handleChange} pattern="[0-9]{10}" maxLength="10" className={inputClass} placeholder="10-digit Mobile Number" />
            </div>
            <div className="relative mb-6">
              <Lock className="absolute left-4 top-3.5 text-textLight" size={18} />
              <input type="password" name="password" minLength="6" required value={formData.password} onChange={handleChange} className={inputClass} placeholder="Create Password (Min 6 chars)" />
            </div>

            <div className="pt-2 border-t border-borderCol">
               <label className="flex items-center gap-2 text-xs font-bold text-textLight uppercase tracking-widest mb-3 mt-4"><MapPin size={14}/> Campus Details</label>
               <div className="space-y-3">
                  <select name="state" required value={formData.state} onChange={handleChange} className={selectClass}><option value="" disabled>Select State</option>{locationData?.states?.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}</select>
                  <select name="district" required value={formData.district} onChange={handleChange} disabled={!formData.state} className={selectClass}><option value="" disabled>Select District</option>{locationData?.districts?.map(d => <option key={d._id} value={d._id}>{d.name}</option>)}</select>
                  <select name="college" required value={formData.college} onChange={handleChange} disabled={!formData.district} className={selectClass}><option value="" disabled>Select College</option>{locationData?.colleges?.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}</select>
                  <select name="hostel" required value={formData.hostel} onChange={handleChange} disabled={!formData.college} className={selectClass}><option value="" disabled>Select Hostel</option>{locationData?.hostels?.map(h => <option key={h._id} value={h._id}>{h.name}</option>)}</select>
                  <input type="text" name="roomNo" value={formData.roomNo} onChange={handleChange} className="w-full px-4 py-3.5 border border-borderCol rounded-xl font-bold text-textDark focus:ring-2 focus:ring-primary outline-none transition-all placeholder:font-normal" placeholder="Room Number (Optional)" />
               </div>
            </div>

            <button type="submit" disabled={isLoading} className="w-full mt-6 bg-accent text-white font-black py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-accent-hover shadow-floating disabled:opacity-70 transition-all transform active:scale-[0.98]">
              {isLoading ? <Loader2 className="animate-spin" size={20} /> : <>Continue & Verify <ArrowRight size={18} /></>}
            </button>
        </form>

        <p className="text-center text-sm text-textLight mt-8 font-medium">
          Already have an account? <Link to="/login" className="font-black text-primary hover:text-primary-light transition-colors ml-1">Login Here</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;