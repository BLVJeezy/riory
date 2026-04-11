import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider } from "@/hooks/useAuth";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import Diensten from "./pages/Diensten.tsx";
import DienstDetail from "./pages/DienstDetail.tsx";
import ReferentieDetail from "./pages/ReferentieDetail.tsx";
import DataProtection from "./pages/DataProtection.tsx";
import PrivacyPolicy from "./pages/PrivacyPolicy.tsx";
import Gebruiksvoorwaarden from "./pages/Gebruiksvoorwaarden.tsx";
import AlgemeneVoorwaarden from "./pages/AlgemeneVoorwaarden.tsx";
import AdminLogin from "./pages/AdminLogin.tsx";
import Admin from "./pages/Admin.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/diensten" element={<Diensten />} />
            <Route path="/diensten/:slug" element={<DienstDetail />} />
            <Route path="/diensten/ontstoppingen-en-geurdetectie" element={<Navigate to="/diensten/ontstoppingen" replace />} />
            <Route path="/referenties/:slug" element={<ReferentieDetail />} />
            <Route path="/data-protection" element={<DataProtection />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/gebruiksvoorwaarden" element={<Gebruiksvoorwaarden />} />
            <Route path="/algemene-voorwaarden" element={<AlgemeneVoorwaarden />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<Admin />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
