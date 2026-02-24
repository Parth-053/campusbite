import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Clock, LogOut } from 'lucide-react';
import { logoutOwner } from '../../store/authSlice';

const ApprovalPending = () => {
  const { owner } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();
 
  useEffect(() => {
    if (owner && owner.status === 'approved') {
      navigate('/dashboard', { replace: true });
    }
  }, [owner, navigate]);

  const handleLogout = async () => {
    await dispatch(logoutOwner());
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="bg-surface p-8 rounded-2xl shadow-xl w-full max-w-md border border-borderCol text-center animate-in zoom-in-95 duration-300">
        <div className="w-20 h-20 bg-warning/15 text-warning rounded-full flex items-center justify-center mx-auto mb-6">
          <Clock size={36} strokeWidth={2.5} />
        </div>
        <h2 className="text-2xl font-bold text-textDark mb-3 tracking-tight">Under Review</h2>
        <p className="text-textLight mb-8 text-sm leading-relaxed">
          Your email is verified! Your business application is currently being reviewed by our administration team. 
          You will be able to log in to the dashboard once approved.
        </p>
        
        <button 
          onClick={handleLogout}
          className="w-full py-3.5 bg-background text-textDark border border-borderCol font-bold rounded-xl hover:bg-borderCol transition-colors flex items-center justify-center gap-2"
        >
          <LogOut size={18} /> Sign Out For Now
        </button>
      </div>
    </div>
  );
};
export default ApprovalPending;