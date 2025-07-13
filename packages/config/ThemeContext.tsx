import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext({
  darkMode: false,
  toggleTheme: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const stored = typeof window !== 'undefined' && localStorage.getItem('darkMode');
    if (stored) setDarkMode(stored === 'true');
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('darkMode', darkMode ? 'true' : 'false');
    }
  }, [darkMode]);

  const toggleTheme = () => setDarkMode((v) => !v);

  return (
    <ThemeContext.Provider value={{ darkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
