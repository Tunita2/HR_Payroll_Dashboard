import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme ? savedTheme === 'dark' : true; // Default to dark theme
  });

  useEffect(() => {
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark((prev) => !prev);
  };

  // Theme object containing all theme-related values and functions
  const theme = {
    isDark,
    toggleTheme,
    colors: {
      primary: isDark ? '#2563eb' : '#3b82f6',
      primaryDark: isDark ? '#1d4ed8' : '#2563eb',
      secondary: isDark ? '#4b5563' : '#6b7280',
      secondaryDark: isDark ? '#374151' : '#4b5563',
      background: isDark ? '#0f172a' : '#f1f5f9',
      backgroundSecondary: isDark ? '#1e293b' : '#ffffff',
      text: isDark ? '#e2e8f0' : '#1e293b',
      textSecondary: isDark ? '#94a3b8' : '#4b5563',
      border: isDark ? '#334155' : '#e2e8f0',
      success: isDark ? '#10b981' : '#059669',
      warning: isDark ? '#f59e0b' : '#d97706',
      error: isDark ? '#ef4444' : '#dc2626',
      info: isDark ? '#3b82f6' : '#2563eb'
    },
    shadows: {
      sm: isDark
        ? '0 1px 2px rgba(0, 0, 0, 0.3)'
        : '0 1px 2px rgba(0, 0, 0, 0.1)',
      md: isDark
        ? '0 4px 6px rgba(0, 0, 0, 0.4)'
        : '0 4px 6px rgba(0, 0, 0, 0.1)',
      lg: isDark
        ? '0 10px 15px rgba(0, 0, 0, 0.5)'
        : '0 10px 15px rgba(0, 0, 0, 0.1)'
    }
  };

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};

// Default theme values for reference
export const defaultTheme = {
  isDark: true,
  toggleTheme: () => {},
  colors: {
    primary: '#2563eb',
    primaryDark: '#1d4ed8',
    secondary: '#4b5563',
    secondaryDark: '#374151',
    background: '#0f172a',
    backgroundSecondary: '#1e293b',
    text: '#e2e8f0',
    textSecondary: '#94a3b8',
    border: '#334155',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6'
  },
  shadows: {
    sm: '0 1px 2px rgba(0, 0, 0, 0.3)',
    md: '0 4px 6px rgba(0, 0, 0, 0.4)',
    lg: '0 10px 15px rgba(0, 0, 0, 0.5)'
  }
};