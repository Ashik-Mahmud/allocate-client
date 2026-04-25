"use client";

import { MoonStar, SunMedium } from "lucide-react";
import { useSyncExternalStore } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ThemeMode = "light" | "dark";

const THEME_STORAGE_KEY = "allocate.theme";
const THEME_CHANGE_EVENT = "allocate-theme-change";

function applyTheme(theme: ThemeMode) {
  const root = document.documentElement;
  root.classList.toggle("dark", theme === "dark");
  root.style.colorScheme = theme;
}

function getThemeSnapshot(): ThemeMode {
  if (typeof window === "undefined") {
    return "light";
  }

  const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);

  if (storedTheme === "light" || storedTheme === "dark") {
    return storedTheme;
  }

  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

function subscribeToThemeChanges(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener(THEME_CHANGE_EVENT, onStoreChange as EventListener);

  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(THEME_CHANGE_EVENT, onStoreChange as EventListener);
  };
}

type ThemeToggleProps = {
  floating?: boolean;
  className?: string;
};

export function ThemeToggle({ floating = true, className }: ThemeToggleProps) {
  const theme = useSyncExternalStore(
    subscribeToThemeChanges,
    getThemeSnapshot,
    () => "light"
  );

  const handleToggle = () => {
    const nextTheme: ThemeMode = theme === "dark" ? "light" : "dark";

    window.localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
    applyTheme(nextTheme);
    window.dispatchEvent(new Event(THEME_CHANGE_EVENT));
  };

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      aria-pressed={isDark}
      onClick={handleToggle}
      className={cn(
        "h-10 w-10 border-slate-200/80 rounded-full bg-white/35 text-slate-700 shadow-sm shadow-slate-900/10 backdrop-blur-md transition-all duration-200 grid place-items-center hover:shadow-slate-900/15 dark:border-slate-700/70 dark:bg-slate-950/35 dark:text-slate-100 dark:shadow-black/30",
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
