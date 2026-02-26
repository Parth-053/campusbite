import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Mail, Lock, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';
import { loginCustomer, clearAuthError } from '../../store/authSlice';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoading, error, isAuthenticated } = useSelector(state => state.auth);

  useEffect(() => {
    dispatch(clearAuthError());
    if (isAuthenticated) {
       const from = location.state?.from?.pathname || '/home';
       navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, dispatch, location]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginCustomer({ email, password }));
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Decorative gradient blur */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-accent/10 rounded-full blur-3xl"></div>

      <div className="w-full max-w-md bg-surface rounded-3xl shadow-soft border border-borderCol p-8 relative z-10 animate-in zoom-in-95 duration-300">
        <div className="text-center mb-8 flex flex-col items-center">
          <img src="/logo.png" alt="CampusBite" className="w-20 h-20 object-contain mb-4 drop-shadow-sm" />
          <h1 className="text-3xl font-black text-textDark tracking-tight">Welcome Back!</h1>
          <p className="text-textLight text-sm mt-1 font-medium">Log in to order your favorite campus food.</p>
        </div>

        {error && (
          <div className="mb-6 p-3.5 bg-error/10 text-error text-sm rounded-xl flex items-start gap-2 border border-error/20">
            <AlertCircle size={18} className="shrink-0 mt-0.5" />
            <p className="font-bold">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="relative">
            <Mail className="absolute left-4 top-3.5 text-textLight" size={18} />
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full pl-12 pr-4 py-3.5 border border-borderCol rounded-xl font-bold text-textDark focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all placeholder:font-normal" placeholder="Email Address" />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2 px-1">
              <label className="block text-xs font-bold text-textLight uppercase tracking-widest">Password</label>
              <Link to="/forgot-password" className="text-xs font-bold text-primary hover:text-primary-light transition-colors">Forgot?</Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-3.5 text-textLight" size={18} />
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full pl-12 pr-4 py-3.5 border border-borderCol rounded-xl font-bold text-textDark focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all placeholder:font-normal" placeholder="••••••••" />
            </div>
          </div>

          {/* Action Button: ACCENT ORANGE for high conversion */}
          <button type="submit" disabled={isLoading} className="w-full mt-2 bg-accent text-white font-black py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-accent-hover shadow-floating disabled:opacity-70 transition-all transform active:scale-[0.98]">
            {isLoading ? <Loader2 className="animate-spin" size={20}/> : <>Login Securely <ArrowRight size={18} /></>}
          </button>
        </form>

        <p className="text-center text-sm text-textLight mt-8 font-medium border-t border-borderCol pt-6">
          New to CampusBite? <Link to="/register" className="font-black text-primary hover:text-primary-light transition-colors ml-1">Create Account</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;