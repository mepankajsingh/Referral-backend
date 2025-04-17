import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Category } from '@/lib/database.types';
import { getCategories, deleteCategory } from '@/services/categoryService';

const CategoryList = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (err) {
        setError('Failed to load categories');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this category?')) {
      return;
    }

    try {
      await deleteCategory(id);
      setCategories(categories.filter(category => category.id !== id));
    } catch (err) {
      setError('Failed to delete category');
      console.error(err);
    }
  };

  if (loading) {
    return <p className="text-gray-500 text-center py-8">Loading...</p>;
  }

  if (error) {
    return <p className="text-red-500 text-center py-4">{error}</p>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-medium text-gray-800">Categories</h1>
        <Link to="/categories/new" className="btn btn-primary">
          Add Category
        </Link>
      </div>

      {categories.length > 0 ? (
        <table className="table-minimal">
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Updated</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map(category => (
              <tr key={category.id}>
                <td className="font-medium text-gray-800">{category.name}</td>
                <td className="text-gray-600 max-w-xs truncate">{category.description || '-'}</td>
                <td className="text-gray-500 text-sm">{new Date(category.updated_at).toLocaleDateString()}</td>
                <td className="text-right space-x-3">
                  <Link 
                    to={`/categories/${category.slug}/edit`} 
                    className="text-gray-600 hover:text-gray-900"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(category.id)}
                    className="btn-danger"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-gray-500 text-center py-8">No categories available.</p>
      )}
    </div>
  );
};

export default CategoryList;
