import { useSelector, useDispatch } from 'react-redux';
import { useCallback } from 'react';  
import { loginOwner, registerOwnerAccount, verifyOwnerEmail, resendOwnerOtp, resetOwnerPassword, logoutOwner, setStep, resetAuthError } from '../store/authSlice';

export const useAuth = () => {
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);
  const locationData = useSelector((state) => state.location);

  const login = useCallback((credentials) => dispatch(loginOwner(credentials)), [dispatch]);
  const register = useCallback((formData) => dispatch(registerOwnerAccount(formData)), [dispatch]);
  const verify = useCallback((data) => dispatch(verifyOwnerEmail(data)), [dispatch]);
  const resendOtp = useCallback(() => dispatch(resendOwnerOtp()), [dispatch]);
  const resetPassword = useCallback((email) => dispatch(resetOwnerPassword(email)), [dispatch]);
  const logout = useCallback(() => dispatch(logoutOwner()), [dispatch]);
  const updateStep = useCallback((step) => dispatch(setStep(step)), [dispatch]);
  const resetError = useCallback(() => dispatch(resetAuthError()), [dispatch]);

  return { ...authState, locationData, login, register, verify, resendOtp, resetPassword, logout, setStep: updateStep, resetError };
};