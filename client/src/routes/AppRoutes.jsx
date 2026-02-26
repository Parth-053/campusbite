import React from "react";
import { Routes, Route } from "react-router-dom";
import { useSelector } from "react-redux";
import useAuth from "../hooks/useAuth"; 

// --- Auth Pages ---
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import VerifyEmail from "../pages/auth/VerifyEmail";
import ForgotPassword from "../pages/auth/ForgotPassword";

// --- Main App Pages ---
import Splash from "../pages/main/Splash";
import Home from "../pages/main/Home";
import Menu from "../pages/main/Menu";
import Cart from "../pages/main/Cart";
import OrderTracking from "../pages/order/OrderTracking";
import OrderHistory from "../pages/order/OrderHistory";
import Profile from "../pages/profile/Profile";
import Notifications from "../pages/profile/Notifications";

// --- Components ---
import ProtectedRoute from "../components/common/ProtectedRoute";

const AppRoutes = () => { 
  useAuth();
   
  const { isInitialized } = useSelector((state) => state.auth);
 
  if (!isInitialized) {
    return <Splash />;
  }

  return (
    <Routes>
      {/* PUBLIC & AUTH ROUTES */}
      <Route path="/" element={<Splash />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/verify-email" element={<VerifyEmail />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* PROTECTED ROUTES */}
      <Route element={<ProtectedRoute />}>
        <Route path="/home" element={<Home />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/order-tracking" element={<OrderTracking />} />
        <Route path="/order-history" element={<OrderHistory />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/menu/:canteenId" element={<Menu />} />
        <Route path="/notifications" element={<Notifications />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;