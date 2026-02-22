import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';  
import { Store, Loader2, AlertCircle } from 'lucide-react';

const Login = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const { login, isLoading, error, isAuthenticated, resetError } = useAuth();
  const navigate = useNavigate();

  // 1. Navigation Logic
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true }); 
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    return () => {
      resetError();
    };
  }, [resetError]);

  const handleSubmit = (e) => {
    e.preventDefault();
    login(credentials);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-slate-100">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-100 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <Store size={32} />
          </div>
          <h1 className="text-2xl font-bold text-slate-800">Partner Login</h1>
          <p className="text-slate-500 text-sm mt-1">Manage your campus canteen</p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-100 flex items-start gap-2">
            <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <input type="email" required className="input-field" placeholder="Enter your email" value={credentials.email} onChange={(e) => setCredentials({...credentials, email: e.target.value})} />
          </div>
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium text-slate-700">Password</label>
              <Link to="/forgot-password" className="text-xs text-primary hover:underline font-medium">Forgot password?</Link>
            </div>
            <input type="password" required className="input-field" placeholder="Enter your password" value={credentials.password} onChange={(e) => setCredentials({...credentials, password: e.target.value})} />
          </div>

          <button type="submit" className="btn-primary w-full py-3 mt-2" disabled={isLoading}>
            {isLoading ? <span className="flex items-center justify-center gap-2"><Loader2 className="animate-spin" size={18}/> Logging in...</span> : 'Login to Dashboard'}
          </button>
        </form>
        
        <div className="mt-8 text-center text-sm text-slate-600 border-t pt-6">
          New partner? <Link to="/register" className="font-bold text-primary hover:underline">Register your canteen</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;