import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

// Pages
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Colleges from "../pages/Colleges";
import Hostels from "../pages/Hostels";
import Canteens from "../pages/Canteens";
import CanteenDetail from '../pages/CanteenDetail';
import Users from "../pages/Users";
import UserDetail from '../pages/UserDetail';
import Orders from "../pages/Orders";
import OrderDetail from '../pages/OrderDetail';
import Analytics from "../pages/Analytics";
import Finance from "../pages/Finance";
import Settings from "../pages/Settings";

// Components
import ProtectedRoute from "../components/common/ProtectedRoute";

// --- Standalone Auth Wrapper ---
// Protects routes that do NOT need the Sidebar/Header layout
const StandaloneAuth = ({ children }) => {
  const { admin } = useSelector((state) => state.auth);
  if (!admin) return <Navigate to="/login" replace />;
  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Route */}
      <Route path="/login" element={<Login />} />

      {/* Standalone Protected Route (No Sidebar Layout) */}
      <Route 
        path="/canteens/:id" 
        element={
          <StandaloneAuth>
            <CanteenDetail />
          </StandaloneAuth>
        } 
      />
        <Route
          path="/users/:id" 
          element={
            <StandaloneAuth>
              <UserDetail />
            </StandaloneAuth>
          } 
        />
        <Route
          path="/orders/:id" 
          element={
            <StandaloneAuth>
              <OrderDetail />
            </StandaloneAuth>
          } 
        />

      {/* Main App Layout (With Sidebar & Header) */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/colleges" element={<Colleges />} />
        <Route path="/hostels" element={<Hostels />} />
        <Route path="/canteens" element={<Canteens />} />
        <Route path="/users" element={<Users />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/finance" element={<Finance />} />
        <Route path="/settings" element={<Settings />} />
      </Route>

      {/* Fallback Route */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default AppRoutes;