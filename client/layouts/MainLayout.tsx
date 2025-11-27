import AppHeader from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import NavMenu from "@/components/layout/NavMenu";
import { useAuth } from "@/auth";
import { useSidebar } from "@/contexts/SidebarContext";
import { useLocation } from "react-router-dom";
import { useState } from "react";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();
  const { collapsed: sidebarCollapsed } = useSidebar();
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

  // Hide footer for authenticated users on app-related pages
  const noFooterPaths = ["/app", "/auto-replies", "/settings"];
  const hideFooter = Boolean(user) && noFooterPaths.some((p) => pathname === p || pathname.startsWith(p + "/"));

  return (
    <div className="h-screen">
      <AppHeader
        className="fixed top-0 left-0 right-0 z-50"
        onOpenMobileNav={() => setMobileOpen(true)}
        showMobileNavButton={showSidebar}
      />
      {showSidebar ? (
        <div className="fixed top-14 left-0 h-[calc(100vh-3.5rem)] z-40 hidden md:block">
          <NavMenu />
        </div>
      ) : null}
      <main className={`${showSidebar ? (sidebarCollapsed ? "md:ml-20" : "md:ml-64 lg:ml-72") : ""} pt-16 h-screen overflow-x-hidden overflow-y-auto transition-all duration-200`}>
        {children}
      </main>

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
            <NavMenu variant="overlay" />
          </div>
        </div>
      ) : null}

      {!hideFooter && <Footer />}
    </div>
  );
}
