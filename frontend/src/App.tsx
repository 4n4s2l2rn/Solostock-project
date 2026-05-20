import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './theme';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Catalog from './pages/Catalog';
import Payments from './pages/Payments';
import MyOffers from './pages/MyOffers';
import ReceivedOffers from './pages/ReceivedOffers';
import MyProducts from './pages/MyProducts';
import Admin from './pages/Admin';

const P = (element: React.ReactNode) => (
  <ProtectedRoute><Layout>{element}</Layout></ProtectedRoute>
);

const App: React.FC = () => (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/dashboard"       element={P(<Dashboard />)} />
          <Route path="/catalog"         element={P(<Catalog />)} />
          <Route path="/payments"        element={P(<Payments />)} />

          {/* ACHETEUR */}
          <Route path="/my-offers"       element={P(<MyOffers />)} />

          {/* FOURNISSEUR */}
          <Route path="/my-products"     element={P(<MyProducts />)} />
          <Route path="/received-offers" element={P(<ReceivedOffers />)} />

          {/* ADMIN */}
          <Route path="/admin"           element={P(<Admin />)} />

          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </ThemeProvider>
);

export default App;