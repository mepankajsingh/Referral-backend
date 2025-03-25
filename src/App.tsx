import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './components/dashboard/Dashboard';
import LoginPage from './components/auth/LoginPage';
import ReferralCodesList from './components/referral-codes/ReferralCodesList';
import ReferralCodeForm from './components/referral-codes/ReferralCodeForm';
import CategoriesList from './components/categories/CategoriesList';
import CategoryForm from './components/categories/CategoryForm';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AccessDenied from './components/auth/AccessDenied';
import SettingsPage from './components/settings/SettingsPage';
import { useAuth } from './context/AuthContext';

const App: React.FC = () => {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/access-denied" element={<AccessDenied />} />
      
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/referral-codes" element={<ReferralCodesList />} />
          <Route path="/referral-codes/new" element={<ReferralCodeForm />} />
          <Route path="/referral-codes/:id" element={<ReferralCodeForm />} />
          <Route path="/categories" element={<CategoriesList />} />
          <Route path="/categories/new" element={<CategoryForm />} />
          <Route path="/categories/:id" element={<CategoryForm />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
      </Route>
      
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
