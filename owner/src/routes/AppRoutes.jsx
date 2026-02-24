import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
 
import ProtectedRoute from '../components/common/ProtectedRoute';
import Sidebar from '../components/common/Sidebar';
import Header from '../components/common/Header';
import BottomNav from '../components/common/BottomNav';
 
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import ForgotPassword from '../pages/auth/ForgotPassword';
import VerifyEmail from '../pages/auth/VerifyEmail';
import ApprovalPending from '../pages/auth/ApprovalPending';
 
import Dashboard from '../pages/dashboard/Dashboard';
import Analytics from '../pages/dashboard/Analytics';
import Orders from '../pages/order/Orders';
import MenuManagement from '../pages/menu/MenuManagement';
import Profile from '../pages/header/Profile';
import Transactions from '../pages/header/Transactions';
import Notifications from '../pages/header/Notifications';

// --- MAIN LAYOUT --- 
const MainLayout = () => {
  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      <div className="flex-1 md:ml-64 w-full">
        <Header />
        <main className="p-4 md:p-6 pt-24 md:pt-28 pb-24 md:pb-8 max-w-7xl mx-auto"> 
           <Outlet /> 
        </main>
        <BottomNav />
      </div>
    </div>
  );
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* --- PUBLIC ROUTES --- */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/verify-email" element={<VerifyEmail />} />
      <Route path="/approval-pending" element={<ApprovalPending />} />

      {/* --- PROTECTED DASHBOARD ROUTES --- */}
      <Route path="/" element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
        <Route index element={<Navigate to="dashboard" replace />} />
        
        {/* Dashboard Pages */}
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="orders" element={<Orders />} />
        <Route path="menu" element={<MenuManagement />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="profile" element={<Profile />} />
        <Route path="transactions" element={<Transactions />} />
        <Route path="notifications" element={<Notifications />} />
      </Route>

      {/* --- CATCH ALL UNKNOWN URLS --- */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default AppRoutes;