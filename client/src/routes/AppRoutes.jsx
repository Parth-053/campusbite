import React from "react";
import { Routes, Route } from "react-router-dom";
import useAuth from "../hooks/useAuth";  

// --- Auth Pages (No Navbar/Header) ---
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import VerifyEmail from "../pages/auth/VerifyEmail";
import ForgotPassword from "../pages/auth/ForgotPassword";
 
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

  return (
    <Routes>
      {/* --- PUBLIC & AUTH ROUTES (Standalone, NO Navbar/Header) --- */}
      <Route path="/" element={<Splash />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/verify-email" element={<VerifyEmail />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* --- PROTECTED ROUTES (Wrapped in Layout WITH Navbar/Header) --- */}
      {/* ProtectedRoute will safely handle the "isLoading" state we set in Redux */}
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