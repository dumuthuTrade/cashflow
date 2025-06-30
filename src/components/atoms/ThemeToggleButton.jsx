import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';

const ThemeToggleButton = ({ 
  className = '',
  showLabel = false,
  ...props 
}) => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check if dark mode is enabled on mount
    const isDarkMode = document.documentElement.classList.contains('dark') ||
      (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
    setIsDark(isDarkMode);
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    
    if (newTheme) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`flex items-center justify-center w-10 h-10 rounded-lg text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors ${className}`}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      {...props}
    >
      {isDark ? (
        <SunIcon className="w-5 h-5" />
      ) : (
        <MoonIcon className="w-5 h-5" />
      )}
      {showLabel && (
        <span className="ml-2 text-sm">
          {isDark ? 'Light' : 'Dark'}
        </span>
      )}
    </button>
  );
};

ThemeToggleButton.propTypes = {
  className: PropTypes.string,
  showLabel: PropTypes.bool
};

export default ThemeToggleButton;
