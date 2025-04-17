import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ReferralCode, Category } from '@/lib/database.types';
import { getReferralCodeBySlug, deleteReferralCode } from '@/services/referralCodeService';
import { getCategoryBySlug } from '@/services/categoryService';

const ReferralCodeDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [referralCode, setReferralCode] = useState<ReferralCode | null>(null);
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!slug) return;
      
      try {
        const codeData = await getReferralCodeBySlug(slug);
        if (!codeData) {
          setError('Referral code not found');
          return;
        }
        
        setReferralCode(codeData);
        
        // Fetch the category
        if (codeData.category_id) {
          try {
            const categoryData = await getCategoryBySlug(codeData.category_id.toString());
            setCategory(categoryData);
          } catch (err) {
            console.error('Error fetching category:', err);
            // Don't set error here, we still want to show the referral code
          }
        }
      } catch (err) {
        setError('Failed to load referral code details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  const handleDelete = async () => {
    if (!referralCode || !window.confirm('Are you sure you want to delete this referral code?')) {
      return;
    }

    try {
      setIsDeleting(true);
      await deleteReferralCode(referralCode.id);
      navigate('/referral-codes');
    } catch (err) {
      setError('Failed to delete referral code');
      console.error(err);
      setIsDeleting(false);
    }
  };

  const handleCopyCode = () => {
    if (referralCode) {
      navigator.clipboard.writeText(referralCode.code)
        .then(() => alert('Code copied to clipboard!'))
        .catch(err => console.error('Failed to copy code:', err));
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500">Loading referral code details...</p>
      </div>
    );
  }

  if (error || !referralCode) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        <p>{error || 'Referral code not found'}</p>
        <Link to="/referral-codes" className="text-red-700 underline mt-2 inline-block">
          Back to Referral Codes
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <Link to="/referral-codes" className="text-blue-600 hover:text-blue-800">
          &larr; Back to Referral Codes
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center">
            {referralCode.logo_url && (
              <img 
                src={referralCode.logo_url} 
                alt={`${referralCode.service_name} logo`} 
                className="w-12 h-12 object-contain mr-4"
              />
            )}
            <h1 className="text-2xl font-bold">{referralCode.service_name}</h1>
            {referralCode.featured && (
              <span className="ml-3 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                Featured
              </span>
            )}
          </div>
          <div className="flex space-x-2">
            <Link 
              to={`/referral-codes/${referralCode.slug}/edit`}
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

        <div className="mb-4">
          <div className="flex items-center mb-2">
            <span className="font-medium mr-2">Referral Code:</span>
            <code className="bg-gray-100 px-3 py-1 rounded text-lg">{referralCode.code}</code>
            <button 
              onClick={handleCopyCode}
              className="ml-2 text-blue-600 hover:text-blue-800 text-sm"
            >
              Copy
            </button>
          </div>
          
          {category && (
            <div className="mb-2">
              <span className="font-medium">Category:</span>{' '}
              <Link to={`/categories/${category.slug}`} className="text-blue-600 hover:text-blue-800">
                {category.name}
              </Link>
            </div>
          )}
          
          {referralCode.url && (
            <div className="mb-2">
              <span className="font-medium">URL:</span>{' '}
              <a 
                href={referralCode.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 break-all"
              >
                {referralCode.url}
              </a>
            </div>
          )}
        </div>

        {referralCode.description && (
          <div className="mb-4">
            <h3 className="font-medium mb-1">Description</h3>
            <p className="text-gray-700">{referralCode.description}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {referralCode.user_benefit && (
            <div>
              <h3 className="font-medium mb-1">User Benefit</h3>
              <p className="text-gray-700">{referralCode.user_benefit}</p>
            </div>
          )}
          
          {referralCode.referrer_benefit && (
            <div>
              <h3 className="font-medium mb-1">Referrer Benefit</h3>
              <p className="text-gray-700">{referralCode.referrer_benefit}</p>
            </div>
          )}
        </div>

        {referralCode.terms && (
          <div className="mb-4">
            <h3 className="font-medium mb-1">Terms & Conditions</h3>
            <p className="text-gray-700 text-sm">{referralCode.terms}</p>
          </div>
        )}

        {referralCode.screenshot_url && (
          <div className="mb-4">
            <h3 className="font-medium mb-1">Screenshot</h3>
            <img 
              src={referralCode.screenshot_url} 
              alt={`${referralCode.service_name} screenshot`} 
              className="max-w-full h-auto rounded border border-gray-200"
            />
          </div>
        )}

        <div className="text-sm text-gray-500 mt-4">
          <p>Created: {new Date(referralCode.created_at).toLocaleString()}</p>
          <p>Last updated: {new Date(referralCode.updated_at).toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
};

export default ReferralCodeDetail;
