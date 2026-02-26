import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { MailCheck, ArrowRight, Loader2 } from 'lucide-react';
import { verifyOtpAndRegister, sendRegistrationOtp, clearAuthError } from '../../store/authSlice';

const VerifyEmail = () => {
  const [otp, setOtp] = useState('');
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { tempUserData, isLoading, error } = useSelector(state => state.auth);

  useEffect(() => {
    dispatch(clearAuthError());
    if (!tempUserData) navigate('/register', { replace: true }); 
  }, [tempUserData, navigate, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(verifyOtpAndRegister({ otp, userData: tempUserData })).then((res) => {
      if (!res.error) navigate('/home', { replace: true }); 
    });
  };

  const handleResend = () => {
    if (tempUserData) dispatch(sendRegistrationOtp(tempUserData));
  };

  if (!tempUserData) return null; 

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-surface rounded-3xl shadow-soft border border-borderCol p-8 text-center animate-in zoom-in-95 duration-300">
        
        <div className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-6 border border-primary/20">
          <MailCheck size={36} strokeWidth={2.5}/>
        </div>
        
        <h1 className="text-3xl font-black text-textDark mb-2 tracking-tight">Verify Email</h1>
        <p className="text-textLight text-sm mb-8 font-medium leading-relaxed">
          We've sent a 6-digit verification code to <br/><strong className="text-textDark">{tempUserData.email}</strong>. 
        </p>

        {error && <div className="mb-6 p-3.5 bg-error/10 text-error text-sm rounded-xl font-bold border border-error/20">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <input 
            type="text" 
            maxLength={6}
            required
            value={otp} 
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))} 
            className="w-full text-center tracking-[0.5em] font-black text-3xl py-4 bg-background border border-borderCol rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all placeholder:tracking-normal placeholder:text-base placeholder:font-normal" 
            placeholder="000000"
          />

          <button type="submit" disabled={isLoading || otp.length !== 6} className="w-full bg-accent text-white font-black py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-accent-hover transition-all shadow-floating disabled:opacity-70 transform active:scale-[0.98]">
            {isLoading ? <Loader2 className="animate-spin" size={20}/> : <>Complete Registration <ArrowRight size={18} /></>}
          </button>
        </form>

        <p className="text-sm text-textLight mt-8 font-medium">
          Didn't receive the code?{' '}
          <button type="button" onClick={handleResend} disabled={isLoading} className="font-black text-primary hover:underline disabled:opacity-50">Resend Now</button>
        </p>
      </div>
    </div>
  );
};

export default VerifyEmail;