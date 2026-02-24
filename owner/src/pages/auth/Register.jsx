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
  const { owner, isLoading } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    personal: { firstName: '', lastName: '', email: '', mobile: '', password: '' }, 
    canteen: { canteenName: '', state: '', district: '', college: '', type: 'central', hostelId: '', openingTime: '', closingTime: '', allowedHostels: [], image: null },
    payment: { upiId: '' } 
  });
 
  useEffect(() => {
    if (owner && owner.isEmailVerified && owner.status === 'approved') {
      navigate('/dashboard', { replace: true });
    }
  }, [owner, navigate]);

  useEffect(() => { 
    return () => {
      if (resetError) resetError();
    }; 
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateFormData = useCallback((section, field, value) => {
    setFormData(prev => ({ ...prev, [section]: { ...prev[section], [field]: value } }));
  }, []);

  const handleRegistrationSubmit = () => register(formData);

  const renderStep = () => {
    switch(registrationStep) {
      case 1: return <RegisterStep1 data={formData.personal} updateData={updateFormData} onNext={() => setStep(2)} />;
      case 2: return <RegisterStep2 data={formData.canteen} updateData={updateFormData} onNext={() => setStep(3)} onBack={() => setStep(1)} />;
      case 3: return <RegisterStep3 data={formData.payment} updateData={updateFormData} onSubmit={handleRegistrationSubmit} onBack={() => setStep(2)} isLoading={isLoading} />;
      case 4: return <VerifyEmail />;
      case 5: return <ApprovalPending />;
      default: return null;
    }
  };

  if (registrationStep > 3) {
    return <div className="min-h-screen flex items-center justify-center bg-background p-4">{renderStep()}</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="bg-surface p-6 md:p-8 rounded-2xl shadow-xl w-full max-w-xl border border-borderCol">
        <div className="mb-6 flex flex-col items-center text-center">
          <img src="/logo.png" alt="CampusBite" className="w-12 h-12 mb-3" />
          <h1 className="text-2xl font-bold text-textDark tracking-tight">Partner Registration</h1>
          <p className="text-textLight text-sm mt-1">Join the CampusBite network</p>
        </div>

        <div className="flex justify-between items-center mb-8 relative px-4">
          <div className="absolute left-4 right-4 top-1/2 -translate-y-1/2 h-1 bg-borderCol -z-10 rounded-full"></div>
          {[1, 2, 3].map((step) => (
            <div key={step} className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${registrationStep >= step ? 'bg-primary text-white ring-4 ring-background' : 'bg-background text-textLight border border-borderCol ring-4 ring-surface'}`}>{step}</div>
          ))}
        </div>

        {error && (
          <div className="mb-6 p-3 bg-error-light text-error text-sm rounded-lg border border-error/20 flex items-start gap-2">
            <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {renderStep()}

        <div className="mt-8 text-center text-sm text-textLight border-t border-borderCol pt-6">
          Already a partner? <Link to="/login" className="font-bold text-primary hover:text-primary-dark transition-colors">Login to Dashboard</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;