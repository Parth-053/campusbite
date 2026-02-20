import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { MailCheck, Loader2 } from 'lucide-react';

const VerifyEmail = () => {
  const [otp, setOtp] = useState('');
  const { verify, isLoading, error, tempEmail } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    verify({ email: tempEmail, otp });
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-slate-100 text-center animate-in zoom-in-95 duration-300">
      <div className="w-16 h-16 bg-blue-100 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
        <MailCheck size={32} />
      </div>

      <h2 className="text-2xl font-bold text-slate-800 mb-2">Verify Email</h2>
      <p className="text-slate-500 mb-6 text-sm">
        We've sent a 6-digit code to <br/>
        <span className="font-semibold text-slate-800">{tempEmail || 'your email'}</span>
      </p>

      {error && (
        <div className="mb-4 text-red-600 text-sm bg-red-50 p-2 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input 
          type="text" 
          placeholder="Enter 6-digit OTP (Try 123456)" 
          className="input-field text-center text-2xl tracking-widest font-bold"
          maxLength={6}
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />
        
        <button type="submit" className="btn-primary w-full py-3" disabled={isLoading || otp.length < 6}>
          {isLoading ? (
            <span className="flex items-center justify-center gap-2"><Loader2 className="animate-spin" /> Verifying...</span>
          ) : 'Verify Account'}
        </button>
      </form>

      <button className="mt-4 text-sm text-slate-400 hover:text-primary underline">Resend Code</button>
    </div>
  );
};

export default VerifyEmail;