import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LogOut, Menu } from 'lucide-react';
import Button from '../ui/Button';
import ThemeToggle from '../ui/ThemeToggle';

interface NavbarProps {
  toggleSidebar: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ toggleSidebar }) => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 fixed z-30 w-full">
      <div className="px-3 py-3 lg:px-5 lg:pl-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-start">
            <button
              onClick={toggleSidebar}
              className="lg:hidden mr-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white cursor-pointer p-2 hover:bg-gray-100 dark:hover:bg-gray-700 focus:bg-gray-100 dark:focus:bg-gray-700 focus:ring-2 focus:ring-gray-100 dark:focus:ring-gray-700 rounded"
            >
              <Menu size={20} />
            </button>
            <Link to="/" className="text-xl font-bold flex items-center lg:ml-2.5">
              <span className="self-center whitespace-nowrap text-gray-800 dark:text-white">Referral Admin</span>
            </Link>
          </div>
          <div className="flex items-center space-x-3">
            {/* Explicitly render ThemeToggle */}
            <ThemeToggle />
            
            {/* Always render logout button for debugging */}
            <div className="flex items-center">
              {user && user.avatar_url && (
                <img
                  className="h-8 w-8 rounded-full mr-2"
                  src={user.avatar_url}
                  alt="User avatar"
                />
              )}
              {user && (
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 mr-2">
                  {user.name || user.email}
                </span>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="flex items-center"
              >
                <LogOut size={16} className="mr-1" />
                <span>Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
