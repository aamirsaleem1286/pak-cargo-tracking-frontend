import axios from 'axios';
import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import { AppRoutes } from '../constants/AppRoutes';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const ContainerBulkStatus = () => {
  const steps = [
  'Shipment In Container',
  'Shipment at Sending Port',
  'Shipment In Transit',
  'Shipment Arrived At Port',
  'Shipment Under Clearance',
  'Shipmen Arrived At Godown',
  'Out For Delivery',
  'Delivered'
  ];
const [statusMap, setStatusMap] = useState({}); // key: containerId, value: selected status

  const [containerList, setContainerList] = useState([]);
    const [containerLoading, setcontainerLoading] = useState(false);
    const navigate = useNavigate()
    useEffect(() => {
       
        getContainerList();
    }, []);
   const getContainerList = async () => {
            try {
              setcontainerLoading(true)
              const response = await axios.get(AppRoutes.allContainersList);
                setContainerList(response?.data?.data?.containersList || []);
              } catch (error) {
                console.log(error);
                // Error message dikhana behtar hoga
              }finally{
                setcontainerLoading(false)

              }
        };

   const handleBulkUpdate = async () => {
  const containersToUpdate = Object.entries(statusMap).map(([id, status]) => ({
    id,
    status
  }));

  console.log(containersToUpdate);
  
  if (containersToUpdate.length === 0) {
    toast.error("No containers selected.");
    return;
  }
  try {
    const response = await axios.post(AppRoutes.updateBulkContainerStatus, {
      containers: containersToUpdate
    });

    if (response.data?.data?.results) {
  toast.success("Statuses updated successfully");
  setStatusMap({}); // optional: clear the selected statuses
  getContainerList(); // fetch updated list
}

  } catch (error) {
     console.log(error);
        const err = error?.response?.data?.errors;
        if (err?.email) setEmailErr(err.email);
        if (err?.general) toast.error(err.general);
        if (!err) toast.error('Failed to update statuses');
  }
};

    return (
        <div className="bg-gray-50 min-h-screen">
            <Header />
            {
              containerLoading ? ( <div className="flex items-center justify-center h-screen bg-gray-50 text-purple-600 text-xl">
        Loading...
          </div>) : (
              <>
                  <h1 className="text-center text-2xl font-bold text-blue-800 px-4 pt-6 pb-2">
    All Container Bulk Status
  </h1>
            <div className="p-4">
              <div className="px-4 mb-4 flex justify-end">
        <button
  onClick={handleBulkUpdate}
  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-400 cursor-pointer"
>
  Update Status
</button>

      </div>
                <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                <table className="w-full text-sm text-left text-gray-700 bg-white">
  <thead className="text-xl uppercase bg-gray-200 text-gray-800">
    <tr className="border-b border-gray-300">
      <th className="px-6 py-3 text-center whitespace-nowrap">S.No</th>
      <th className="px-6 py-3 text-center whitespace-nowrap">Container No</th>
      {/* <th className="px-6 py-3 text-center whitespace-nowrap">Destination</th> */}
      {/* <th className="px-6 py-3 text-center whitespace-nowrap">Invoices</th> */}
      {/* <th className="px-6 py-3 text-center whitespace-nowrap">Shipped</th> */}
      <th className="px-6 py-3 text-center whitespace-nowrap">Status</th>
      <th className="px-6 py-3 text-center whitespace-nowrap">Actions</th>
    </tr>
  </thead>
  <tbody>
    {containerList.length > 0 ? (
      containerList.map((container, index) => {
        // --- Invoices parsing ---
        const invoiceNumbers = [];
        let totalShipped = 0;

          
        return (
          <tr key={container._id || index} className="bg-white border-b hover:bg-gray-50">
            <td className="px-6 py-4 text-center">{index + 1}</td>
            <td className="px-6 py-4 text-center">{container.ContainerNumber || '-'}</td>
            {/* <td className="px-6 py-4 text-center">{Destination}</td> */}
            {/* <td className="px-6 py-4 text-center">{invoiceNumbers.join(', ') || '-'}</td> */}
            {/* <td className="px-6 py-4 text-center">{totalShipped}</td> */}
            <td className="px-6 py-4 text-center">{container.Status || '-'}</td>
           <td className="px-6 py-4 text-center">
  <div className="flex justify-center">
    <select
 className="border p-2 text-center"
 value={statusMap[container._id] || container.Status || ''}
 onChange={(e) => {
  const value = e.target.value;
  setStatusMap((prev) => ({ ...prev, [container._id]: value }));
 }}
  >
 <option value="">Select Status</option>
 {steps.map((step, index) => {
  const currentIndex = steps.indexOf(container.Status);
  // 🛑 FIX: Yahan 'index < currentIndex' ki jagah 'index <= currentIndex' use hoga
  const isDisabled = index <= currentIndex; 

  return (
   <option
  className={`${isDisabled ? 'cursor-not-allowed':'cursor-pointer'} `}
 key={index}
 value={step}
 disabled={isDisabled} // <-- Yahi disabled={true} ho jayega current status ke liye
 style={{
  color: isDisabled ? '#9ca3af' : '#111827',
  backgroundColor: isDisabled ? '#f3f4f0' : 'white',
  fontStyle: isDisabled ? 'italic' : 'normal',
  cursor: isDisabled ? 'not-allowed' : 'pointer',
 }}
 title={isDisabled ? 'Already passed or current status. Cannot select again.' : ''}
>
 {isDisabled ? `⛔ ${step}` : step}
 
</option>
        );
      })}
    </select>
  </div>
</td>

          </tr>
        );
      })
    ) : (
      <tr>
        <td colSpan={7} className="text-center py-8 text-red-600 font-semibold text-lg">
          No Containers Data Found
        </td>
      </tr>
    )}
  </tbody>
</table>

                </div>
            </div>
              </>
      )
            }
          
        </div>
    );
};

export default ContainerBulkStatus;
