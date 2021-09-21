import { useState, createContext, useEffect } from "react";

const Themes = {
  light: {
    name: 'light',
    textColor: "#171717",
    backgroundPrimary: "#fff",
    backgroundSecondary: "#F9FAFD",
    backgroundTertiary: 'rgba(160, 170, 255,.25)',
    boxShadowHover: "0 0 15px 0 #9e9e9e55",
    boxShadowCard: "0 0 10px 0 #dadada52"
  },
  dark: {
    name: 'dark',
    textColor: "#f1f1f1",
    backgroundPrimary: "#171717",
    backgroundSecondary: "#1E1E1E",
    backgroundTertiary: "#1E1E1E",
    boxShadowHover: "0 0 20px 0 #363636bf",
    boxShadowCard: "0 0 10px 0 #3b3b3b52"
  }
}

export const ThemeContext = createContext(null)

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(Themes['light'])
  const setThemeFunction = (themeName: string) => {
    setTheme(Themes[themeName])
    localStorage.setItem('theme', JSON.stringify(Themes[themeName]))
  }

  useEffect(() => {
    const savedTheme = JSON.parse(localStorage.getItem('theme'))
    if(savedTheme) {
      setTheme(Themes[savedTheme.name])
    }
  }, [])
  
  return (
    <ThemeContext.Provider
    value={{ setThemeFunction, data:theme }}
    >
      {children}
    </ThemeContext.Provider>
    )
  }
  