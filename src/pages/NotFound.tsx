import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center h-64">
      <h1 className="text-2xl font-medium text-gray-800 mb-2">404</h1>
      <p className="text-gray-600 mb-6">Page not found</p>
      <Link to="/" className="btn btn-primary">
        Go to Dashboard
      </Link>
    </div>
  );
};

export default NotFound;
