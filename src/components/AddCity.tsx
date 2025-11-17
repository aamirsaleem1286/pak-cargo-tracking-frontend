import axios from 'axios'
import React, { useState } from 'react'
import { AppRoutes } from '../constants/AppRoutes'
import { toast } from 'react-toastify'

const AddCity = () => {
    const [city,setCity] = useState('')
    const [cityErr,setCityErr] = useState('')
    const [loading,setLoading] = useState(false)
    const handleSubmit = async () => {
        console.log(city);
        
        try {
            setLoading(true)
            setCityErr('')
            if (!city.trim()) {
                setCityErr('City are required!');
                return;
                
            }
            const response = await axios.post(AppRoutes.addCity,{city})
            const data = response.data;
            toast.success(data?.data?.message);
            //   navigate('/services')
            
            
        } catch (error) {
            const err = error?.response?.data?.errors;
            if (err?.city) setCityErr(err.city);
            if (err?.general) toast.error(err.general);
            if (!err) toast.error('Something went wrong');
            
        } finally {
            setLoading(false)
            
        }
    }
    return (
    <div className="flex flex-col items-center gap-4 ">
    
    <input
      type="text"
      value={city}
      onChange={(e) => setCity(e.target.value)}
      className="flex-1 px-4 py-3  w-full bg-gray-200"
      placeholder="Add City"
    />
    {cityErr && <p className='text-red-600 text-sm'>{cityErr}</p>}
            <button disabled={loading} onClick={handleSubmit}  className="hover:cursor-pointer bg-green-600 text-white px-4 py-3 font-medium text-lg w-32 ">
            {loading ? (
  <div className="flex justify-center">
    <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  </div>
) : (
  'Add City'
)}
    </button>
  </div>
  )
}

export default AddCity
