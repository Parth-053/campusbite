import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import { loginUser, clearAuthError } from '../../store/authSlice';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error, user } = useSelector(state => state.auth);

  useEffect(() => {
    dispatch(clearAuthError());
    if (user) navigate('/'); // Redirect to home if already logged in
  }, [user, navigate, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser({ email, password }));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-100 p-8 animate-in zoom-in-95 duration-300">
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-primary mb-2">CampusCanteen</h1>
          <p className="text-gray-500 text-sm">Welcome back! Please login to your account.</p>
        </div>

        {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-bold mb-6 text-center">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
              <input 
                type="email" required
                value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none transition-all" 
                placeholder="student@test.com"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-xs font-bold text-gray-500 uppercase">Password</label>
              <Link to="/forgot-password" className="text-xs font-bold text-primary hover:underline">Forgot?</Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
              <input 
                type="password" required
                value={password} onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none transition-all" 
                placeholder="••••••••"
              />
            </div>
          </div>

          <button 
            type="submit" disabled={isLoading}
            className="w-full bg-primary text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-indigo-700 transition-colors disabled:opacity-70"
          >
            {isLoading ? 'Signing In...' : <>Sign In <ArrowRight size={18} /></>}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-8">
          Don't have an account? <Link to="/register" className="font-bold text-primary hover:underline">Create one</Link>
        </p>

      </div>
    </div>
  );
};

export default Login;