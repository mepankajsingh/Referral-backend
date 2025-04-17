import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import Dashboard from '@/pages/Dashboard';
import CategoryList from '@/pages/CategoryList';
import CategoryForm from '@/pages/CategoryForm';
import ReferralCodeList from '@/pages/ReferralCodeList';
import ReferralCodeForm from '@/pages/ReferralCodeForm';
import NotFound from '@/pages/NotFound';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          
          {/* Category Routes */}
          <Route path="categories" element={<CategoryList />} />
          <Route path="categories/new" element={<CategoryForm />} />
          <Route path="categories/:slug/edit" element={<CategoryForm />} />
          
          {/* Referral Code Routes */}
          <Route path="referral-codes" element={<ReferralCodeList />} />
          <Route path="referral-codes/new" element={<ReferralCodeForm />} />
          <Route path="referral-codes/:slug/edit" element={<ReferralCodeForm />} />
          
          {/* Redirect old detail routes to list pages */}
          <Route path="categories/:slug" element={<Navigate to="/categories" replace />} />
          <Route path="referral-codes/:slug" element={<Navigate to="/referral-codes" replace />} />
          
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
