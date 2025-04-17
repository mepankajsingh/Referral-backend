import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Category, ReferralCode } from '@/lib/database.types';
import { getCategoryBySlug, deleteCategory } from '@/services/categoryService';
import { getReferralCodesByCategory } from '@/services/referralCodeService';
import ReferralCodeCard from '@/components/ReferralCodeCard';

const CategoryDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [category, setCategory] = useState<Category | null>(null);
  const [referralCodes, setReferralCodes] = useState<ReferralCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!slug) return;
      
      try {
        const categoryData = await getCategoryBySlug(slug);
        if (!categoryData) {
          setError('Category not found');
          return;
        }
        
        setCategory(categoryData);
        const codesData = await getReferralCodesByCategory(categoryData.id);
        setReferralCodes(codesData);
      } catch (err) {
        setError('Failed to load category details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  const handleDelete = async () => {
    if (!category || !window.confirm('Are you sure you want to delete this category?')) {
      return;
    }

    try {
      setIsDeleting(true);
      await deleteCategory(category.id);
      navigate('/categories');
    } catch (err) {
      setError('Failed to delete category');
      console.error(err);
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500">Loading category details...</p>
      </div>
    );
  }

  if (error || !category) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        <p>{error || 'Category not found'}</p>
        <Link to="/categories" className="text-red-700 underline mt-2 inline-block">
          Back to Categories
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <Link to="/categories" className="text-blue-600 hover:text-blue-800">
          &larr; Back to Categories
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex justify-between items-start mb-4">
          <h1 className="text-2xl font-bold">{category.name}</h1>
          <div className="flex space-x-2">
            <Link 
              to={`/categories/${category.slug}/edit`}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
            >
              Edit
            </Link>
            <button 
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm disabled:opacity-50"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>

        {category.description && (
          <p className="text-gray-600 mb-4">{category.description}</p>
        )}

        <div className="text-sm text-gray-500">
          <p>Created: {new Date(category.created_at).toLocaleString()}</p>
          <p>Last updated: {new Date(category.updated_at).toLocaleString()}</p>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Referral Codes in this Category</h2>
          <Link 
            to="/referral-codes/new" 
            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
          >
            Add Referral Code
          </Link>
        </div>

        {referralCodes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {referralCodes.map(code => (
              <ReferralCodeCard key={code.id} referralCode={code} />
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No referral codes in this category.</p>
        )}
      </div>
    </div>
  );
};

export default CategoryDetail;
