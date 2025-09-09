import AppHeader from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import NavMenu from "@/components/layout/NavMenu";
import { useAuth } from "@/auth";
import { useLocation } from "react-router-dom";
import { useState } from "react";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();
  const { pathname } = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  // Hide sidebar on landing and certain public pages
  const hideSidebarPaths = ["/", "/features", "/pricing", "/admin"];
  const isHidden = hideSidebarPaths.some((p) =>
    p === "/"
      ? pathname === "/"
      : pathname === p || pathname.startsWith(p + "/"),
  );
  const showSidebar = Boolean(user) && !isHidden;

  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader
        onOpenMobileNav={() => setMobileOpen(true)}
        showMobileNavButton={showSidebar}
      />
      <div className="flex-1 flex">
        {showSidebar ? (
          <div className="hidden md:block">
            <NavMenu />
          </div>
        ) : null}
        <main className="flex-1 pt-4 sm:pt-6 overflow-x-hidden">
          {children}
        </main>
      </div>
      <Footer />

      {showSidebar && mobileOpen ? (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 w-72 max-w-[85vw] bg-sidebar border-r shadow-xl">
            <div className="flex items-center justify-between p-3 border-b">
              <div className="font-semibold text-sm">Menyu</div>
              <button
                onClick={() => setMobileOpen(false)}
                className="rounded px-2 py-1 text-sm hover:bg-background"
              >
                Yopish
              </button>
            </div>
            <NavMenu />
          </div>
        </div>
      ) : null}
    </div>
  );
}
