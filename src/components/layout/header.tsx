"use client";

import { useTheme } from "next-themes";
import { Moon, Sun, LogOut } from "lucide-react";
import type { SessionUser } from "@/types";

interface HeaderProps {
  title: string;
  user: SessionUser;
}

export function Header({ title, user }: HeaderProps) {
  const { setTheme, theme } = useTheme();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/login";
  }

  return (
    <header className="flex items-center justify-end px-4 h-14 gap-2">
      {/* Theme toggle — perfect circle */}
      <button
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className="flex items-center justify-center h-9 w-9 rounded-full bg-card shadow-sm hover:shadow-md transition-shadow"
      >
        <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        <span className="sr-only">Toggle theme</span>
      </button>

      {/* Logout — perfect circle */}
      <button
        onClick={handleLogout}
        title="Logout"
        className="flex items-center justify-center h-9 w-9 rounded-full bg-card shadow-sm hover:shadow-md transition-shadow text-muted-foreground hover:text-foreground"
      >
        <LogOut className="h-4 w-4" />
      </button>

      {/* Profile pill — name left, avatar right */}
      <div className="flex items-center gap-2 bg-card rounded-full pl-3 pr-1.5 py-1.5 shadow-sm">
        <div className="hidden sm:flex flex-col items-end min-w-0">
          <p className="text-sm font-medium truncate max-w-[100px] leading-tight">{user.name}</p>
          <p className="text-[11px] text-muted-foreground leading-tight">{user.role}</p>
        </div>
        <div className="h-7 w-7 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-xs font-bold text-orange-600 dark:text-orange-400 shrink-0">
          {user.name.charAt(0).toUpperCase()}
        </div>
      </div>
    </header>
  );
}
