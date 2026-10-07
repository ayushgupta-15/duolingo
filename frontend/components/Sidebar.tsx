"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/", label: "Learn", icon: "🏠" },
  { href: "/leaderboard", label: "Leaderboards", icon: "🏆" },
  { href: "/profile", label: "Profile", icon: "🦉" },
  { href: "/settings", label: "Settings", icon: "⚙️" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop sidebar */}
      <nav className="hidden md:flex md:flex-col md:w-60 md:shrink-0 border-r-2 border-[var(--duo-border)] px-3 py-6 gap-1">
        <div className="px-3 mb-6 flex items-center gap-2">
          <span className="text-3xl">🦉</span>
          <span className="text-2xl font-black text-[var(--duo-green)]">lingo</span>
        </div>
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href as any}
              className={`flex items-center gap-3 px-3 py-3 rounded-2xl font-bold text-sm uppercase tracking-wide border-2 ${
                active
                  ? "bg-blue-50 border-[var(--duo-blue)] text-[var(--duo-blue)]"
                  : "border-transparent text-[var(--duo-gray-dark)] hover:bg-[var(--duo-bg-soft)]"
              }`}
            >
              <span className="text-2xl">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 border-t-2 border-[var(--duo-border)] bg-white flex justify-around py-2 z-20">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href as any}
              className={`flex flex-col items-center gap-0.5 px-3 py-1 text-xs font-bold ${
                active ? "text-[var(--duo-blue)]" : "text-[var(--duo-gray)]"
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>
    </>
  );
}
