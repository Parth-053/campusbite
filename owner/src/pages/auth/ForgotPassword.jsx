import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft } from 'lucide-react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, dispatch(sendResetLink(email));
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-slate-100">
        <Link to="/login" className="flex items-center text-slate-500 hover:text-primary mb-6 text-sm">
          <ArrowLeft size={16} className="mr-1" /> Back to Login
        </Link>

        <h2 className="text-2xl font-bold text-slate-800 mb-2">Reset Password</h2>
        
        {!submitted ? (
          <>
            <p className="text-slate-500 mb-6">Enter your email and we'll send you a reset link.</p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-slate-400" size={20} />
                <input
                  type="email"
                  placeholder="Enter your registered email"
                  required
                  className="input-field pl-10"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <button type="submit" className="btn-primary w-full py-3">Send Reset Link</button>
            </form>
          </>
        ) : (
          <div className="text-center py-4">
            <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail size={24} />
            </div>
            <h3 className="text-lg font-bold text-slate-800">Check your email</h3>
            <p className="text-slate-500 mt-2">We have sent a password reset link to <span className="font-semibold text-slate-800">{email}</span></p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;