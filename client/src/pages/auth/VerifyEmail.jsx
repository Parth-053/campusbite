import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, ArrowRight } from 'lucide-react';
import { verifyOtpAndRegister, clearAuthError } from '../../store/authSlice';

const VerifyEmail = () => {
  const [otp, setOtp] = useState('');
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { tempUserData, isLoading, error } = useSelector(state => state.auth);

  useEffect(() => {
    dispatch(clearAuthError());
    // Security check: If no temp user data exists, redirect to register
    if (!tempUserData) {
      navigate('/register');
    }
  }, [tempUserData, navigate, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(verifyOtpAndRegister({ otp, userData: tempUserData })).then((res) => {
      if (!res.error) navigate('/'); // Success! Send to home
    });
  };

  if (!tempUserData) return null; // Prevent flicker during redirect

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-100 p-8 text-center animate-in zoom-in-95 duration-300">
        
        <div className="w-16 h-16 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShieldCheck size={32} />
        </div>
        
        <h1 className="text-2xl font-black text-gray-900 mb-2">Verify your email</h1>
        <p className="text-gray-500 text-sm mb-6">
          We've sent a 6-digit code to <span className="font-bold text-gray-800">{tempUserData.email}</span>. 
          <br/><span className="text-xs text-primary">(Mock code: 123456)</span>
        </p>

        {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-bold mb-6">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <input 
            type="text" 
            maxLength={6}
            required
            value={otp} 
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))} // Numbers only
            className="w-full text-center tracking-[1em] font-black text-2xl py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none" 
            placeholder="------"
          />

          <button 
            type="submit" disabled={isLoading || otp.length !== 6}
            className="w-full bg-primary text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-indigo-700 disabled:opacity-50 transition-colors"
          >
            {isLoading ? 'Verifying...' : <>Confirm & Create Account <ArrowRight size={18} /></>}
          </button>
        </form>

      </div>
    </div>
  );
};

export default VerifyEmail;