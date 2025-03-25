import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  LayoutDashboard, 
  Tag, 
  FolderTree, 
  Settings,
  ChevronRight
} from 'lucide-react';

interface SidebarProps {
  isSidebarOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isSidebarOpen }) => {
  const { isAdmin } = useAuth();

  const navLinkClass = ({ isActive }: { isActive: boolean }) => 
    `flex items-center p-2 text-base font-medium rounded-lg ${
      isActive 
        ? 'bg-gray-100 dark:bg-gray-700 text-blue-600 dark:text-blue-500' 
        : 'text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
    }`;

  return (
    <aside 
      className={`fixed top-0 left-0 z-20 w-64 h-full pt-16 transition-transform bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0`}
      aria-label="Sidebar"
    >
      <div className="h-full px-3 pb-4 overflow-y-auto">
        <ul className="space-y-2 mt-5">
          <li>
            <NavLink to="/" className={navLinkClass}>
              <LayoutDashboard size={20} className="mr-3" />
              <span>Dashboard</span>
            </NavLink>
          </li>
          
          {isAdmin && (
            <>
              <li>
                <NavLink to="/referral-codes" className={navLinkClass}>
                  <Tag size={20} className="mr-3" />
                  <span>Referral Codes</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/categories" className={navLinkClass}>
                  <FolderTree size={20} className="mr-3" />
                  <span>Categories</span>
                </NavLink>
              </li>
            </>
          )}
          
          <li>
            <NavLink to="/settings" className={navLinkClass}>
              <Settings size={20} className="mr-3" />
              <span>Settings</span>
            </NavLink>
          </li>
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;
