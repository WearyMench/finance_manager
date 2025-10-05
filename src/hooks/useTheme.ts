import { useState, useEffect, useCallback } from 'react';

export type Theme = 'light' | 'dark';

interface UseThemeReturn {
  theme: Theme;
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
  initializeTheme: () => void;
}

const THEME_STORAGE_KEY = 'theme';
const THEME_ATTRIBUTE = 'data-theme';

export function useTheme(): UseThemeReturn {
  const [theme, setThemeState] = useState<Theme>('light');
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize theme on mount
  const initializeTheme = useCallback(() => {
    if (isInitialized) return;

    try {
      // Check localStorage first
      const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) as Theme;
      
      if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
        setThemeState(savedTheme);
        document.documentElement.setAttribute(THEME_ATTRIBUTE, savedTheme);
        setIsInitialized(true);
        return;
      }

      // Fallback to system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const systemTheme: Theme = prefersDark ? 'dark' : 'light';
      
      setThemeState(systemTheme);
      document.documentElement.setAttribute(THEME_ATTRIBUTE, systemTheme);
      localStorage.setItem(THEME_STORAGE_KEY, systemTheme);
      setIsInitialized(true);
    } catch (error) {
      console.error('Error initializing theme:', error);
      // Fallback to light theme
      setThemeState('light');
      document.documentElement.setAttribute(THEME_ATTRIBUTE, 'light');
      setIsInitialized(true);
    }
  }, [isInitialized]);

  // Set theme and update DOM
  const setTheme = useCallback((newTheme: Theme) => {
    try {
      setThemeState(newTheme);
      document.documentElement.setAttribute(THEME_ATTRIBUTE, newTheme);
      localStorage.setItem(THEME_STORAGE_KEY, newTheme);
      
      // Force a re-render by triggering a style recalculation
      document.documentElement.style.display = 'none';
      document.documentElement.offsetHeight; // Trigger reflow
      document.documentElement.style.display = '';
    } catch (error) {
      console.error('Error setting theme:', error);
    }
  }, []);

  // Toggle between light and dark
  const toggleTheme = useCallback(() => {
    const newTheme: Theme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  }, [theme, setTheme]);

  // Listen for system theme changes
  useEffect(() => {
    if (!isInitialized) return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      // Only update if no theme is explicitly set in localStorage
      const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
      if (!savedTheme) {
        const newTheme: Theme = e.matches ? 'dark' : 'light';
        setTheme(newTheme);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [isInitialized, setTheme]);

  // Initialize theme on mount
  useEffect(() => {
    initializeTheme();
  }, [initializeTheme]);

  // Force theme re-application when component mounts (useful for auth state changes)
  useEffect(() => {
    if (isInitialized) {
      // Small delay to ensure DOM is ready
      const timeoutId = setTimeout(() => {
        document.documentElement.setAttribute(THEME_ATTRIBUTE, theme);
        
        // Force style recalculation
        const event = new Event('themechange');
        document.dispatchEvent(event);
      }, 10);

      return () => clearTimeout(timeoutId);
    }
  }, [theme, isInitialized]);

  return {
    theme,
    isDark: theme === 'dark',
    toggleTheme,
    setTheme,
    initializeTheme,
  };
}
