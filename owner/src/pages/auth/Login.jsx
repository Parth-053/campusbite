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
      const isVerified = ownerData.isVerified === true || ownerData.isEmailVerified === true;
      
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
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="bg-surface p-8 rounded-2xl shadow-xl w-full max-w-md border border-borderCol">
        <div className="text-center mb-8">
          <img src="/logo.png" alt="CampusBite Logo" className="w-20 h-20 object-contain mx-auto mb-2" />
          <h1 className="text-2xl font-bold text-textDark tracking-tight">Partner Login</h1>
          <p className="text-textLight text-sm mt-1">Manage your campus business</p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-error-light text-error text-sm rounded-lg border border-error/20 flex items-start gap-2 animate-in fade-in zoom-in duration-200">
            <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-textDark mb-1.5">Email Address</label>
            <input 
              type="email" 
              required 
              className="w-full px-4 py-3 bg-background border border-borderCol rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-textDark placeholder:text-textLight" 
              placeholder="Enter your email" 
              value={credentials.email} 
              onChange={(e) => setCredentials({...credentials, email: e.target.value})} 
            />
          </div>
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-sm font-semibold text-textDark">Password</label>
              <Link to="/forgot-password" className="text-xs text-primary hover:text-primary-dark hover:underline font-semibold transition-colors">Forgot password?</Link>
            </div>
            <input 
              type="password" 
              required 
              className="w-full px-4 py-3 bg-background border border-borderCol rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-textDark placeholder:text-textLight" 
              placeholder="Enter your password" 
              value={credentials.password} 
              onChange={(e) => setCredentials({...credentials, password: e.target.value})} 
            />
          </div>

          <button 
            type="submit" 
            className="w-full py-3.5 mt-2 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-colors disabled:opacity-70 flex justify-center items-center shadow-md" 
            disabled={isLoading}
          >
            {isLoading ? <span className="flex items-center gap-2"><Loader2 className="animate-spin" size={18}/> Verifying...</span> : 'Login to Dashboard'}
          </button>
        </form>
        
        <div className="mt-8 text-center text-sm text-textLight border-t border-borderCol pt-6">
          New partner? <Link to="/register" className="font-bold text-primary hover:text-primary-dark transition-colors">Register your business</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;