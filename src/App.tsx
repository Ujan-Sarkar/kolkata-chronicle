import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useStore } from "@/state/store";
import { MainLayout } from "@/layouts/MainLayout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Passport from "./pages/Passport";
import Map from "./pages/Map";
import Scrapbook from "./pages/Scrapbook";
import TasteProfile from "./pages/TasteProfile";
import TreatWheel from "./pages/TreatWheel";
import Moodboard from "./pages/Moodboard";
import Goals2025 from "./pages/Goals2025";
import Modes from "./pages/Modes";
import TalesVault from "./pages/TalesVault";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Protected Route wrapper
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useStore();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/" element={<Dashboard />} />
            <Route path="/passport" element={<Passport />} />
            <Route path="/map" element={<Map />} />
            <Route path="/scrapbook" element={<Scrapbook />} />
            <Route path="/taste-profile" element={<TasteProfile />} />
            <Route path="/treat-wheel" element={<TreatWheel />} />
            <Route path="/moodboard" element={<Moodboard />} />
            <Route path="/goals-2025" element={<Goals2025 />} />
            <Route path="/modes" element={<Modes />} />
            <Route path="/tales-vault" element={<TalesVault />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
