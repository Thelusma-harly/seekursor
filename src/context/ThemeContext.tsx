import React, { createContext, useContext, useEffect, useLayoutEffect, useState } from "react";
import { useLocale } from "next-intl";

export type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "light",
  toggleTheme: () => {},
  setTheme: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const locale = useLocale();
  // Default theme MUST explicitly be LIGHT MODE
  const [theme, setThemeState] = useState<Theme>("light");
  const [initialized, setInitialized] = useState(false);
  // Hydrate with the same state as the server, then restore the saved appearance before paint.
  useLayoutEffect(() => {
    let savedTheme: Theme = "light";
    try {
      savedTheme = localStorage.getItem("seekursor-theme") === "dark" ? "dark" : "light";
    } catch {
      savedTheme = document.documentElement.classList.contains("dark") ? "dark" : "light";
    }
    // Next.js updates the root layout's class during locale navigation.
    // Restore the independent appearance preference before that update is painted.
    document.documentElement.classList.toggle("dark", savedTheme === "dark");
    document.documentElement.style.colorScheme = savedTheme;
    setThemeState(savedTheme);
    setInitialized(true);
  }, [locale]);

  useEffect(() => {
    if (!initialized) return;
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    root.style.colorScheme = theme;
    try {
      localStorage.setItem("seekursor-theme", theme);
    } catch {
      // Ignore storage errors in restricted contexts
    }
  }, [theme, initialized]);

  const toggleTheme = () => {
    setThemeState((prev) => (prev === "light" ? "dark" : "light"));
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
