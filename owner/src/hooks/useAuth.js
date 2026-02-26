import { useSelector, useDispatch } from 'react-redux';
import { useCallback } from 'react';  
import { 
  loginOwner, 
  registerOwnerAccount, 
  verifyOwnerEmail, 
  resendOTP, 
  resetPassword, 
  logoutOwner, 
  setRegistrationStep, 
  clearAuthError 
} from '../store/authSlice';

export const useAuth = () => {
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);
  const locationData = useSelector((state) => state.location);

  const login = useCallback((credentials) => dispatch(loginOwner(credentials)), [dispatch]);
  const register = useCallback((formData) => dispatch(registerOwnerAccount(formData)), [dispatch]);
  const verify = useCallback((data) => dispatch(verifyOwnerEmail(data)), [dispatch]);
  const resendOtp = useCallback(() => dispatch(resendOTP()), [dispatch]);
  const resetPass = useCallback((email) => dispatch(resetPassword(email)), [dispatch]);
  const logout = useCallback(() => dispatch(logoutOwner()), [dispatch]);
  const updateStep = useCallback((step) => dispatch(setRegistrationStep(step)), [dispatch]);
  const resetError = useCallback(() => dispatch(clearAuthError()), [dispatch]);
 
  return { 
    ...authState, 
    locationData, 
    login, 
    register, 
    verify, 
    resendOtp, 
    resetPassword: resetPass, 
    logout, 
    setStep: updateStep, 
    resetError 
  };
};