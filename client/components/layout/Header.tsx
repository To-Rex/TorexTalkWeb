import { Link, useLocation, useNavigate } from "react-router-dom";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/i18n";
import { useAuth } from "@/auth";
import AdminLoginModal from "@/components/AdminLoginModal";
import { useState } from "react";

export default function Header({
  onOpenMobileNav,
  showMobileNavButton,
}: {
  onOpenMobileNav?: () => void;
  showMobileNavButton?: boolean;
}) {
  const { t } = useI18n();
  const { pathname } = useLocation();
  const isHome = pathname === "/";
  const { user, logout } = useAuth();
  const isFeatures = pathname.startsWith("/features");
  const isPricing = pathname.startsWith("/pricing");
  const isLanding = isHome || isFeatures || isPricing;
  const navigate = useNavigate();
  const [adminOpen, setAdminOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-bold">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
            TT
          </span>
          <span>Torex-Talk</span>
        </Link>
        <nav className="flex items-center gap-2">
          {isLanding && (
            <>
              <Link
                to="/features"
                className={`hidden sm:inline-block px-3 py-2 text-sm rounded-md ${isFeatures ? "bg-accent/20 text-accent-foreground" : "hover:bg-accent hover:text-accent-foreground"}`}
              >
                {t("features")}
              </Link>
              <Link
                to="/pricing"
                className={`hidden sm:inline-block px-3 py-2 text-sm rounded-md ${isPricing ? "bg-accent/20 text-accent-foreground" : "hover:bg-accent hover:text-accent-foreground"}`}
              >
                {t("pricing")}
              </Link>
              <LanguageSwitcher mode="menu" />
            </>
          )}

          {user && showMobileNavButton ? (
            <button
              className="md:hidden rounded px-2 py-2 hover:bg-accent/40"
              aria-label="Open menu"
              onClick={onOpenMobileNav}
            >
              <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  d="M3 6h18M3 12h18M3 18h18"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          ) : null}

          {!user ? (
            <>
              <Link to="/login">
                <Button className="ml-2" size="sm">
                  {t("sign_in")}
                </Button>
              </Link>
            </>
          ) : (
            <div className="flex items-center gap-2">
              {user.isAdmin ? (
                <Link to="/admin">
                  <Button size="sm" variant="ghost">
                    {t("admin_panel")}
                  </Button>
                </Link>
              ) : (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setAdminOpen(true)}
                >
                  Admin kirish
                </Button>
              )}
              <div className="text-sm hidden sm:block px-2">{user.email}</div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  logout();
                  navigate("/");
                }}
              >
                Chiqish
              </Button>
            </div>
          )}
        </nav>
      </div>
      <AdminLoginModal open={adminOpen} onClose={() => setAdminOpen(false)} />
    </header>
  );
}
