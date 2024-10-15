import { Switch } from "@nextui-org/react";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";

import { FaMoon } from "react-icons/fa";
import { MdSunny } from "react-icons/md";

export default function ThemeChanger() {
  const [isHovered, setIsHovered] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme(); // resolvedTheme ensures it works for server-side rendering
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Sync the state with the current theme
  useEffect(() => {
    setIsDarkMode(resolvedTheme === "dark");
  }, [resolvedTheme]);

  // Handle theme toggle
  const handleThemeChange = () => {
    const newTheme = isDarkMode ? "light" : "dark";
    setTheme(newTheme);
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className="mt-2 flex w-full items-center justify-center">
      <Switch
        isSelected={isDarkMode} // Reflect current theme
        size="md"
        color="secondary"
        className="mx-auto focus:border-transparent focus:outline-none"
        thumbIcon={({ isSelected, className }) =>
          isSelected ? (
            <FaMoon className={className} />
          ) : (
            <MdSunny className={className} />
          )
        }
        onChange={handleThemeChange} // Handle theme switching
      ></Switch>
    </div>
  );
}
