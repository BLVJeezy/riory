import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider } from "@/hooks/useAuth";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/i18n/LanguageProvider";
import { captureAttribution, getAttribution } from "@/lib/attribution";

import Index from "./pages/Index.tsx";
import Diensten from "./pages/Diensten.tsx";
import DienstDetail from "./pages/DienstDetail.tsx";
import ReferentieDetail from "./pages/ReferentieDetail.tsx";
import DataProtection from "./pages/DataProtection.tsx";
import PrivacyPolicy from "./pages/PrivacyPolicy.tsx";
import Gebruiksvoorwaarden from "./pages/Gebruiksvoorwaarden.tsx";
import AlgemeneVoorwaarden from "./pages/AlgemeneVoorwaarden.tsx";
import CookiePolicy from "./pages/CookiePolicy.tsx";
import AdminLogin from "./pages/AdminLogin.tsx";
import Admin from "./pages/Admin.tsx";
import Unsubscribe from "./pages/Unsubscribe.tsx";
import Afspraak from "./pages/Afspraak.tsx";
import Prijscalculator from "./pages/Prijscalculator.tsx";
import LocatieDetail from "./pages/LocatieDetail.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

const ScrollToTop = () => {
  const { pathname, search } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
    if (typeof window.gtag === "function") {
      window.gtag("config", "G-E54E9FCFZQ", {
        page_path: pathname + search,
      });
    }
  }, [pathname, search]);
  return null;
};

// Routes are defined relatively so they can be mounted under "/", "/en/*", "/fr/*"
const AppRoutes = () => (
  <Routes>
    <Route index element={<Index />} />
    <Route path="diensten" element={<Diensten />} />
    <Route path="diensten/:slug" element={<DienstDetail />} />
    <Route path="referenties/:slug" element={<ReferentieDetail />} />
    <Route path="data-protection" element={<DataProtection />} />
    <Route path="privacy-policy" element={<PrivacyPolicy />} />
    <Route path="gebruiksvoorwaarden" element={<Gebruiksvoorwaarden />} />
    <Route path="algemene-voorwaarden" element={<AlgemeneVoorwaarden />} />
    <Route path="cookie-policy" element={<CookiePolicy />} />
    <Route path="admin/login" element={<AdminLogin />} />
    <Route path="admin" element={<Admin />} />
    <Route path="afspraak" element={<Afspraak />} />
    <Route path="prijscalculator" element={<Prijscalculator />} />
    <Route path="regio/:slug" element={<LocatieDetail />} />
    <Route path="unsubscribe" element={<Unsubscribe />} />
    <Route path="*" element={<NotFound />} />
  </Routes>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <LanguageProvider>
          <AuthProvider>
            <ScrollToTop />
            <Routes>
              <Route path="/en/*" element={<AppRoutes />} />
              <Route path="/fr/*" element={<AppRoutes />} />
              <Route path="/*" element={<AppRoutes />} />
            </Routes>
            
          </AuthProvider>
        </LanguageProvider>
      </BrowserRouter>
    </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
