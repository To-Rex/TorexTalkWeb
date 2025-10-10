import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "@/auth";
import { ChevronLeft, ChevronRight, MessagesSquare, Settings } from "lucide-react";

export default function NavMenu({ variant = "desktop" }: { variant?: "desktop" | "overlay" }) {
  const location = useLocation();
  const { user, switchAccount } = useAuth();
  const [collapsed, setCollapsed] = useState<boolean>(() => {
    try {
      return localStorage.getItem("tt_sidebar_collapsed") === "1";
    } catch {
      return false;
    }
  });
  const isOverlay = variant === "overlay";
  const asideHeight = "h-screen";

  useEffect(() => {
    try {
      localStorage.setItem("tt_sidebar_collapsed", collapsed ? "1" : "0");
    } catch {}
  }, [collapsed]);

  const asideWidth = isOverlay ? "w-full" : collapsed ? "w-16" : "w-64 sm:w-72";
  const itemLayout = isOverlay ? "gap-3" : collapsed ? "justify-center gap-0" : "gap-3";
  const showText = isOverlay ? true : !collapsed;

  return (
    <aside className={`${asideWidth} ${asideHeight} bg-sidebar p-3 border-r flex flex-col gap-4 overflow-hidden`}>
      <div className="flex items-center justify-between">
        <div className={`flex items-center ${itemLayout} flex-1`}>
          <div className="h-9 w-9 rounded-full bg-primary text-primary-foreground grid place-items-center font-bold">
            TT
          </div>
          {showText ? (
            <div>
              <div className="text-sm font-semibold">Torex-Talk</div>
              <div className="text-xs text-muted-foreground">Telegram manager</div>
            </div>
          ) : null}
        </div>
        {!isOverlay ? (
          <button
            onClick={() => setCollapsed((v) => !v)}
            className="ml-2 inline-flex items-center justify-center rounded-md p-2 text-sm hover:bg-background"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            title={collapsed ? "Kengaytirish" : "Qisqartirish"}
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        ) : null}
      </div>

      <nav className="flex flex-col gap-2 flex-1">
        <Link
          to="/app"
          className={`flex items-center ${itemLayout} px-3 py-2 rounded-md ${
            location.pathname.startsWith("/app")
              ? "bg-primary text-primary-foreground"
              : "hover:bg-accent/40"
          }`}
        >
          <MessagesSquare className="h-5 w-5" />
          {showText ? <span>Chats</span> : null}
        </Link>
        <Link
          to="/auto-replies"
          className={`flex items-center ${itemLayout} px-3 py-2 rounded-md ${
            location.pathname.startsWith("/auto-replies")
              ? "bg-primary text-primary-foreground"
              : "hover:bg-accent/40"
          }`}
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none">
            <path
              d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2v10z"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          {showText ? <span>Auto-replies</span> : null}
        </Link>
        <Link
          to="/settings"
          className={`flex items-center ${itemLayout} px-3 py-2 rounded-md ${
            location.pathname.startsWith("/settings")
              ? "bg-primary text-primary-foreground"
              : "hover:bg-accent/40"
          }`}
        >
          <Settings className="h-5 w-5" />
          {showText ? <span>Settings</span> : null}
        </Link>
      </nav>

      <div className="mt-auto pt-2 border-t">
        {showText ? (
          <div className="text-xs text-muted-foreground mb-2">Accounts</div>
        ) : null}
        <div className="flex flex-col gap-2">
          {user?.accounts?.map((a) => (
            <button
              key={a.id}
              onClick={() => switchAccount(a.id)}
              className={`flex items-center ${itemLayout} px-2 py-2 rounded-md hover:bg-accent/30`}
            >
              <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground grid place-items-center font-semibold">
                {a.name.slice(0, 2).toUpperCase()}
              </div>
              {showText ? (
                <div className="text-sm text-foreground">{a.name}</div>
              ) : null}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}
