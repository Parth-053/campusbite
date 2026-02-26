import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { MailCheck, Loader2 } from 'lucide-react';

const VerifyEmail = () => {
  const [otp, setOtp] = useState('');
  const [resendMsg, setResendMsg] = useState('');
  const { verify, resendOtp, isLoading, error, resetError } = useAuth();
   
  const { ownerData, registeredEmail } = useSelector((state) => state.auth);
  const navigate = useNavigate();
 
  useEffect(() => {
    if (ownerData) {
      const isVerified = ownerData.isVerified === true;
      if (isVerified) {
        if (ownerData.status === 'pending') navigate('/approval-pending', { replace: true });
        else navigate('/dashboard', { replace: true });
      }
    }
  }, [ownerData, navigate]);

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
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
      <div className="bg-surface p-8 sm:p-10 rounded-3xl shadow-2xl w-full max-w-md border border-borderCol text-center relative z-10 animate-in zoom-in-95 duration-300">
        
        <div className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-6 border border-primary/20">
          <MailCheck size={36} strokeWidth={2.5} />
        </div>
        <h2 className="text-2xl font-black text-textDark mb-3 tracking-tight">Verify Email</h2>
        <p className="text-textLight mb-8 text-sm font-medium">
          We've sent a 6-digit verification code to <br/><strong className="text-textDark">{registeredEmail || ownerData?.email || 'your email'}</strong>.
        </p>

        {error && <div className="mb-6 text-error text-sm bg-error/10 border border-error/20 p-3.5 rounded-xl font-bold">{error}</div>}
        {resendMsg && <div className="mb-6 text-success text-sm bg-success/10 border border-success/20 p-3.5 rounded-xl font-bold">{resendMsg}</div>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <input 
            type="text" 
            placeholder="Enter 6-digit code" 
            className="w-full px-4 py-4 bg-background border border-borderCol rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-textDark text-center text-3xl tracking-[0.4em] font-black placeholder:tracking-normal placeholder:text-base placeholder:font-normal placeholder:text-textLight/60"
            maxLength={6}
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
          />
          <button type="submit" className="w-full py-4 bg-primary text-white font-black rounded-xl hover:bg-primary-dark transition-all shadow-lg hover:shadow-primary/30 disabled:opacity-70 flex justify-center items-center" disabled={isLoading || otp.length < 6}>
            {isLoading ? <span className="flex items-center gap-2"><Loader2 className="animate-spin" size={18}/> Verifying...</span> : 'Confirm & Proceed'}
          </button>
        </form>

        <div className="mt-8 text-sm text-textLight font-medium">
          Didn't receive the code? <button onClick={handleResend} disabled={isLoading} className="font-bold text-primary hover:text-primary-dark transition-colors disabled:opacity-50 ml-1">Resend now</button>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;