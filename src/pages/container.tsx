import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { AppRoutes } from '../constants/AppRoutes';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import AddContainerNumber from "../components/AddContainerNumber";
import AddContainer from '../components/AddContainer'
import Header from '../components/Header';
const ContainerBooking = () => {
  const [cities,SetCities] = useState([])
  const [invoices, SetInvoices] = useState([])
  const [containerList, setContainerList] = useState([])
  const [containerBookedList, setContainerBookedList] = useState([])
 
  const [loadingList, setLoadingList] = useState(false);
  const {loading} = useAuth()
  
   // ✅ This function can be called after adding a new container
   const refreshContainerList = async () => {
    try {
      const response = await axios.get(AppRoutes.allContainerNoList);
      const updatedContainers = response.data?.data?.containerNumberRecord || [];
      setContainerList(updatedContainers);
    } catch (error) {
      toast.error('Failed to refresh container list');
    }
  };
   
  // ✅ This function can be called after adding a new container
   const refreshBookedContainer = async () => {
    try {
      const response = await axios.get(AppRoutes.allContainersList);
      const updatedBookContainers = response.data?.data?.containersList || [];
      setContainerBookedList(updatedBookContainers);
    } catch (error) {
      toast.error('Failed to refresh Booked container list');
    }
  };
   const refreshInvoices = async () => {
    try {
      const response = await axios.get(AppRoutes.allBookingInvoiceNo);
      const updatedInvoices = response.data?.data?.bookingInvoices || [];
      SetInvoices(updatedInvoices);
    } catch (error) {
      toast.error('Failed to refresh Booked container list');
    }
  };


  useEffect(() => {
    const fetchCities = async () => {
      try {
        setLoadingList(true) 
          
        const [cityRes, invoiceRes,containerRes,bookedContainerRes] = await Promise.all([
          axios.get(AppRoutes.allCity),
          axios.get(AppRoutes.allBookingInvoiceNo),
          axios.get(AppRoutes.allContainerNoList),
          axios.get(AppRoutes.allContainersList),
        ]) 
        console.log("Cities:", cityRes);
        console.log("Invoices:", invoiceRes);
        console.log("Containers:", containerRes);
        console.log("Containers:", bookedContainerRes);

          const allCities = cityRes.data?.data?.allCities || [];
        const allInvoices = invoiceRes.data?.data?.bookingInvoices || [];
        const allContainers = containerRes.data?.data?.containerNumberRecord || [];
        const allbookedContainers = bookedContainerRes.data?.data?.containersList || [];
        SetCities(allCities);
        SetInvoices(allInvoices);
        setContainerList(allContainers)
        setContainerBookedList(allbookedContainers)
          
      } catch (error) {
        const err = error?.response?.data?.errors;
            if (err?.general) toast.error(err.general);
            if (!err) toast.error('Something went wrong');
      }finally {
        setLoadingList(false)
        
      }
    }
    fetchCities()
  },[]) 

  return (
    <div>
      <Header />
      {
        loadingList ? (<div className="flex items-center justify-center h-screen bg-gray-50 text-blue-600 text-3xl text-bold">
          Loading...
        </div>) :
          (
            <div className="min-h-screen bg-gradient-to-b from-white to-gray-100 py-6 px-4">
            <div className="max-w-7xl mx-auto bg-white shadow-2xl rounded-2xl p-6 space-y-6">
              
                <AddContainerNumber isEdit={false} cities={cities} onContainerAdded={refreshContainerList}/>
                <AddContainer
                  isEdit={false}
                  containerList={containerList}
                  invoiceList={invoices}
                  bookedContainerList={containerBookedList} refreshBookedContainer={refreshBookedContainer} refreshInvoices={refreshInvoices} refreshContainerNoList={refreshContainerList} />
            </div>
          </div>
        )     
      }
     

    </div>
  );
};

export default ContainerBooking;