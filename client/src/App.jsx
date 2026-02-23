import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import { Toaster } from 'react-hot-toast';
import useAuth from './hooks/useAuth'; 

const AppContent = () => {
  useAuth(); 

  return (
    <BrowserRouter>
      <AppRoutes />
      <Toaster 
        position="top-center" 
        toastOptions={{
          duration: 3000,
          style: {
            background: '#333',
            color: '#fff',
            borderRadius: '10px',
          },
        }}
      />
    </BrowserRouter>
  );
};

const App = () => {
  return (
    <AppContent />
  );
};

export default App;