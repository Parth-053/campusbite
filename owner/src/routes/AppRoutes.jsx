import React from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import ForgotPassword from '../pages/auth/ForgotPassword';
import Dashboard from '../pages/dashboard/Dashboard';
import Orders from '../pages/order/Orders';
import MenuManagement from '../pages/menu/MenuManagement';
import AddItem from '../pages/menu/AddItem';
import EditItem from '../pages/menu/EditItem';
import Analytics from '../pages/dashboard/Analytics';
import Notifications from '../pages/header/Notifications'; 
import Profile from '../pages/header/Profile';
import Transactions from '../pages/header/Transactions';

import Sidebar from '../components/common/Sidebar';
import Header from '../components/common/Header';
import BottomNav from '../components/common/BottomNav';
import ProtectedRoute from '../components/common/ProtectedRoute';

const Layout = ({ children }) => (
  <div className="min-h-screen bg-background pb-16 md:pb-0"> 
    <Sidebar />
    <div className="md:ml-64 min-h-screen flex flex-col transition-all duration-300">
      <Header />
      <main className="flex-1 p-4 md:p-6 overflow-x-hidden">
        {children}
      </main>
    </div>
    <BottomNav />
  </div>
);

const AppRoutes = () => {
  const location = useLocation();
  
  // These paths will NOT have the Sidebar/Header layout
  const standalonePaths = ['/login', '/register', '/forgot-password',  '/notifications', '/profile', '/transactions'];
  const isStandalone = standalonePaths.includes(location.pathname);

  if (isStandalone) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/transactions" element={<ProtectedRoute><Transactions /></ProtectedRoute>} />
      </Routes>
    );
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
        <Route path="/menu" element={<ProtectedRoute><MenuManagement /></ProtectedRoute>} />
        <Route path="/menu/add" element={<ProtectedRoute><AddItem /></ProtectedRoute>} />
        <Route path="/menu/edit/:id" element={<ProtectedRoute><EditItem /></ProtectedRoute>} />
        <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
        
        {/* If route not found, go to login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Layout>
  );
};

export default AppRoutes;