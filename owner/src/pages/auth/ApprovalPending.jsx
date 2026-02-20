import React from 'react';
import { ShieldCheck, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const ApprovalPending = () => {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-slate-100 text-center animate-in zoom-in-95 duration-300">
      <div className="w-20 h-20 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-6 relative">
        <ShieldCheck size={40} />
        <div className="absolute -bottom-1 -right-1 bg-white p-1 rounded-full">
            <Clock size={24} className="text-amber-600" />
        </div>
      </div>

      <h2 className="text-2xl font-bold text-slate-800 mb-2">Registration Successful!</h2>
      <h3 className="text-lg font-medium text-amber-600 mb-4">Pending Admin Approval</h3>
      
      <p className="text-slate-500 mb-8 leading-relaxed text-sm">
        Thank you for registering your canteen. Your documents and details have been submitted securely. 
        The admin team will review your application within 24-48 hours.
        <br/><br/>
        You will receive an email once your account is approved.
      </p>

      <Link to="/login" className="btn-secondary block w-full text-center">
        Back to Login
      </Link>
    </div>
  );
};

export default ApprovalPending;