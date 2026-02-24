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
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="bg-surface p-8 rounded-2xl shadow-xl w-full max-w-md border border-borderCol">
        <Link to="/login" className="inline-flex items-center text-textLight hover:text-primary mb-6 text-sm font-semibold transition-colors">
          <ArrowLeft size={16} className="mr-1.5" /> Back to Login
        </Link>
        <h2 className="text-2xl font-bold text-textDark mb-2 tracking-tight">Reset Password</h2>
        
        {error && <div className="mb-5 p-3 bg-error/10 text-error text-sm rounded-lg border border-error/20 font-medium">{error}</div>}

        {!submitted ? (
          <>
            <p className="text-textLight mb-6 text-sm">Enter your registered business email and we'll send you a secure reset link.</p>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="relative">
                <Mail className="absolute left-4 top-3.5 text-textLight" size={20} />
                <input 
                  type="email" 
                  placeholder="name@business.com" 
                  required 
                  className="w-full pl-12 pr-4 py-3 bg-background border border-borderCol rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-textDark placeholder:text-textLight" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                />
              </div>
              <button type="submit" className="w-full py-3.5 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-colors shadow-md disabled:opacity-70 flex justify-center items-center" disabled={isLoading}>
                {isLoading ? <Loader2 className="animate-spin mx-auto" size={20} /> : 'Send Reset Link'}
              </button>
            </form>
          </>
        ) : (
          <div className="text-center py-6 animate-in zoom-in-95">
            <div className="w-16 h-16 bg-success/10 text-success rounded-full flex items-center justify-center mx-auto mb-4 border border-success/20">
              <CheckCircle2 size={32} />
            </div>
            <h3 className="text-xl font-bold text-textDark mb-2 tracking-tight">Check your inbox</h3>
            <p className="text-textLight text-sm leading-relaxed mb-6">
              We've sent a secure password reset link to <strong>{email}</strong>. Please check your spam folder if you don't see it.
            </p>
            <button onClick={() => setSubmitted(false)} className="text-primary font-bold hover:underline text-sm transition-colors">
              Try another email
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;