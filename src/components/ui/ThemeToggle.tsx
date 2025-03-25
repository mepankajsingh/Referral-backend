import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Moon, Sun } from 'lucide-react';

// Simple button version without using the Button component to avoid any dependency issues
const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 bg-gray-100 dark:bg-gray-700 rounded-md text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? (
        <div className="flex items-center">
          <Moon size={16} className="mr-1" />
          <span className="hidden md:inline">Dark</span>
        </div>
      ) : (
        <div className="flex items-center">
          <Sun size={16} className="mr-1" />
          <span className="hidden md:inline">Light</span>
        </div>
      )}
    </button>
  );
};

export default ThemeToggle;
