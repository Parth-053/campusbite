import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../config/firebase';
import { fetchCustomerProfile, logoutLocal, setInitialized } from '../store/authSlice';

const useAuth = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const token = await user.getIdToken(true); 
          await dispatch(fetchCustomerProfile(token)).unwrap();
        } catch  {
          dispatch(logoutLocal());
        } finally { 
          dispatch(setInitialized(true));
        }
      } else {
        dispatch(logoutLocal()); 
        dispatch(setInitialized(true));
      }
    });

    return () => unsubscribe();
  }, [dispatch]);
};

export default useAuth;