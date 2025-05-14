
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import MultiplayerGame from "./pages/MultiplayerGame";
import OnlineGame from "./pages/OnlineGame";
import NotFound from "./pages/NotFound";
import LocalGame from "./pages/LocalGame";
import PlayLocal from "./pages/PlayLocal";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/multiplayer" element={<MultiplayerGame />} />
          <Route path="/game/:gameId" element={<OnlineGame />} />
          <Route path="/local-game" element={<LocalGame />} />
          <Route path="/play-local" element={<PlayLocal />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
