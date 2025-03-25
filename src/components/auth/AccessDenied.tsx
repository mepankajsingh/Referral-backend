import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';
import Button from '../ui/Button';
import { useAuth } from '../../context/AuthContext';

const AccessDenied: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
        <div className="flex justify-center mb-6">
          <div className="p-3 bg-red-100 rounded-full">
            <ShieldAlert className="h-12 w-12 text-red-500" />
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
        
        <p className="text-gray-600 mb-6">
          Sorry, you don't have permission to access the dashboard. This area is restricted to administrators only.
        </p>
        
        {user && (
          <p className="text-sm text-gray-500 mb-6">
            You are logged in as <span className="font-medium">{user.email}</span> with <span className="font-medium">{user.role || 'user'}</span> privileges.
          </p>
        )}
        
        <div className="space-y-3">
          <Button 
            onClick={() => navigate('/referral-codes')}
            className="w-full"
          >
            Go to Referral Codes
          </Button>
          
          <Button 
            variant="outline"
            onClick={() => navigate('/categories')}
            className="w-full"
          >
            Go to Categories
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AccessDenied;
