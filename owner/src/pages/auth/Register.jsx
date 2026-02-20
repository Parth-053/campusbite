import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import RegisterStep1 from '../../components/auth/RegisterStep1';
import RegisterStep2 from '../../components/auth/RegisterStep2';
import RegisterStep3 from '../../components/auth/RegisterStep3';
import VerifyEmail from './VerifyEmail';
import ApprovalPending from './ApprovalPending';
import { Link } from 'react-router-dom';

const Register = () => {
  const { register, registrationStep, setStep, isLoading, error } = useAuth();
  
  // Local state to hold form data across steps
  const [formData, setFormData] = useState({
    personal: { firstName: '', lastName: '', email: '', mobile: '' },
    canteen: { canteenName: '', state: '', district: '', college: '', type: 'central', hostelId: '' },
    bank: { holderName: '', accountNumber: '', ifsc: '' }
  });

  const updateFormData = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: { ...prev[section], [field]: value }
    }));
  };

  const handleRegistrationSubmit = () => {
    register(formData);
  };

  // Render Logic based on Redux Step
  const renderStep = () => {
    switch(registrationStep) {
      case 1: 
        return <RegisterStep1 data={formData.personal} updateData={updateFormData} onNext={() => setStep(2)} />;
      case 2:
        return <RegisterStep2 data={formData.canteen} updateData={updateFormData} onNext={() => setStep(3)} onBack={() => setStep(1)} />;
      case 3:
        return <RegisterStep3 data={formData.bank} updateData={updateFormData} onSubmit={handleRegistrationSubmit} onBack={() => setStep(2)} isLoading={isLoading} />;
      case 4:
        return <VerifyEmail />;
      case 5:
        return <ApprovalPending />;
      default:
        return null;
    }
  };

  if (registrationStep > 3) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        {renderStep()}
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-xl w-full max-w-lg border border-slate-100">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-primary">Partner Registration</h1>
          <p className="text-slate-500 text-sm">Join the Campus Canteen network</p>
        </div>

        {/* Progress Bar */}
        <div className="flex justify-between items-center mb-8 relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-100 -z-10"></div>
          {[1, 2, 3].map((step) => (
            <div 
              key={step} 
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                registrationStep >= step ? 'bg-primary text-white' : 'bg-slate-200 text-slate-500'
              }`}
            >
              {step}
            </div>
          ))}
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
            {error}
          </div>
        )}

        {renderStep()}

        <div className="mt-6 text-center text-sm text-slate-600 border-t pt-4">
          Already registered?{' '}
          <Link to="/login" className="font-bold text-primary hover:underline">
            Login here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;