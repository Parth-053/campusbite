import React from 'react';
import { Link } from 'react-router-dom';
import { Clock } from 'lucide-react';

const ApprovalPending = () => {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-slate-100 text-center animate-in zoom-in-95 duration-300">
      <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-6">
        <Clock size={32} />
      </div>
      <h2 className="text-2xl font-bold text-slate-800 mb-2">Application Submitted!</h2>
      <p className="text-slate-500 mb-6 text-sm">
        Your email is verified. Your canteen registration is currently under review by our administration team. 
        You will be able to login once it is approved.
      </p>
      <Link to="/login" className="btn-primary w-full py-3 block text-center">
        Return to Login
      </Link>
    </div>
  );
};
export default ApprovalPending;