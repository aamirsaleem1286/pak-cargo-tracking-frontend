import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { useAuth } from "./context/AuthContext";

import ProtectedRoute from '@/components/ProtectedRoute';
import PublicRoute from '@/components/PublicRoute';
import PrivacyPolicy from "@/pages/privacy-policy";
import Terms from "@/pages/terms";
import Login from "@/pages/login";
import Services from "@/pages/services";
import Layout from "@/components/Layout";
import AddBooking from "@/pages/add-booking";
import { ToastContainer } from "react-toastify";
import BookingList from "@/pages/bookingList";
import EditBooking from "@/pages/edit-booking";
import ContainerBooking from "@/pages/container";
import ContainerList from "@/pages/containerList";
import EditContainer from "@/pages/edit-container";
import UpdateContainer from "@/pages/update-container";
import ContainerBulkStatus from "@/pages/container-bulk-status";
import AdminPannel from "@/pages/admin-pannel";
import AdminPannelAction from "@/pages/AdminPannelAction";
import WhatsAppMarketing from "@/pages/whatsapp-marketing";
import Tracking from "./pages/tracking";
import Contact from "./pages/contact";


const queryClient = new QueryClient();

function App()  {
 const { loading } = useAuth()
   if (loading) {
     // console.log(loading);
     
     return (
       <div className="flex items-center justify-center h-screen bg-gray-50 text-purple-600 text-xl">
         Loading...
       </div>
     );
   } 
return  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        
        <Routes>
          {/* 1. HOME/INDEX ROUTE (Public, No Redirect) */}
          <Route path="/" element={<Index />} />
          <Route path="/track" element={<Tracking />} />
          <Route element={<Layout/>}>
            <Route element={<ProtectedRoute/>}>
              <Route path='/add-booking' element={<AddBooking/>}/> 
              <Route path='/edit-booking/edit/:id' element={<EditBooking/>}/> 
              <Route path='/container' element={<ContainerBooking/>}/> 
              <Route path='/all-bookings' element={<BookingList/>}/> 
              <Route path='/all-containers' element={<ContainerList/>}/> 
              <Route path='/all-container-bulk-status' element={<ContainerBulkStatus/>}/> 
              <Route path={'/admin-pannel'} element={<AdminPannel/>}/>        
              <Route path={'/admin-pannel-action'} element={<AdminPannelAction/>}/>        
              <Route path="/update-container/edit/:id" element={<UpdateContainer />} />
              <Route path="/edit-container/edit/:id" element={<EditContainer />} />
              <Route path="/whatsapp-marketing" element={<WhatsAppMarketing />} />
              <Route path='/services' element={<Services/>}/> 
            </Route>
          </Route>
          
          <Route element={<PublicRoute/>}>
            <Route path={'/privacy-policy'} element={<PrivacyPolicy/>}/>        
            <Route path={'/terms-of-services'} element={<Terms/>}/>
            <Route path={'/terms-of-services'} element={<Terms/>}/>
            <Route path={'/login'} element={<Login/>}/>
            <Route path={'/contact'} element={<Contact/>} />
          </Route>
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
          <ToastContainer position='top-center' autoClose={2000} />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
};

export default App;
