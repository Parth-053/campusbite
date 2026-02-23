import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
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
      // res.error will be undefined if the thunk succeeds
      if (!res.error) setIsSent(true);
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-100 p-8 animate-in zoom-in-95 duration-300">
        
        {isSent ? (
          <div className="text-center animate-in fade-in duration-500">
            <div className="w-16 h-16 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={32} />
            </div>
            <h1 className="text-2xl font-black text-gray-900 mb-2">Check your email</h1>
            <p className="text-gray-500 text-sm mb-8">
              We've sent a password reset link to <span className="font-bold text-gray-800">{email}</span>. Please check your inbox.
            </p>
            <Link to="/login" className="w-full bg-primary text-white font-bold py-3 rounded-lg flex items-center justify-center hover:bg-indigo-700 transition-colors">
              Back to Login
            </Link>
          </div>
        ) : (
          <>
            <div className="text-center mb-8">
              <h1 className="text-2xl font-black text-gray-900 mb-2">Reset Password</h1>
              <p className="text-gray-500 text-sm">Enter your email and we'll send you a reset link.</p>
            </div>

            {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-bold mb-6 text-center">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
                <input 
                  type="email" required
                  value={email} onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none" 
                  placeholder="Enter your registered email"
                />
              </div>

              <button 
                type="submit" disabled={isLoading}
                className="w-full bg-primary text-white font-bold py-3 rounded-lg flex items-center justify-center hover:bg-indigo-700 disabled:opacity-70 transition-colors"
              >
                {isLoading ? 'Sending Link...' : 'Send Reset Link'}
              </button>
            </form>

            <Link to="/login" className="flex items-center justify-center gap-2 text-sm font-bold text-gray-500 hover:text-gray-800 mt-8 transition-colors">
              <ArrowLeft size={16} /> Back to login
            </Link>
          </>
        )}

      </div>
    </div>
  );
};

export default ForgotPassword;