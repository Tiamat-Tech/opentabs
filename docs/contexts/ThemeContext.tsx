'use client';

import { Theme as ColorTheme } from '@/config/theme';
import { createContext, useContext, useState } from 'react';
import type React from 'react';

type DarkMode = 'light' | 'dark';

interface ThemeContextType {
  darkMode: DarkMode;
  colorTheme: ColorTheme;
  variant: string;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  setDarkMode: (theme: DarkMode) => void;
  setColorTheme: (theme: ColorTheme) => void;
  setVariant: (variant: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const applyDarkMode = (newDarkMode: DarkMode) => {
  if (newDarkMode === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
};

const readStorage = (key: string): string | null => {
  try {
    return typeof window !== 'undefined' ? localStorage.getItem(key) : null;
  } catch {
    return null;
  }
};

const getInitialDarkMode = (): DarkMode => {
  const saved = readStorage('darkMode');
  return saved === 'dark' || saved === 'light' ? saved : 'light';
};

const getInitialColorTheme = (): ColorTheme => {
  const saved = readStorage('colorTheme') as ColorTheme | null;
  if (saved !== null && Object.values(ColorTheme).includes(saved)) return saved;
  return ColorTheme.Default;
};

const getInitialVariant = (): string => readStorage('variant') ?? 'box';

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [darkMode, setDarkModeState] = useState<DarkMode>(getInitialDarkMode);
  const [colorTheme, setColorThemeState] = useState<ColorTheme>(getInitialColorTheme);
  const [variant, setVariantState] = useState<string>(getInitialVariant);

  const setDarkMode = (newDarkMode: DarkMode) => {
    setDarkModeState(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode);
    applyDarkMode(newDarkMode);
  };

  const setColorTheme = (newColorTheme: ColorTheme) => {
    setColorThemeState(newColorTheme);
    localStorage.setItem('colorTheme', newColorTheme);
  };

  const setVariant = (newVariant: string) => {
    setVariantState(newVariant);
    localStorage.setItem('variant', newVariant);
  };

  const toggleDarkMode = () => {
    const newDarkMode: DarkMode = darkMode === 'dark' ? 'light' : 'dark';
    setDarkMode(newDarkMode);
  };

  const value: ThemeContextType = {
    darkMode,
    colorTheme,
    variant,
    isDarkMode: darkMode === 'dark',
    toggleDarkMode,
    setDarkMode,
    setColorTheme,
    setVariant,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
