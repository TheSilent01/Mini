import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchPreferences, savePreferences, syncPreferencesToLocalStorage } from '../lib/settings';
import { getCurrentUser } from '../lib/auth';
import type { UserPreferences, AuthUser } from '../lib/types';

interface ThemeContextType {
  darkMode: boolean;
  toggleTheme: () => void;
  preferences: UserPreferences | null;
  updatePreferences: (updates: Partial<UserPreferences>) => Promise<void>;
  user: AuthUser | null;
  isLoading: boolean;
}

const ThemeContext = createContext<ThemeContextType>({
  darkMode: false,
  toggleTheme: () => {},
  preferences: null,
  updatePreferences: async () => {},
  user: null,
  isLoading: true,
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [darkMode, setDarkMode] = useState(false);
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize user and preferences
  useEffect(() => {
    initializeApp();
  }, []);

  async function initializeApp() {
    try {
      setIsLoading(true);
      
      // Get current user
      const currentUser = await getCurrentUser();
      setUser(currentUser);

      if (currentUser) {
        // Fetch preferences from Supabase
        const userPrefs = await fetchPreferences(currentUser.id);
        if (userPrefs) {
          setPreferences(userPrefs);
          setDarkMode(userPrefs.dark_mode);
          syncPreferencesToLocalStorage(userPrefs);
        }
      } else {
        // Load from local storage if no user
        const stored = typeof window !== 'undefined' && localStorage.getItem('darkMode');
        if (stored) {
          setDarkMode(stored === 'true');
        }
      }
    } catch (error) {
      console.error('Failed to initialize app:', error);
    } finally {
      setIsLoading(false);
    }
  }

  const toggleTheme = async () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);

    if (user && preferences) {
      await updatePreferences({ dark_mode: newDarkMode });
    } else {
      // Save to local storage if no user
      if (typeof window !== 'undefined') {
        localStorage.setItem('darkMode', newDarkMode ? 'true' : 'false');
      }
    }
  };

  const updatePreferences = async (updates: Partial<UserPreferences>) => {
    if (!user || !preferences) return;

    try {
      const result = await savePreferences(user.id, updates);
      if (result.success && result.data) {
        setPreferences(result.data);
        syncPreferencesToLocalStorage(result.data);
        
        // Update dark mode if it was changed
        if ('dark_mode' in updates) {
          setDarkMode(updates.dark_mode!);
        }
      }
    } catch (error) {
      console.error('Failed to update preferences:', error);
    }
  };

  // Apply dark mode class to document
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (darkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, [darkMode]);

  return (
    <ThemeContext.Provider value={{
      darkMode,
      toggleTheme,
      preferences,
      updatePreferences,
      user,
      isLoading,
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}