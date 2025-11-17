import React, { useEffect, useState } from 'react'
import Header from '../components/Header'
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { AppRoutes } from '../constants/AppRoutes';
import EditContainer from '../components/EditContainer'

const EditContainerPage = () => {
    const { id } = useParams(); // 👈 Gets the :id from URL
    const navigate = useNavigate(); // 👈 Gets the :id from URL
    // console.log(id);
    const [container,setContainer] = useState(null); 
    const [loadingContainer,setloadingContainer] = useState(false); 
    const [loadingSaveContainer,setloadingSaveContainer] = useState
    (false); 
    const [remainiginvoices, SetRemainigInvoices] = useState([])
      const [citiesList,SetCitiesList] = useState([])
    const handleSave = async(update) => {
        console.log(update);
        try {
            setloadingSaveContainer(true)
            const response = await axios.post(`${AppRoutes.updateSingleContainer}/${id}`,{Status:update})
              const data = response.data;
          // console.log(data);
          toast.success(data?.data.message)
          navigate('/all-containers')
        } catch (error) {
              const err = error?.response?.data?.errors;
              // if (err?.email) setEmailErr(err.email);
              if (err?.general) toast.error(err.general);
              if (!err) toast.error('Something went wrong');
              
          } finally {
              setloadingSaveContainer(false)
              
          }
    }
    
    // useEffect to fetch container data using ID
    useEffect(() => {
      const fetchContainer = async () => {
        try {
          setloadingContainer(true)
          const [cityRes, response, allRemainigInvoices] = await Promise.all([
            axios.get(AppRoutes.allCity),
            axios.get(`${AppRoutes.getSingleContainer}/${id}`),
            axios.get(AppRoutes.allBookingInvoiceNo),
          ])
          const allCities = cityRes.data?.data?.allCities || [];
          const data = response.data;
          const invoicesRes = allRemainigInvoices.data
          console.log("data",data.data.foundContainer);
          // setContainer(data?.data.foundContainer)
            SetCitiesList(allCities);
            setContainer(data?.data?.foundContainer)
            SetRemainigInvoices(invoicesRes?.data?.bookingInvoices || [])
            } catch (error) {
                const err = error?.response?.data?.errors;
                // if (err?.email) setEmailErr(err.email);
                if (err?.general) toast.error(err.general);
                if (!err) toast.error('Something went wrong');
                
            } finally {
                setloadingContainer(false)
                
            }
        }
        
    fetchContainer()
    }, [id]);
    
    if (loadingContainer) {
      return (
        <div className="flex items-center justify-center h-screen bg-gray-50 text-purple-600 text-xl">
        Loading...
      </div>
    )
  }

  console.log(remainiginvoices);
  return (
    <div>
      <Header/>
      <EditContainer editData={container} remainingInvoices={remainiginvoices} citiesList={citiesList} />
          {/* <ContainerStatusUpdate container={container}  onSave={handleSave} loadingSave={loadingSaveContainer}/> */}
    </div>
  )
}

export default EditContainerPage
