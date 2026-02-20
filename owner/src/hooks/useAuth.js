import { useSelector, useDispatch } from 'react-redux';
import { 
  loginUser, 
  registerOwner, 
  verifyOtp, 
  logout, 
  resetAuthError,
  setRegistrationStep
} from '../store/authSlice';

export const useAuth = () => {
  const dispatch = useDispatch();
  const { 
    user, 
    isAuthenticated, 
    isLoading, 
    error, 
    registrationStep,
    locationData,
    tempEmail
  } = useSelector((state) => state.auth);

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    registrationStep,
    locationData,
    tempEmail,
    login: (creds) => dispatch(loginUser(creds)),
    register: (data) => dispatch(registerOwner(data)),
    verify: (data) => dispatch(verifyOtp(data)),
    logoutUser: () => dispatch(logout()),
    resetError: () => dispatch(resetAuthError()),
    setStep: (step) => dispatch(setRegistrationStep(step))
  };
};