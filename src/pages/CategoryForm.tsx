import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getCategoryBySlug, createCategory, updateCategory } from '@/services/categoryService';
import { CategoryInsert } from '@/lib/database.types';

const CategoryForm = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const isEditMode = Boolean(slug);
  
  const [formData, setFormData] = useState<CategoryInsert>({
    name: '',
    slug: '',
    description: ''
  });
  
  const [loading, setLoading] = useState(isEditMode);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategory = async () => {
      if (!slug) return;
      
      try {
        const category = await getCategoryBySlug(slug);
        if (!category) {
          setError('Category not found');
          return;
        }
        
        setFormData({
          name: category.name,
          slug: category.slug,
          description: category.description || ''
        });
      } catch (err) {
        setError('Failed to load category');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (isEditMode) {
      fetchCategory();
    }
  }, [slug, isEditMode]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setFormData(prev => ({
      ...prev,
      name,
      slug: generateSlug(name)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      if (isEditMode && slug) {
        const category = await getCategoryBySlug(slug);
        if (category) {
          await updateCategory(category.id, formData);
        } else {
          throw new Error('Category not found');
        }
      } else {
        await createCategory(formData);
      }
      
      navigate('/categories');
    } catch (err) {
      setError(`Failed to ${isEditMode ? 'update' : 'create'} category`);
      console.error(err);
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500">Loading category...</p>
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

      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-6">
          {isEditMode ? 'Edit Category' : 'Create New Category'}
        </h1>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleNameChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-800"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="slug" className="block text-gray-700 font-medium mb-2">
              Slug
            </label>
            <input
              type="text"
              id="slug"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-800"
            />
            <p className="text-sm text-gray-500 mt-1">
              Used in URLs. Auto-generated from name, but can be edited.
            </p>
          </div>

          <div className="mb-6">
            <label htmlFor="description" className="block text-gray-700 font-medium mb-2">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description || ''}
              onChange={handleChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-800"
            />
          </div>

          <div className="flex justify-end">
            <Link
              to="/categories"
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded mr-2"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded disabled:opacity-50"
            >
              {submitting ? 'Saving...' : isEditMode ? 'Update Category' : 'Create Category'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryForm;
