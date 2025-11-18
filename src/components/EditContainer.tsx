import React from 'react'
import AddContainerNumber from './AddContainerNumber'
import UpdateContainerForm from './updateContainerForm';

const EditContainer = ({ editData,remainingInvoices,citiesList }) => {
    console.log("remainingInvoices",remainingInvoices);
    if (!editData) return null; 
  return (
          <div className="min-h-screen bg-gradient-to-b from-white to-gray-100 py-6 px-4">
          <div className="max-w-7xl mx-auto bg-white shadow-2xl rounded-2xl p-6 space-y-6">
            <h1 className='text-5xl font-extrabold text-center text-blue-800'>Update Container</h1>
        <AddContainerNumber isEdit={true} editDestination={editData.Destination} editContainerNumber={editData.ContainerNumber} cities={citiesList} />
        <UpdateContainerForm editData={editData} remainingInvoices={ remainingInvoices} />
          </div>
        </div>
  )
}

export default EditContainer
