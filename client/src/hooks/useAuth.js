import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../config/firebase';
import { fetchCustomerProfile, logoutLocal, setAuthLoading } from '../store/authSlice';

const useAuth = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setAuthLoading(true));
    
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        dispatch(fetchCustomerProfile());
      } else {
        dispatch(logoutLocal());
      }
    });

    return () => unsubscribe();
  }, [dispatch]);
};

export default useAuth;