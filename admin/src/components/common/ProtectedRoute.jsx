import React, { useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Sidebar from './Sidebar';
import Header from './Header';

const ProtectedRoute = () => {
  const { admin } = useSelector((state) => state.auth);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // If not authenticated, redirect to login
  if (!admin) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden relative">
      
      {/* Mobile Dark Overlay - Appears when sidebar is open */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar Component */}
      <Sidebar isOpen={isSidebarOpen} closeSidebar={() => setIsSidebarOpen(false)} />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden lg:ml-64 transition-all duration-300">
        <Header toggleSidebar={() => setIsSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          {/* This renders the actual page content (Dashboard, Colleges, etc.) */}
          <Outlet /> 
        </main>
      </div>
      
    </div>
  );
};

export default ProtectedRoute;