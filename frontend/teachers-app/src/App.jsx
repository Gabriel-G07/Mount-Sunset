import React from 'react';
import { StrictMode } from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import AuthProvider from './context/AuthContext';
import Layout from "./pages/TeachersBase";
import NotFound from './pages/NotFound.jsx'



function App() {
  return (
    <StrictMode>
      <Router>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Layout />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </Router>
    </StrictMode>

  );
}

export default App;