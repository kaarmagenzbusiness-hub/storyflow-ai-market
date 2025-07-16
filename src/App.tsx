import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import NewBook from "./pages/NewBook";
import ChapterEditor from "./pages/ChapterEditor";
import BookDesign from "./pages/BookDesign";
import BookPreview from "./pages/BookPreview";
import MarketplaceListing from "./pages/MarketplaceListing";
import Marketplace from "./pages/Marketplace";
import BookDetail from "./pages/BookDetail";
import PurchaseComplete from "./pages/PurchaseComplete";
import AuthorDashboard from "./pages/AuthorDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/new-book" element={<NewBook />} />
          <Route path="/chapter-editor/:bookId?" element={<ChapterEditor />} />
          <Route path="/book-design" element={<BookDesign />} />
          <Route path="/book-preview/:bookId?" element={<BookPreview />} />
          <Route path="/marketplace-listing" element={<MarketplaceListing />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/book/:bookId" element={<BookDetail />} />
          <Route path="/purchase-complete" element={<PurchaseComplete />} />
          <Route path="/author-dashboard" element={<AuthorDashboard />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
