import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Phone, Lock, ArrowRight, ArrowLeft, MapPin } from 'lucide-react';
import { sendRegistrationOtp, clearAuthError } from '../../store/authSlice';
import { fetchStates, fetchDistricts, fetchColleges, fetchHostels } from '../../store/locationSlice';

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error } = useSelector(state => state.auth);
  const locationData = useSelector(state => state.location);
  
  const [step, setStep] = useState(1);
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

  const handleNext = (e) => { e.preventDefault(); setStep(2); };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(sendRegistrationOtp(formData)).then((res) => {
      if (!res.error) navigate('/verify-email');
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-primary mb-2">CampusCanteen</h1>
          <p className="text-gray-500 text-sm">Create your student account.</p>
        </div>

        {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-bold mb-6">{error}</div>}

        <form onSubmit={step === 1 ? handleNext : handleSubmit} className="space-y-4">
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
              <div className="relative"><User className="absolute left-3 top-3 text-gray-400" size={18} /><input type="text" name="name" required value={formData.name} onChange={handleChange} className="w-full pl-10 pr-4 py-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none" placeholder="Full Name" /></div>
              <div className="relative"><Mail className="absolute left-3 top-3 text-gray-400" size={18} /><input type="email" name="email" required value={formData.email} onChange={handleChange} className="w-full pl-10 pr-4 py-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none" placeholder="Email Address" /></div>
              <div className="relative"><Phone className="absolute left-3 top-3 text-gray-400" size={18} /><input type="tel" name="phone" required value={formData.phone} onChange={handleChange} className="w-full pl-10 pr-4 py-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none" placeholder="Phone Number" /></div>
              <div className="relative"><Lock className="absolute left-3 top-3 text-gray-400" size={18} /><input type="password" name="password" required value={formData.password} onChange={handleChange} className="w-full pl-10 pr-4 py-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none" placeholder="Password (Min 6 chars)" minLength="6" /></div>
              <button type="submit" className="w-full bg-primary text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-indigo-700">Next Step <ArrowRight size={18} /></button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-left-4">
              <h3 className="text-sm font-bold text-gray-500 uppercase flex items-center gap-2 mb-4"><MapPin size={16}/> Campus Details</h3>
              <select name="state" required value={formData.state} onChange={handleChange} className="w-full px-4 py-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none"><option value="">Select State</option>{locationData?.states?.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}</select>
              <select name="district" required value={formData.district} onChange={handleChange} disabled={!formData.state} className="w-full px-4 py-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none disabled:bg-gray-50"><option value="">Select District</option>{locationData?.districts?.map(d => <option key={d._id} value={d._id}>{d.name}</option>)}</select>
              <select name="college" required value={formData.college} onChange={handleChange} disabled={!formData.district} className="w-full px-4 py-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none disabled:bg-gray-50"><option value="">Select College</option>{locationData?.colleges?.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}</select>
              <select name="hostel" required value={formData.hostel} onChange={handleChange} disabled={!formData.college} className="w-full px-4 py-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none disabled:bg-gray-50"><option value="">Select Hostel</option>{locationData?.hostels?.map(h => <option key={h._id} value={h._id}>{h.name}</option>)}</select>
              <input type="text" name="roomNo" value={formData.roomNo} onChange={handleChange} className="w-full px-4 py-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none" placeholder="Room Number (Optional)" />

              <div className="flex gap-3 mt-4">
                <button type="button" onClick={() => setStep(1)} className="px-4 py-3 border border-gray-300 text-gray-600 font-bold rounded-lg hover:bg-gray-50"><ArrowLeft size={18} /></button>
                <button type="submit" disabled={isLoading} className="flex-1 bg-primary text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-indigo-700 disabled:opacity-70">
                  {isLoading ? 'Sending OTP...' : 'Verify Email'}
                </button>
              </div>
            </div>
          )}
        </form>

        {step === 1 && (<p className="text-center text-sm text-gray-600 mt-6">Already have an account? <Link to="/login" className="font-bold text-primary hover:underline">Log in</Link></p>)}
      </div>
    </div>
  );
};

export default Register;