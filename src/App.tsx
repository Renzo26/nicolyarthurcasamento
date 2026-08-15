import { ReactLenis } from "lenis/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import AdminGate from "@/components/AdminGate";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import Convite from "./pages/Convite.tsx";

const queryClient = new QueryClient();

const prefersReducedMotion =
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ReactLenis root options={{ duration: 1.2, smoothWheel: !prefersReducedMotion }}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/convite" replace />} />
            <Route path="/convite" element={<Convite />} />
            {/* Painel de cadastro dos convidados: rota não divulgada, protegida por senha (ver AdminGate). */}
            <Route
              path="/painel-nicolyarthur"
              element={
                <AdminGate>
                  <Index />
                </AdminGate>
              }
            />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ReactLenis>
  </QueryClientProvider>
);

export default App;
