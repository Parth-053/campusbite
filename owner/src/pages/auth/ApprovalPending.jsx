import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Clock, LogOut } from 'lucide-react';
import { logoutOwner } from '../../store/authSlice';

const ApprovalPending = () => { 
  const { ownerData } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();
 
  useEffect(() => {
    if (ownerData && ownerData.status === 'approved') {
      navigate('/dashboard', { replace: true });
    }
  }, [ownerData, navigate]);

  const handleLogout = async () => {
    await dispatch(logoutOwner());
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="bg-surface p-8 sm:p-10 rounded-3xl shadow-2xl w-full max-w-md border border-borderCol text-center animate-in zoom-in-95 duration-300">
        <div className="w-20 h-20 bg-warning/15 text-warning rounded-full flex items-center justify-center mx-auto mb-6 border border-warning/20">
          <Clock size={36} strokeWidth={2.5} />
        </div>
        <h2 className="text-2xl font-black text-textDark mb-3 tracking-tight">Under Review</h2>
        <p className="text-textLight mb-8 text-sm leading-relaxed font-medium">
          Your email is verified! Your business application is currently being reviewed by our administration team. 
          You will be able to log in to the dashboard once approved.
        </p>
        
        <button 
          onClick={handleLogout}
          className="w-full py-4 bg-background text-textDark border border-borderCol font-bold rounded-xl hover:bg-surface transition-all flex items-center justify-center gap-2 hover:border-textLight"
        >
          <LogOut size={18} /> Logout
        </button>
      </div>
    </div>
  );
};

export default ApprovalPending;