import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Save, Moon, Sun, User } from 'lucide-react';

const SettingsPage: React.FC = () => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [emailFrequency, setEmailFrequency] = useState('daily');
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // In a real app, you would save these settings to your backend
    console.log('Settings saved:', {
      notificationsEnabled,
      emailFrequency,
      theme
    });
    
    setIsSaving(false);
  };

  return (
    <div className="p-4 bg-white dark:bg-gray-900 rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Settings</h1>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-200">Account Information</h2>
        <div className="flex items-center mb-4">
          {user?.avatar_url ? (
            <img src={user.avatar_url} alt="Profile" className="w-16 h-16 rounded-full mr-4" />
          ) : (
            <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center mr-4">
              <User size={32} className="text-gray-500 dark:text-gray-400" />
            </div>
          )}
          <div>
            <p className="font-medium text-gray-800 dark:text-white">{user?.name || 'User'}</p>
            <p className="text-gray-600 dark:text-gray-300">{user?.email || 'No email available'}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Role: {user?.role || 'User'}</p>
          </div>
        </div>
      </div>
      
      <form onSubmit={handleSaveSettings}>
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-200">Appearance</h2>
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div>
              <p className="font-medium text-gray-800 dark:text-white">Dark Mode</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Toggle between light and dark theme</p>
            </div>
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2 bg-white dark:bg-gray-700 rounded-md shadow-sm hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
            >
              {theme === 'light' ? (
                <Moon size={20} className="text-gray-800" />
              ) : (
                <Sun size={20} className="text-yellow-400" />
              )}
            </button>
          </div>
        </div>
        
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-200">Notifications</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-800 dark:text-white">Enable Notifications</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Receive notifications about referral activity</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={notificationsEnabled}
                  onChange={() => setNotificationsEnabled(!notificationsEnabled)}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>
            
            {notificationsEnabled && (
              <div>
                <p className="font-medium text-gray-800 dark:text-white mb-2">Email Frequency</p>
                <select
                  value={emailFrequency}
                  onChange={(e) => setEmailFrequency(e.target.value)}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                >
                  <option value="realtime">Real-time</option>
                  <option value="daily">Daily Digest</option>
                  <option value="weekly">Weekly Summary</option>
                  <option value="never">Never</option>
                </select>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex justify-end">
          <button
            type="submit"
            className={`px-4 py-2 rounded-md text-white bg-blue-600 hover:bg-blue-700 flex items-center ${isSaving ? 'opacity-70 cursor-not-allowed' : ''}`}
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 <boltAction type="file" filePath="src/components/settings/SettingsPage.tsx">import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Save, Moon, Sun, User } from 'lucide-react';

const SettingsPage: React.FC = () => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [emailFrequency, setEmailFrequency] = useState('daily');
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // In a real app, you would save these settings to your backend
    console.log('Settings saved:', {
      notificationsEnabled,
      emailFrequency,
      theme
    });
    
    setIsSaving(false);
  };

  return (
    <div className="p-4 bg-white dark:bg-gray-900 rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Settings</h1>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-200">Account Information</h2>
        <div className="flex items-center mb-4">
          {user?.avatar_url ? (
            <img src={user.avatar_url} alt="Profile" className="w-16 h-16 rounded-full mr-4" />
          ) : (
            <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center mr-4">
              <User size={32} className="text-gray-500 dark:text-gray-400" />
            </div>
          )}
          <div>
            <p className="font-medium text-gray-800 dark:text-white">{user?.name || 'User'}</p>
            <p className="text-gray-600 dark:text-gray-300">{user?.email || 'No email available'}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Role: {user?.role || 'User'}</p>
          </div>
        </div>
      </div>
      
      <form onSubmit={handleSaveSettings}>
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-200">Appearance</h2>
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div>
              <p className="font-medium text-gray-800 dark:text-white">Dark Mode</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Toggle between light and dark theme</p>
            </div>
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2 bg-white dark:bg-gray-700 rounded-md shadow-sm hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
            >
              {theme === 'light' ? (
                <Moon size={20} className="text-gray-800" />
              ) : (
                <Sun size={20} className="text-yellow-400" />
              )}
            </button>
          </div>
        </div>
        
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-200">Notifications</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-800 dark:text-white">Enable Notifications</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Receive notifications about referral activity</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={notificationsEnabled}
                  onChange={() => setNotificationsEnabled(!notificationsEnabled)}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>
            
            {notificationsEnabled && (
              <div>
                <p className="font-medium text-gray-800 dark:text-white mb-2">Email Frequency</p>
                <select
                  value={emailFrequency}
                  onChange={(e) => setEmailFrequency(e.target.value)}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                >
                  <option value="realtime">Real-time</option>
                  <option value="daily">Daily Digest</option>
                  <option value="weekly">Weekly Summary</option>
                  <option value="never">Never</option>
                </select>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex justify-end">
          <button
            type="submit"
            className={`px-4 py-2 rounded-md text-white bg-blue-600 hover:bg-blue-700 flex items-center ${isSaving ? 'opacity-70 cursor-not-allowed' : ''}`}
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </>
            ) : (
              <>
                <Save size={16} className="mr-2" />
                Save Settings
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SettingsPage;
