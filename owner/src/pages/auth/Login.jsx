import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';  
import { useSelector } from 'react-redux';
import { Loader2, AlertCircle } from 'lucide-react';

const Login = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const { login, error, resetError } = useAuth();
   
  const { ownerData, isLoading } = useSelector((state) => state.auth);  
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    if (ownerData) {
      const isVerified = ownerData.isVerified === true;
      
      if (!isVerified) {
        navigate('/verify-email', { replace: true });
      } else if (ownerData.status === 'pending') {
        navigate('/approval-pending', { replace: true });
      } else {
        const from = location.state?.from?.pathname || '/dashboard';
        navigate(from, { replace: true }); 
      }
    }
  }, [ownerData, navigate, location]);

  useEffect(() => {
    return () => {
      if (resetError) resetError();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    login(credentials);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
      {/* Decorative Blur Backgrounds */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-primary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-warning/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>

      <div className="bg-surface p-8 sm:p-10 rounded-3xl shadow-2xl w-full max-w-md border border-borderCol relative z-10 animate-in zoom-in-95 duration-300">
        
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4 border border-primary/20 shadow-inner">
             <img src="/logo.png" alt="CampusBite" className="w-10 h-10 object-contain" />
          </div>
          <h1 className="text-2xl font-black text-textDark tracking-tight">Partner Login</h1>
          <p className="text-textLight text-sm mt-1 font-medium">Welcome back to CampusBite</p>
        </div>

        {error && (
          <div className="mb-6 p-3.5 bg-error/10 text-error text-sm rounded-xl border border-error/20 flex items-start gap-2.5 animate-in slide-in-from-top-2">
            <AlertCircle size={18} className="mt-0.5 flex-shrink-0" />
            <p className="font-medium leading-snug">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-textLight uppercase tracking-widest mb-2">Email Address</label>
            <input 
              type="email" 
              required 
              className="w-full px-4 py-3.5 bg-background border border-borderCol rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-textDark placeholder:text-textLight/60 font-medium" 
              placeholder="name@business.com" 
              value={credentials.email} 
              onChange={(e) => setCredentials({...credentials, email: e.target.value})} 
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-xs font-bold text-textLight uppercase tracking-widest">Password</label>
              <Link to="/forgot-password" className="text-xs text-primary hover:text-primary-dark hover:underline font-bold transition-colors">Forgot?</Link>
            </div>
            <input 
              type="password" 
              required 
              className="w-full px-4 py-3.5 bg-background border border-borderCol rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-textDark placeholder:text-textLight/60 font-medium" 
              placeholder="••••••••" 
              value={credentials.password} 
              onChange={(e) => setCredentials({...credentials, password: e.target.value})} 
            />
          </div>

          <button 
            type="submit" 
            className="w-full py-4 mt-2 bg-primary text-white font-black rounded-xl hover:bg-primary-dark transition-all disabled:opacity-70 flex justify-center items-center shadow-lg hover:shadow-primary/30 hover:-translate-y-0.5" 
            disabled={isLoading}
          >
            {isLoading ? <span className="flex items-center gap-2"><Loader2 className="animate-spin" size={18}/> Verifying...</span> : 'Login to Dashboard'}
          </button>
        </form>
        
        <div className="mt-8 text-center text-sm text-textLight border-t border-borderCol pt-6 font-medium">
          New partner? <Link to="/register" className="font-bold text-primary hover:text-primary-dark transition-colors ml-1">Register your business</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;