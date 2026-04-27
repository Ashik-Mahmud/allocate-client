"use client";

import { MoonStar, SunMedium } from "lucide-react";
import { useTheme } from "next-themes";

import { cn } from "@/lib/utils";

type ThemeToggleProps = {
  floating?: boolean;
  className?: string;
};

export function ThemeToggle({ floating = true, className }: ThemeToggleProps) {
  const { setTheme } = useTheme();

  const handleToggle = () => {
    const isDark = document.documentElement.classList.contains("dark");
    setTheme(isDark ? "light" : "dark");
  };

  return (
    <button
      type="button"
      aria-label="Toggle theme"
      onClick={handleToggle}
      className={cn(
        "h-10 w-10 cursor-pointer border-slate-200/80 rounded-full bg-white/35 text-slate-700 shadow-sm shadow-slate-900/10 backdrop-blur-md transition-all duration-200 grid place-items-center hover:shadow-slate-900/15 dark:border-slate-700/70 dark:bg-slate-950/35 dark:text-slate-100 dark:shadow-black/30",
        floating
          ? "fixed right-4 top-4 z-50 rounded-full opacity-40 hover:opacity-100 focus-visible:opacity-100"
          : "rounded-full! opacity-100",
        className
      )}
    >
      <SunMedium className="size-4 rotate-0 scale-100 transition-all duration-200 dark:-rotate-90 dark:scale-0" />
      <MoonStar className="absolute size-4 rotate-90 scale-0 transition-all duration-200 dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </button>
  );
}
