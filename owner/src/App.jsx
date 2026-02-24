import React, { useEffect, useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './config/firebase';  
import { restoreSession } from './store/authSlice';  
import AppRoutes from './routes/AppRoutes';
import { Loader2 } from 'lucide-react';

function App() {
  const dispatch = useDispatch(); 
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => { 
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) { 
        await dispatch(restoreSession());
      } 
      setIsInitializing(false);
    });

    return () => unsubscribe();
  }, [dispatch]);
 
  if (isInitializing) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <img src="/logo.png" alt="Logo" className="w-16 h-16 mb-6 animate-pulse" />
        <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
        <p className="text-textLight font-medium">Securing your session...</p>
      </div>
    );
  }
 
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;