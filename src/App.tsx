
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import Dashboard from "./pages/Dashboard";
import AddRestaurant from "./pages/AddRestaurant";
import MyRestaurants from "./pages/MyRestaurants";
import Orders from "./pages/Orders";
import Transactions from "./pages/Transactions";
import AccountSettings from "./pages/AccountSettings";
import RestaurantMenus from "./pages/RestaurantMenus";
import QRCodePage from "./pages/QRCodePage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <SidebarProvider>
        <BrowserRouter>
          <div className="min-h-screen flex w-full">
            <AppSidebar />
            <main className="flex-1 overflow-auto">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/add-restaurant" element={<AddRestaurant />} />
                <Route path="/my-restaurants" element={<MyRestaurants />} />
                <Route path="/restaurant/:id/menus" element={<RestaurantMenus />} />
                <Route path="/restaurant/:id/qr" element={<QRCodePage />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/transactions" element={<Transactions />} />
                <Route path="/account-settings" element={<AccountSettings />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
          </div>
        </BrowserRouter>
      </SidebarProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
