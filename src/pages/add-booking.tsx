import React, { useEffect, useState } from 'react'
import Header from '@/components/Header'
import InvoiceForm from '@/components/InvoiceForm'
import { toast } from 'react-toastify';
import axios from 'axios';
import { AppRoutes } from '@/constants/AppRoutes';
import {useAuth} from '@/context/AuthContext'
const AddBooking = () => {
  const [branchList, setBranchList] = useState([]);
    const [cityList, setCityList] = useState([]);
    const [loadingList, setLoadingList] = useState(false);
  const {loading} = useAuth()  
  useEffect(() => {
      const fetchData = async () => {
        try {
          loading == false && setLoadingList(true) 
          
          const [branchRes, cityRes] = await Promise.all([
                    axios.get<{ data: { allBranches } }>(AppRoutes.allBranch),
                    axios.get<{ data: { allCities } }>(AppRoutes.allCity),
                ]);
          const allBranches = branchRes.data?.data?.allBranches || [];
          const allCities = cityRes.data?.data?.allCities || [];
          
          setBranchList(allBranches);
          setCityList(allCities);
          
        } catch (error) {
          // console.log(error)
          console.error(error); // Use console.error for consistency
                const err = (error as any).response?.data?.errors; // Cast to 'any' for Axios error structure
                if (err?.general) toast.error(err.general);
                if (!err) toast.error('Something went wrong');
        } finally {
          loading == false && setLoadingList(false)
          
        }
      }  
      fetchData()
    },[])
  
  return (
     
    <div>
          <Header />
          <InvoiceForm cityList={cityList} branchList={branchList} loadingList={loadingList}/>
    </div>
  )
}

export default AddBooking
