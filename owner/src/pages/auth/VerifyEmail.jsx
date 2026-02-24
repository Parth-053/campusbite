import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { MailCheck, Loader2 } from 'lucide-react';

const VerifyEmail = () => {
  const [otp, setOtp] = useState('');
  const [resendMsg, setResendMsg] = useState('');
  const { verify, resendOtp, isLoading, error, tempEmail, resetError } = useAuth();
  
  const { owner } = useSelector((state) => state.auth);
  const navigate = useNavigate();
 
  useEffect(() => {
    if (owner) {
      const isVerified = owner.isVerified === true || owner.isEmailVerified === true;
      if (isVerified) {
        if (owner.status === 'pending') navigate('/approval-pending', { replace: true });
        else navigate('/dashboard', { replace: true });
      }
    }
  }, [owner, navigate]);

  useEffect(() => { 
    return () => { if (resetError) resetError(); }; 
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    verify({ otp });
  };

  const handleResend = async () => {
    setResendMsg('');
    const action = await resendOtp();
    if(!action.error) {
      setResendMsg('New code sent successfully!');
      setTimeout(() => setResendMsg(''), 5000); 
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="bg-surface p-8 rounded-2xl shadow-xl w-full max-w-md border border-borderCol text-center animate-in zoom-in-95 duration-300">
        <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
          <MailCheck size={32} />
        </div>
        <h2 className="text-2xl font-bold text-textDark tracking-tight mb-2">Verify Email</h2>
        <p className="text-textLight mb-6 text-sm leading-relaxed">
          We've sent a 6-digit security code to <br/>
          <span className="font-bold text-textDark">{tempEmail || owner?.email || 'your email'}</span>
        </p>

        {error && <div className="mb-5 text-error text-sm bg-error/10 border border-error/20 p-3 rounded-lg font-medium">{error}</div>}
        {resendMsg && <div className="mb-5 text-success text-sm bg-success/10 border border-success/20 p-3 rounded-lg font-medium">{resendMsg}</div>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <input 
            type="text" 
            placeholder="Enter 6-digit code" 
            className="w-full px-4 py-4 bg-background border border-borderCol rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-textDark text-center text-2xl tracking-[0.5em] font-black placeholder:tracking-normal placeholder:text-base placeholder:font-normal placeholder:text-textLight"
            maxLength={6}
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
          />
          <button type="submit" className="w-full py-3.5 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-colors shadow-md disabled:opacity-70 flex justify-center items-center" disabled={isLoading || otp.length < 6}>
            {isLoading ? <span className="flex items-center gap-2"><Loader2 className="animate-spin" size={18}/> Verifying...</span> : 'Confirm & Proceed'}
          </button>
        </form>

        <div className="mt-8 text-sm text-textLight">
          Didn't receive the code? <button onClick={handleResend} disabled={isLoading} className="font-bold text-primary hover:text-primary-dark transition-colors disabled:opacity-50">Resend Code</button>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;