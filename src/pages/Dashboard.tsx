import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Category } from '@/lib/database.types';
import { ReferralCode } from '@/lib/database.types';
import { getCategories } from '@/services/categoryService';
import { getFeaturedReferralCodes } from '@/services/referralCodeService';

const Dashboard = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredCodes, setFeaturedCodes] = useState<ReferralCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesData, featuredCodesData] = await Promise.all([
          getCategories(),
          getFeaturedReferralCodes()
        ]);
        
        setCategories(categoriesData);
        setFeaturedCodes(featuredCodesData);
      } catch (err) {
        setError('Failed to load dashboard data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <p className="text-gray-500 text-center py-8">Loading...</p>;
  }

  if (error) {
    return <p className="text-red-500 text-center py-4">{error}</p>;
  }

  return (
    <div>
      <h1 className="text-xl font-medium text-gray-800 mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="card-minimal">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-base font-medium text-gray-800">Categories</h2>
            <Link to="/categories" className="text-sm text-gray-500 hover:text-gray-700">
              View All
            </Link>
          </div>
          
          {categories.length > 0 ? (
            <div className="space-y-1">
              {categories.slice(0, 5).map(category => (
                <div key={category.id} className="flex justify-between items-center py-1.5 border-b border-gray-50">
                  <span className="text-gray-700">{category.name}</span>
                  <Link 
                    to={`/categories/${category.slug}/edit`}
                    className="text-sm text-gray-500 hover:text-gray-700"
                  >
                    Edit
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No categories available.</p>
          )}
          
          <div className="mt-4">
            <Link 
              to="/categories/new" 
              className="btn btn-secondary text-sm"
            >
              Add New Category
            </Link>
          </div>
        </div>
        
        <div className="card-minimal">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-base font-medium text-gray-800">Featured Referral Codes</h2>
            <Link to="/referral-codes" className="text-sm text-gray-500 hover:text-gray-700">
              View All
            </Link>
          </div>
          
          {featuredCodes.length > 0 ? (
            <div className="space-y-1">
              {featuredCodes.slice(0, 5).map(code => (
                <div key={code.id} className="flex justify-between items-center py-1.5 border-b border-gray-50">
                  <div className="flex items-center">
                    {code.logo_url && (
                      <img 
                        src={code.logo_url} 
                        alt={`${code.service_name} logo`} 
                        className="w-5 h-5 object-contain mr-2"
                      />
                    )}
                    <span className="text-gray-700">{code.service_name}</span>
                  </div>
                  <Link 
                    to={`/referral-codes/${code.slug}/edit`}
                    className="text-sm text-gray-500 hover:text-gray-700"
                  >
                    Edit
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No featured referral codes available.</p>
          )}
          
          <div className="mt-4">
            <Link 
              to="/referral-codes/new" 
              className="btn btn-secondary text-sm"
            >
              Add New Referral Code
            </Link>
          </div>
        </div>
      </div>
      
      <div className="card-minimal">
        <h2 className="text-base font-medium text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Link 
            to="/categories" 
            className="border border-gray-100 hover:border-gray-200 p-3 rounded text-center"
          >
            <span className="text-gray-700">Manage Categories</span>
          </Link>
          <Link 
            to="/referral-codes" 
            className="border border-gray-100 hover:border-gray-200 p-3 rounded text-center"
          >
            <span className="text-gray-700">Manage Referral Codes</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
