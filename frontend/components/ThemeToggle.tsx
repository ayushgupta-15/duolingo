"use client";

import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(document.documentElement.getAttribute("data-theme") === "dark");
  }, []);

  function toggle() {
    const next = isDark ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("theme", next);
    } catch {}
    setIsDark(!isDark);
  }

  return (
    <button
      onClick={toggle}
      role="switch"
      aria-checked={isDark}
      className={`relative w-12 h-7 rounded-full transition-colors shrink-0 ${
        isDark ? "bg-[var(--duo-green)]" : "bg-[var(--duo-border)]"
      }`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-white shadow transition-transform ${
          isDark ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  );
}
