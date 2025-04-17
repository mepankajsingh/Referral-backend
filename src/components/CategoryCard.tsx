import { Link } from 'react-router-dom';
import { Category } from '@/lib/database.types';

interface CategoryCardProps {
  category: Category;
}

const CategoryCard = ({ category }: CategoryCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow">
      <h3 className="text-lg font-semibold mb-2">{category.name}</h3>
      {category.description && (
        <p className="text-gray-600 mb-4 line-clamp-2">{category.description}</p>
      )}
      <div className="flex justify-between items-center">
        <Link 
          to={`/categories/${category.slug}`}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          View Details
        </Link>
        <span className="text-xs text-gray-500">
          {new Date(category.updated_at).toLocaleDateString()}
        </span>
      </div>
    </div>
  );
};

export default CategoryCard;
