import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';

import Layout from './components/layout/Layout';
import Dashboard from './components/dashboard/Dashboard';
import ReferralCodesList from './components/referral-codes/ReferralCodesList';
import ReferralCodeForm from './components/referral-codes/ReferralCodeForm';
import CategoriesList from './components/categories/CategoriesList';
import CategoryForm from './components/categories/CategoryForm';
import LoginPage from './components/auth/LoginPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AccessDenied from './components/auth/AccessDenied';

function App() {
  return (
    <GoogleOAuthProvider clientId="27680385597-uikk80prv62lj5gh33aroclqkvad0970.apps.googleusercontent.com">
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/access-denied" element={<AccessDenied />} />
            
            <Route path="/" element={
              <ProtectedRoute requireAdmin={true}>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/referral-codes" element={
              <ProtectedRoute>
                <Layout>
                  <ReferralCodesList />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/referral-codes/new" element={
              <ProtectedRoute requireAdmin={true}>
                <Layout>
                  <ReferralCodeForm />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/referral-codes/:id/edit" element={
              <ProtectedRoute requireAdmin={true}>
                <Layout>
                  <ReferralCodeForm />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/categories" element={
              <ProtectedRoute>
                <Layout>
                  <CategoriesList />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/categories/new" element={
              <ProtectedRoute requireAdmin={true}>
                <Layout>
                  <CategoryForm />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/categories/:id/edit" element={
              <ProtectedRoute requireAdmin={true}>
                <Layout>
                  <CategoryForm />
                </Layout>
              </ProtectedRoute>
            } />
          </Routes>
        </Router>
        <Toaster position="top-right" />
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
