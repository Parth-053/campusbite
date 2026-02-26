import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Mail, ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const { resetPassword, isLoading, error, resetError } = useAuth();

  useEffect(() => { 
    return () => {
      if (resetError) resetError();
    }; 
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const resultAction = await resetPassword(email);
    if (!resultAction.error) setSubmitted(true); 
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
      <div className="bg-surface p-8 sm:p-10 rounded-3xl shadow-2xl w-full max-w-md border border-borderCol relative z-10 animate-in zoom-in-95 duration-300">
        <Link to="/login" className="inline-flex items-center text-textLight hover:text-primary mb-8 text-sm font-bold transition-colors">
          <ArrowLeft size={16} className="mr-1.5" /> Back to Login
        </Link>
        <h2 className="text-2xl font-black text-textDark mb-2 tracking-tight">Reset Password</h2>
        
        {error && <div className="mb-6 p-3.5 bg-error/10 text-error text-sm rounded-xl border border-error/20 font-medium">{error}</div>}

        {!submitted ? (
          <>
            <p className="text-textLight text-sm mb-6 font-medium">Enter your registered email and we will send you instructions to reset your password.</p>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail size={18} className="text-textLight" />
                </div>
                <input 
                  type="email" 
                  required 
                  placeholder="name@business.com" 
                  className="w-full pl-11 pr-4 py-3.5 bg-background border border-borderCol rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all text-textDark placeholder:text-textLight/60 font-medium" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                />
              </div>
              <button type="submit" className="w-full py-4 bg-primary text-white font-black rounded-xl hover:bg-primary-dark transition-all shadow-lg hover:shadow-primary/30 disabled:opacity-70 flex justify-center items-center" disabled={isLoading}>
                {isLoading ? <Loader2 className="animate-spin mx-auto" size={20} /> : 'Send Reset Link'}
              </button>
            </form>
          </>
        ) : (
          <div className="text-center py-6 animate-in zoom-in-95">
            <div className="w-20 h-20 bg-success/10 text-success rounded-full flex items-center justify-center mx-auto mb-6 border border-success/20">
              <CheckCircle2 size={36} strokeWidth={2.5}/>
            </div>
            <h3 className="text-2xl font-black text-textDark mb-3 tracking-tight">Check your inbox</h3>
            <p className="text-textLight text-sm leading-relaxed mb-8 font-medium">
              We've sent a secure password reset link to <br/><strong className="text-textDark">{email}</strong>.
            </p>
            <button onClick={() => setSubmitted(false)} className="text-primary font-bold hover:text-primary-dark text-sm transition-colors px-4 py-2 bg-primary/10 rounded-xl">
              Try another email
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;