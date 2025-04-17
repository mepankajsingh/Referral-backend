import { Outlet, Link, useLocation } from 'react-router-dom';

const Layout = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname.startsWith(path) ? 'bg-gray-100' : '';
  };

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center">
              <Link to="/" className="font-medium text-gray-800">
                Referral Hub
              </Link>
              <div className="hidden md:block ml-8">
                <div className="flex items-baseline space-x-4">
                  <Link
                    to="/"
                    className={`px-3 py-2 text-sm ${
                      location.pathname === '/' ? 'text-gray-900 font-medium' : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/categories"
                    className={`px-3 py-2 text-sm ${
                      isActive('/categories') ? 'text-gray-900 font-medium' : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Categories
                  </Link>
                  <Link
                    to="/referral-codes"
                    className={`px-3 py-2 text-sm ${
                      isActive('/referral-codes') ? 'text-gray-900 font-medium' : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Referral Codes
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Mobile menu */}
        <div className="md:hidden border-t border-gray-100">
          <div className="px-2 py-1 flex justify-center space-x-4">
            <Link
              to="/"
              className={`px-3 py-2 text-sm ${
                location.pathname === '/' ? 'text-gray-900 font-medium' : 'text-gray-600'
              }`}
            >
              Dashboard
            </Link>
            <Link
              to="/categories"
              className={`px-3 py-2 text-sm ${
                isActive('/categories') ? 'text-gray-900 font-medium' : 'text-gray-600'
              }`}
            >
              Categories
            </Link>
            <Link
              to="/referral-codes"
              className={`px-3 py-2 text-sm ${
                isActive('/referral-codes') ? 'text-gray-900 font-medium' : 'text-gray-600'
              }`}
            >
              Referral Codes
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl w-full mx-auto px-4 py-6 flex-grow">
        <Outlet />
      </main>
      
      <footer className="border-t border-gray-100 py-4 text-center text-xs text-gray-400">
        &copy; {new Date().getFullYear()} Referral Hub
      </footer>
    </div>
  );
};

export default Layout;
