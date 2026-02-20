import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

import Header from "./Header";
import FloatingActionContainer from "../floating/FloatingActionContainer";

const ProtectedRoute = ({ children }) => {
  const { user } = useSelector((state) => state.auth);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-900 font-sans mx-auto max-w-md shadow-2xl relative overflow-hidden">
      <Header />

      {/* Removed pb-20 since there is no Navbar anymore */}
      <main className="flex-1 overflow-y-auto w-full custom-scrollbar relative">
        {children ? children : <Outlet />}
      </main>

      {/* Global Floating Cart (Shows on Home/Menu if items exist) */}
      <FloatingActionContainer />
    </div>
  );
};

export default ProtectedRoute;
