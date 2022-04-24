import { useState, createContext, useEffect, ReactNode } from "react";

const Themes = {
  light: {
    name: "light",
    textColor: "#171717",
    textAccent: "#1010cb",
    textSecondary: "#999999",
    backgroundPrimary: "#fff",
    backgroundSecondary: "#F9FAFD",
    backgroundTertiary: "rgba(160, 170, 255,.25)",
    boxShadowHover: "0 0 15px 0 #9e9e9e55",
    boxShadowCard: "0 0 10px 0 #dadada52",
    borderBottomColor: "#e2e2e2",
  },
  dark: {
    name: "dark",
    textColor: "#f1f1f1",
    textAccent: "#6200ee",
    textSecondary: "#999999",
    backgroundPrimary: "#171717",
    backgroundSecondary: "#1E1E1E",
    backgroundTertiary: "#979797",
    boxShadowHover: "0 0 20px 0 #363636bf",
    boxShadowCard: "0 0 10px 0 #3b3b3b52",
    borderBottomColor: "#2c2c2c",
  },
};

export const ThemeContext = createContext(null);

interface Props {
  children: ReactNode;
}
export const ThemeProvider = ({ children }: Props) => {
  const [theme, setTheme] = useState(Themes["light"]);
  const setThemeFunction = (themeName: string) => {
    setTheme(Themes[themeName]);
    localStorage.setItem("theme", JSON.stringify(Themes[themeName]));
  };

  useEffect(() => {
    const savedTheme = JSON.parse(localStorage.getItem("theme"));
    if (savedTheme) {
      setTheme(Themes[savedTheme.name]);
    }
  }, []);

  return (
    <ThemeContext.Provider value={{ setThemeFunction, data: theme }}>
      {children}
    </ThemeContext.Provider>
  );
};
