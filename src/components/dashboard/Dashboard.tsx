import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Tag, Grid, ArrowRight } from 'lucide-react';
import { getReferralCodes, getCategories } from '../../lib/supabase';
import { ReferralCode, Category } from '../../types';
import Button from '../ui/Button';

const Dashboard: React.FC = () => {
  const [referralCodes, setReferralCodes] = useState<ReferralCode[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [codesData, categoriesData] = await Promise.all([
          getReferralCodes(),
          getCategories()
        ]);
        setReferralCodes(codesData);
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Referral Codes</h2>
            <div className="p-3 bg-blue-100 rounded-full">
              <Tag className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="text-3xl font-bold mb-2">{referralCodes.length}</div>
          <div className="text-sm text-gray-500">Total referral codes</div>
          <div className="mt-4">
            <Link to="/referral-codes">
              <Button variant="outline" size="sm" className="flex items-center">
                View All
                <ArrowRight size={16} className="ml-2" />
              </Button>
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Categories</h2>
            <div className="p-3 bg-green-100 rounded-full">
              <Grid className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="text-3xl font-bold mb-2">{categories.length}</div>
          <div className="text-sm text-gray-500">Total categories</div>
          <div className="mt-4">
            <Link to="/categories">
              <Button variant="outline" size="sm" className="flex items-center">
                View All
                <ArrowRight size={16} className="ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold mb-4">Recent Referral Codes</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  App Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Code
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created At
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {referralCodes.slice(0, 5).map((code) => (
                <tr key={code.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {code.icon && (
                        <img
                          src={code.icon}
                          alt={`${code.app_name} icon`}
                          className="h-8 w-8 rounded-full mr-3"
                        />
                      )}
                      <div className="text-sm font-medium text-gray-900">{code.app_name}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {code.code}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {categories.find(cat => cat.id === code.category_id)?.name || 'Unknown'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(code.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
              {referralCodes.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                    No referral codes found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
