import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Lock, Mail, ArrowRight } from 'lucide-react';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const { login, isLoading, error, isAuthenticated, resetError } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) navigate('/dashboard');
    return () => resetError();
  // Fixed: Added resetError to dependency array
  }, [isAuthenticated, navigate, resetError]);

  const handleSubmit = (e) => {
    e.preventDefault();
    login(formData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-slate-100">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary">Partner Login</h1>
          <p className="text-slate-500 mt-2">Welcome back! Please enter your details.</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="relative">
            <Mail className="absolute left-3 top-3 text-slate-400" size={20} />
            <input
              type="email"
              placeholder="Email Address"
              required
              className="input-field pl-10"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-3 text-slate-400" size={20} />
            <input
              type="password"
              placeholder="Password"
              required
              className="input-field pl-10"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          <div className="flex justify-end">
            <Link to="/forgot-password" className="text-sm font-medium text-primary hover:text-blue-700">
              Forgot Password?
            </Link>
          </div>

          <button type="submit" className="btn-primary w-full py-3 flex items-center justify-center gap-2" disabled={isLoading}>
            {isLoading ? 'Logging in...' : 'Sign In'}
            {!isLoading && <ArrowRight size={18} />}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-600">
          Don't have an account?{' '}
          <Link to="/register" className="font-bold text-primary hover:underline">
            Register Canteen
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;