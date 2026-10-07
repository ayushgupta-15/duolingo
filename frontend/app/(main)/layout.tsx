"use client";

import { UserProvider } from "@/lib/UserContext";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <UserProvider>
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1 flex flex-col pb-16 md:pb-0">
          <TopBar />
          <main className="flex-1 bg-[var(--duo-bg-soft)]">{children}</main>
        </div>
      </div>
    </UserProvider>
  );
}
