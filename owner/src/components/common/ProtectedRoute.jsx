import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children }) => {
  // FIX: Access 'user', not 'owner'
  const { user } = useSelector(state => state.auth);
  
  // If user exists, render content, otherwise redirect to login
  return user ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;