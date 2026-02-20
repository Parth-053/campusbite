import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Phone, Lock, ArrowRight, ArrowLeft, MapPin } from 'lucide-react';
import { fetchLocationData, sendRegistrationOtp, clearAuthError } from '../../store/authSlice';

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { locationData, isLoading, error } = useSelector(state => state.auth);
  
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', password: '',
    state: '', district: '', college: '', hostel: '', roomNo: ''
  });

  useEffect(() => {
    dispatch(fetchLocationData());
    dispatch(clearAuthError());
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const newData = { ...prev, [name]: value };
      // Cascading Reset Logic
      if (name === 'state') { newData.district = ''; newData.college = ''; newData.hostel = ''; }
      if (name === 'district') { newData.college = ''; newData.hostel = ''; }
      if (name === 'college') { newData.hostel = ''; }
      return newData;
    });
  };

  const handleNext = (e) => {
    e.preventDefault();
    setStep(2);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(sendRegistrationOtp(formData)).then((res) => {
      if (!res.error) navigate('/verify-email');
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-100 p-8 animate-in zoom-in-95 duration-300">
        
        <div className="text-center mb-6">
          <h1 className="text-2xl font-black text-gray-900">Create Account</h1>
          <p className="text-gray-500 text-sm mt-1">Step {step} of 2: {step === 1 ? 'Personal Details' : 'College Address'}</p>
        </div>

        {/* Progress Bar */}
        <div className="flex gap-2 mb-8">
          <div className="h-1.5 flex-1 bg-primary rounded-full"></div>
          <div className={`h-1.5 flex-1 rounded-full transition-colors ${step === 2 ? 'bg-primary' : 'bg-gray-200'}`}></div>
        </div>

        {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-bold mb-6 text-center">{error}</div>}

        <form onSubmit={step === 1 ? handleNext : handleSubmit} className="space-y-4">
          
          {/* --- STEP 1: PERSONAL DETAILS --- */}
          {step === 1 && (
            <div className="space-y-4 animate-in slide-in-from-left-4 duration-300">
              <div className="relative">
                <User className="absolute left-3 top-3 text-gray-400" size={18} />
                <input type="text" name="name" required value={formData.name} onChange={handleChange} className="w-full pl-10 pr-4 py-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none" placeholder="Full Name" />
              </div>
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
                <input type="email" name="email" required value={formData.email} onChange={handleChange} className="w-full pl-10 pr-4 py-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none" placeholder="Email Address" />
              </div>
              <div className="relative">
                <Phone className="absolute left-3 top-3 text-gray-400" size={18} />
                <input type="tel" name="phone" required value={formData.phone} onChange={handleChange} className="w-full pl-10 pr-4 py-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none" placeholder="Phone Number" />
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
                <input type="password" name="password" required value={formData.password} onChange={handleChange} className="w-full pl-10 pr-4 py-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none" placeholder="Create Password" />
              </div>
              
              <button type="submit" className="w-full bg-primary text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-indigo-700 mt-2">
                Next Step <ArrowRight size={18} />
              </button>
            </div>
          )}

          {/* --- STEP 2: COLLEGE ADDRESS --- */}
          {step === 2 && (
            <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
              
              <div className="relative">
                <MapPin className="absolute left-3 top-3 text-gray-400" size={18} />
                <input type="text" value="India" disabled className="w-full pl-10 pr-4 py-2.5 border bg-gray-50 text-gray-500 rounded-lg text-sm cursor-not-allowed" />
              </div>

              <select name="state" required value={formData.state} onChange={handleChange} className="w-full px-4 py-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none">
                <option value="">Select State</option>
                {locationData?.states.map(s => <option key={s} value={s}>{s}</option>)}
              </select>

              <select name="district" required disabled={!formData.state} value={formData.district} onChange={handleChange} className="w-full px-4 py-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none disabled:bg-gray-50">
                <option value="">Select District</option>
                {formData.state && locationData?.districts[formData.state]?.map(d => <option key={d} value={d}>{d}</option>)}
              </select>

              <select name="college" required disabled={!formData.district} value={formData.college} onChange={handleChange} className="w-full px-4 py-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none disabled:bg-gray-50">
                <option value="">Select College</option>
                {formData.district && locationData?.colleges[formData.district]?.map(c => <option key={c} value={c}>{c}</option>)}
              </select>

              <select name="hostel" required disabled={!formData.college} value={formData.hostel} onChange={handleChange} className="w-full px-4 py-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none disabled:bg-gray-50">
                <option value="">Select Hostel</option>
                {formData.college && locationData?.hostels[formData.college]?.map(h => <option key={h} value={h}>{h}</option>)}
              </select>

              <input type="text" name="roomNo" required value={formData.roomNo} onChange={handleChange} className="w-full px-4 py-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none" placeholder="Room Number (e.g., A-102)" />

              <div className="flex gap-3 mt-4">
                <button type="button" onClick={() => setStep(1)} className="px-4 py-3 border border-gray-300 text-gray-600 font-bold rounded-lg hover:bg-gray-50">
                  <ArrowLeft size={18} />
                </button>
                <button type="submit" disabled={isLoading} className="flex-1 bg-primary text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-indigo-700 disabled:opacity-70">
                  {isLoading ? 'Processing...' : 'Verify Email'}
                </button>
              </div>
            </div>
          )}
        </form>

        {step === 1 && (
          <p className="text-center text-sm text-gray-600 mt-6">
            Already have an account? <Link to="/login" className="font-bold text-primary hover:underline">Log in</Link>
          </p>
        )}
      </div>
    </div>
  );
};

export default Register;