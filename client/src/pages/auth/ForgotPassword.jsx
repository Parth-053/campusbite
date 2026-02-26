import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import { forgotPassword, clearAuthError } from '../../store/authSlice';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isSent, setIsSent] = useState(false);
  
  const dispatch = useDispatch();
  const { isLoading, error } = useSelector(state => state.auth);

  useEffect(() => {
    dispatch(clearAuthError());
  }, [dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(forgotPassword(email)).then((res) => {
      if (!res.error) setIsSent(true);
    });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center p-4 relative overflow-hidden">
      <div className="w-full max-w-md bg-surface rounded-3xl shadow-soft border border-borderCol p-8 relative z-10 animate-in zoom-in-95 duration-300">
        
        {isSent ? (
          <div className="text-center animate-in fade-in duration-500">
            <div className="w-20 h-20 bg-success/10 text-success rounded-full flex items-center justify-center mx-auto mb-6 border border-success/20">
              <CheckCircle2 size={36} strokeWidth={2.5}/>
            </div>
            <h3 className="text-2xl font-black text-textDark mb-3 tracking-tight">Check your inbox</h3>
            <p className="text-textLight text-sm leading-relaxed mb-8 font-medium">
              We've sent a secure password reset link to <br/><strong className="text-textDark">{email}</strong>.
            </p>
            <button onClick={() => setIsSent(false)} className="text-primary font-bold hover:underline text-sm transition-colors">
              Try another email
            </button>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <h1 className="text-3xl font-black text-textDark tracking-tight mb-2">Reset Password</h1>
              <p className="text-textLight text-sm font-medium">Enter your registered email and we'll send you instructions.</p>
            </div>

            {error && (
              <div className="mb-6 p-3.5 bg-error/10 text-error text-sm rounded-xl flex items-start gap-2 border border-error/20">
                 <AlertCircle size={18} className="shrink-0 mt-0.5" />
                 <p className="font-bold">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="relative">
                <Mail className="absolute left-4 top-3.5 text-textLight" size={18} />
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full pl-12 pr-4 py-3.5 bg-background border border-borderCol rounded-xl font-bold text-textDark focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all placeholder:font-normal" placeholder="name@campus.edu" />
              </div>

              <button type="submit" disabled={isLoading} className="w-full bg-primary text-white font-black py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-primary-light transition-all shadow-md disabled:opacity-70 transform active:scale-[0.98]">
                {isLoading ? <Loader2 className="animate-spin" size={20}/> : 'Send Reset Link'}
              </button>
            </form>
          </>
        )}

        <Link to="/login" className="flex items-center justify-center gap-2 text-sm font-bold text-textLight hover:text-primary mt-8 transition-colors border-t border-borderCol pt-6">
          <ArrowLeft size={16} /> Back to secure login
        </Link>
      </div>
    </div>
  );
};

export default ForgotPassword;