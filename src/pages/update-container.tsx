import React, { useEffect, useState } from 'react'
import Header from '../components/Header'
import ContainerStatusUpdate from '@/components/UpdateContainer'
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { AppRoutes } from '../constants/AppRoutes';

const UpdateContainer = () => {
    const { id } = useParams(); // 👈 Gets the :id from URL
    const navigate = useNavigate(); // 👈 Gets the :id from URL
    // console.log(id);
    const [container,setContainer] = useState(null); 
    const [loadingContainer,setloadingContainer] = useState(false); 
    const [loadingSaveContainer,setloadingSaveContainer] = useState(false); 
    
    const handleSave = async(update) => {
        console.log(update);
        try {
            setloadingSaveContainer(true)
            const response = await axios.post(`${AppRoutes.updateSingleContainer}/${id}`,{Status:update})
              const data = response.data;
              console.log(data);
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
              const response = await axios.get(`${AppRoutes.getSingleContainer}/${id}`)
                const data = response.data;
                console.log(data);
                
            setContainer(data?.data.foundContainer)
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
  return (
    <div>
      <Header/>
          <ContainerStatusUpdate container={container}  onSave={handleSave} loadingSave={loadingSaveContainer}/>
    </div>
  )
}

export default UpdateContainer
