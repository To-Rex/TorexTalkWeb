import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AppDashboard from "./pages/AppDashboard";
import AdminPanel from "./pages/AdminPanel";
import AutoReplies from "./pages/AutoReplies";
import SettingsPage from "./pages/SettingsPage";
import MainLayout from "./layouts/MainLayout";
import { I18nProvider } from "./i18n";
import { AuthProvider } from "@/auth";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { RequireAuth, RequireAdmin } from "@/components/ProtectedRoute";
import Features from "./pages/Features";
import Pricing from "./pages/Pricing";
import Privacy from "./pages/Privacy";
import Security from "./pages/Security";
import Help from "./pages/Help";
import Partners from "./pages/Partners";
import Contact from "./pages/Contact";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <I18nProvider>
        <AuthProvider>
          <BrowserRouter>
            <MainLayout>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/features" element={<Features />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route
                  path="/app"
                  element={
                    <RequireAuth>
                      <AppDashboard />
                    </RequireAuth>
                  }
                />
                <Route
                  path="/auto-replies"
                  element={
                    <RequireAuth>
                      <AutoReplies />
                    </RequireAuth>
                  }
                />
                <Route
                  path="/settings"
                  element={
                    <RequireAuth>
                      <SettingsPage />
                    </RequireAuth>
                  }
                />
                <Route
                  path="/admin"
                  element={
                    <RequireAdmin>
                      <AdminPanel />
                    </RequireAdmin>
                  }
                />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/security" element={<Security />} />
                <Route path="/help" element={<Help />} />
                <Route path="/partners" element={<Partners />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </MainLayout>
          </BrowserRouter>
        </AuthProvider>
      </I18nProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
