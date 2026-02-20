"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type DarkMode = "light" | "dark";

interface ThemeContextType {
  darkMode: DarkMode;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  setDarkMode: (theme: DarkMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [darkMode, setDarkModeState] = useState<DarkMode>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedDarkMode = localStorage.getItem("darkMode") as DarkMode;

    if (savedDarkMode === "dark" || savedDarkMode === "light") {
      setDarkModeState(savedDarkMode);
      applyDarkMode(savedDarkMode);
    }
  }, []);

  const applyDarkMode = (newDarkMode: DarkMode) => {
    if (newDarkMode === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const setDarkMode = (newDarkMode: DarkMode) => {
    setDarkModeState(newDarkMode);
    localStorage.setItem("darkMode", newDarkMode);
    applyDarkMode(newDarkMode);
  };

  const toggleDarkMode = () => {
    const newDarkMode = darkMode === "light" ? "dark" : "light";
    setDarkMode(newDarkMode);
  };

  const value: ThemeContextType = {
    darkMode,
    isDarkMode: darkMode === "dark",
    toggleDarkMode,
    setDarkMode,
  };

  if (!mounted) {
    return null;
  }

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
