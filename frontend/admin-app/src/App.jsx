import React from 'react';
import { StrictMode } from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import AuthProvider from './context/AuthContext';
import Layout from "./pages/AdminBase";
import NOtFound from './pages/NotFound';

function App() {
  return (
    <StrictMode>
      <Router>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Layout />} />
            <Route path="*" element={<NOtFound />} />
          </Routes>
        </AuthProvider>
      </Router>
    </StrictMode>

  );
}

export default App;