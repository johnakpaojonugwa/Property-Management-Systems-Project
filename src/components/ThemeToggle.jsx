"use client";

import { useApp } from "@/context/AppContext";
import { motion } from "framer-motion";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useApp();

  return (
    <motion.button
      onClick={toggleTheme}
      whileTap={{ scale: 0.9 }}
      className="
        fixed z-50 
        md:top-5 md:right-5 
        bottom-6 right-6
        bg-white dark:bg-gray-800 
        border border-gray-200 dark:border-gray-700 
        shadow-xl hover:shadow-2xl 
        rounded-full p-3 sm:p-4 
        transition-all duration-300 
        hover:scale-105 
        backdrop-blur-md
      "
      title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
    >
      {theme === "light" ? (
        <Moon className="text-gray-800 w-5 h-5 sm:w-6 sm:h-6 transition-transform duration-300" />
      ) : (
        <Sun className="text-yellow-400 w-5 h-5 sm:w-6 sm:h-6 transition-transform duration-300" />
      )}
    </motion.button>
  );
}
