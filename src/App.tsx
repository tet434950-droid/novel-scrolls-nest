import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { ReadingModeProvider } from "@/contexts/ReadingModeContext";
import { AdminFab } from "@/components/AdminFab";
import { ProtectedRoute } from "@/components/admin/ProtectedRoute";
import Index from "./pages/Index";
import Chapter from "./pages/Chapter";
import NovelPage from "./pages/NovelPage";
import Obras from "./pages/Obras";
import ObraDetalhes from "./pages/ObraDetalhes";
import CapituloLeitura from "./pages/CapituloLeitura";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import Dashboard from "./pages/admin/Dashboard";
import NovelsManage from "./pages/admin/NovelsManage";
import NovelForm from "./pages/admin/NovelForm";
import ChaptersManage from "./pages/admin/ChaptersManage";
import ChapterEditor from "./pages/admin/ChapterEditor";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ThemeProvider>
        <ReadingModeProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/chapter/:slug" element={<Chapter />} />
              <Route path="/novel/:slug" element={<NovelPage />} />
              <Route path="/obras" element={<Obras />} />
              <Route path="/obras/:slug" element={<ObraDetalhes />} />
              <Route path="/obras/:slug/:chapterSlug" element={<CapituloLeitura />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/admin" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/admin/novels" element={<ProtectedRoute><NovelsManage /></ProtectedRoute>} />
              <Route path="/admin/novels/new" element={<ProtectedRoute><NovelForm /></ProtectedRoute>} />
              <Route path="/admin/novels/:id" element={<ProtectedRoute><NovelForm /></ProtectedRoute>} />
              <Route path="/admin/novels/:novelId/chapters" element={<ProtectedRoute><ChaptersManage /></ProtectedRoute>} />
              <Route path="/admin/novels/:novelId/chapters/new" element={<ProtectedRoute><ChapterEditor /></ProtectedRoute>} />
              <Route path="/admin/novels/:novelId/chapters/:chapterId" element={<ProtectedRoute><ChapterEditor /></ProtectedRoute>} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            <AdminFab />
          </BrowserRouter>
        </ReadingModeProvider>
      </ThemeProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
