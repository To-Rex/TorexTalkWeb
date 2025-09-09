import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "@/auth";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function NavMenu() {
  const location = useLocation();
  const { user, switchAccount } = useAuth();
  const [collapsed, setCollapsed] = useState<boolean>(() => {
    try {
      return localStorage.getItem("tt_sidebar_collapsed") === "1";
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("tt_sidebar_collapsed", collapsed ? "1" : "0");
    } catch {}
  }, [collapsed]);

  const asideWidth = collapsed ? "w-16" : "w-64 sm:w-72";
  const itemLayout = collapsed ? "justify-center gap-0" : "gap-3";
  const showText = !collapsed;

  return (
    <aside className={`${asideWidth} bg-sidebar p-3 border-r flex flex-col gap-4`}>
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
        <button
          onClick={() => setCollapsed((v) => !v)}
          className="ml-2 inline-flex items-center justify-center rounded-md p-2 text-sm hover:bg-background"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          title={collapsed ? "Kengaytirish" : "Qisqartirish"}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      <nav className="flex flex-col gap-2">
        <Link
          to="/app"
          className={`flex items-center ${itemLayout} px-3 py-2 rounded-md ${
            location.pathname.startsWith("/app")
              ? "bg-primary text-primary-foreground"
              : "hover:bg-accent/40"
          }`}
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none">
            <path
              d="M3 12l7-7 11 11-7 7L3 12z"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
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
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 15.5A3.5 3.5 0 1112 8.5a3.5 3.5 0 010 7z"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09a1.65 1.65 0 00-1-1.51 1.65 1.65 0 00-1.82.33l-.06.06A2 2 0 015.32 16.9l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09a1.65 1.65 0 001.51-1 1.65 1.65 0 00-.33-1.82L4.2 5.32A2 2 0 016.02 2.5l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V1a2 2 0 014 0v.09c.12.63.64 1.12 1.26 1.26H16a1.65 1.65 0 001.82-.33l.06-.06A2 2 0 0119.8 5.32l-.06.06a1.65 1.65 0 00-.33 1.82V9c.63.12 1.12.64 1.26 1.26V11a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09c-.63.12-1.12.64-1.51 1z"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          {showText ? <span>Settings</span> : null}
        </Link>
      </nav>

      <div className="mt-auto">
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
