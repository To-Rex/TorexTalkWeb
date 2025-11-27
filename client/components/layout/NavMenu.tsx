import { useAuth } from "@/auth";
import { Link, useLocation } from "react-router-dom";
import { useSidebar } from "@/contexts/SidebarContext";
import { ChevronLeft, ChevronRight, MessagesSquare, Settings } from "lucide-react";

export default function NavMenu({ variant = "desktop" }: { variant?: "desktop" | "overlay" }) {
  const location = useLocation();
  const { user, switchAccount } = useAuth();
  const { collapsed, setCollapsed } = useSidebar();
  const isOverlay = variant === "overlay";
  const asideHeight = "h-full";

  const asideWidth = isOverlay ? "w-full" : collapsed ? "w-16" : "w-64 sm:w-72";
  const itemLayout = isOverlay ? "gap-3" : collapsed ? "justify-center gap-0" : "gap-3";
  const showText = isOverlay ? true : !collapsed;

  return (
    <aside className={`${collapsed ? "w-20" : asideWidth} ${asideHeight} bg-sidebar px-4 py-3 border-r flex flex-col overflow-hidden relative transition-all duration-200`}>
      {!isOverlay ? (
        <div className={`flex ${collapsed ? 'justify-center' : 'justify-between'} items-center`}>
          {!collapsed && (
            <div className="text-sm font-medium px-3">
              Navigation
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={`inline-flex items-center justify-center rounded-md ${collapsed ? 'p-3' : 'p-2'} text-sm hover:bg-background`}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            title={collapsed ? "Kengaytirish" : "Qisqartirish"}
          >
            {collapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>
      ) : null}

      <nav className="flex flex-col gap-2 overflow-y-auto pb-20 mt-4">
        <Link
          to="/app"
          className={`flex items-center ${itemLayout} px-3 py-2 rounded-md ${
            location.pathname.startsWith("/app")
              ? "bg-primary text-white"
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
              ? "bg-primary text-white"
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
              ? "bg-primary text-white"
              : "hover:bg-accent/40"
          }`}
        >
          <Settings className="h-5 w-5" />
          {showText ? <span>Settings</span> : null}
        </Link>
      </nav>

      <div className="absolute bottom-0 left-0 right-0 pt-2 pb-3 border-t">
        <div className={`px-3 ${collapsed ? 'flex justify-center' : ''}`}>
          {user ? (
            <div className={`flex items-center ${collapsed ? 'justify-center' : 'gap-3'}`}>
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt="Avatar"
                  className="h-8 w-8 rounded-full object-cover"
                />
              ) : (
                <div className="h-8 w-8 rounded-full bg-primary text-white grid place-items-center font-semibold text-xs">
                  {(user.name || user.email.split('@')[0]).charAt(0).toUpperCase()}
                </div>
              )}
              {!collapsed && (
                <div className="flex items-center w-full">
                  <div>
                    <div className="text-sm font-medium text-foreground">
                      {user.name || user.email.split('@')[0]}
                    </div>
                    <div className="text-xs text-muted-foreground">{user.settings?.plan ?? "Free"}</div>
                  </div>
                  <div className="flex-1"></div>
                  {(user.settings?.plan ?? "Free") === "Free" && (
                    <Link to="/pricing" className="text-xs px-2 py-1 bg-primary text-white rounded hover:bg-primary/90">
                      Upgrade
                    </Link>
                  )}
                </div>
              )}
            </div>
          ) : (
            !collapsed && <div className="text-sm text-foreground">Not logged in</div>
          )}
        </div>
      </div>
    </aside>
  );
}
