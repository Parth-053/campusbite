import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Loader from './Loader';

const ProtectedRoute = ({ children }) => {
  const { ownerData, isLoading } = useSelector((state) => state.auth);
  const location = useLocation();

  if (isLoading) {
    return <Loader fullScreen={true} />;
  }
 
  if (!ownerData) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
 
  const isVerified = ownerData.isVerified === true || ownerData.isEmailVerified === true;
 
  if (!isVerified) {
    return <Navigate to="/verify-email" replace />;
  }
 
  if (ownerData.status === 'pending') {
    return <Navigate to="/approval-pending" replace />;
  }
 
  return children;
};

export default ProtectedRoute;