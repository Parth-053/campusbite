import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import RegisterStep1 from '../../components/auth/RegisterStep1';
import RegisterStep2 from '../../components/auth/RegisterStep2';
import RegisterStep3 from '../../components/auth/RegisterStep3';
import VerifyEmail from './VerifyEmail';
import ApprovalPending from './ApprovalPending';
import { AlertCircle } from 'lucide-react';

const Register = () => {
  const { register, registrationStep, setStep, error, resetError } = useAuth();
   
  const { ownerData, isLoading } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    personal: { firstName: '', lastName: '', email: '', mobile: '', password: '' }, 
    canteen: { canteenName: '', state: '', district: '', college: '', type: 'central', hostelId: '', openingTime: '', closingTime: '', allowedHostels: [], image: null },
    payment: { upiId: '' } 
  });
 
  useEffect(() => { 
    if (ownerData && ownerData.isVerified && ownerData.status === 'approved') {
      navigate('/dashboard', { replace: true });
    }
  }, [ownerData, navigate]);

  useEffect(() => { 
    return () => {
      if (resetError) resetError();
    }; 
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateFormData = useCallback((section, field, value) => {
    setFormData(prev => ({ ...prev, [section]: { ...prev[section], [field]: value } }));
  }, []);

  const handleFinalSubmit = () => {
    const payload = {
      personal: { name: `${formData.personal.firstName} ${formData.personal.lastName}`, email: formData.personal.email, phone: formData.personal.mobile, password: formData.personal.password },
      canteen: { name: formData.canteen.canteenName, collegeId: formData.canteen.college, hostelId: formData.canteen.hostelId || null, allowedHostels: formData.canteen.allowedHostels, openingTime: formData.canteen.openingTime, closingTime: formData.canteen.closingTime, image: formData.canteen.image },
      payment: { upiId: formData.payment.upiId }
    };
    register(payload);
  };

  if (registrationStep === 4) return <VerifyEmail />;
  if (registrationStep === 5) return <ApprovalPending />;

  const renderStep = () => {
    switch (registrationStep) {
      case 1: return <RegisterStep1 data={formData.personal} updateData={updateFormData} onNext={() => setStep(2)} />;
      case 2: return <RegisterStep2 data={formData.canteen} updateData={updateFormData} onNext={() => setStep(3)} onBack={() => setStep(1)} />;
      case 3: return <RegisterStep3 data={formData.payment} updateData={updateFormData} onSubmit={handleFinalSubmit} onBack={() => setStep(2)} isLoading={isLoading} />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
      <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-warning/10 rounded-full blur-3xl"></div>

      <div className="bg-surface p-8 sm:p-10 rounded-3xl shadow-2xl w-full max-w-lg border border-borderCol relative z-10">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4 border border-primary/20 shadow-inner">
             <img src="/logo.png" alt="CampusBite" className="w-10 h-10 object-contain" />
          </div>
          <h1 className="text-2xl font-black text-textDark tracking-tight">Partner Registration</h1>
          <p className="text-textLight text-sm mt-1 font-medium">Join the CampusBite network</p>
        </div>

        <div className="flex justify-between items-center mb-8 relative px-4">
          <div className="absolute left-4 right-4 top-1/2 -translate-y-1/2 h-1 bg-borderCol -z-10 rounded-full"></div>
          {[1, 2, 3].map((step) => (
            <div key={step} className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${registrationStep >= step ? 'bg-primary text-white ring-4 ring-background shadow-md' : 'bg-background text-textLight border border-borderCol ring-4 ring-surface'}`}>{step}</div>
          ))}
        </div>

        {error && (
          <div className="mb-6 p-3.5 bg-error/10 text-error text-sm rounded-xl border border-error/20 flex items-start gap-2.5 animate-in slide-in-from-top-2">
            <AlertCircle size={18} className="mt-0.5 flex-shrink-0" />
            <p className="font-medium">{error}</p>
          </div>
        )}

        {renderStep()}

        <div className="mt-8 text-center text-sm text-textLight border-t border-borderCol pt-6 font-medium">
          Already a partner? <Link to="/login" className="font-bold text-primary hover:text-primary-dark transition-colors ml-1">Login here</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;