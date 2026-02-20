import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';

function App() {
  return (
    <BrowserRouter>
      <div className="app-layout">
        <AppRoutes />
      </div>
    </BrowserRouter>
  );
}

export default App;