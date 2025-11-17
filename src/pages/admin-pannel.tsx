import React, { useState } from 'react'
import Header from '../components/Header'
import CreateUser from '../components/CreateUser'
import AddCity from '../components/AddCity'
import AddBranch from '../components/AddBranch'
import AdminPanelButton  from '../components/AdminPannelButton'
import {useNavigate} from 'react-router-dom'
const AdminPannel = () => {
  const [isBranchAdd,setIsBranchAdd] = useState(false)
  const [isCityAdd,setIsCityAdd] = useState(false)
  const [isUserAdd, setIsUserAdd] = useState(false)
  // console.log(actionType && true)
  const navigate = useNavigate() 

   const handleUserActions = () => {
    setIsBranchAdd(false);
    setIsCityAdd(false);
    setIsUserAdd(false);
    navigate('/admin-pannel-action', { state: { actionType: 'userAction' } });
  };
   const handleBranchActions = () => {
    setIsBranchAdd(false);
    setIsCityAdd(false);
    setIsUserAdd(false);
    navigate('/admin-pannel-action', { state: { actionType: 'branchAction' } });
  };

  const handleCityActions = () => {
    setIsBranchAdd(false);
    setIsCityAdd(false);
    setIsUserAdd(false);
    navigate('/admin-pannel-action', { state: { actionType: 'cityAction' } });
  };
  return (
    <div className='flex flex-col h-screen'>
          
    <Header/>
    <div className="flex justify-center items-center  bg-gray-300 h-full">
          <div className=" p-8 rounded-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        {isBranchAdd ? "Add Branch" : isCityAdd ? "Add City" : "Admin Pannel"}
      </h2>
    
      {/* --- FORMS --- */}
          {isBranchAdd &&
            <>
              {/* ✅ Back Button */}
      <div className="px-4 mb-4">
        <button
          onClick={() =>{
            setIsUserAdd(false);
            setIsBranchAdd(false);
            setIsCityAdd(false);
          }}
          className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 cursor-pointer"
        >
          ← Back
        </button>
      </div>
            < AddBranch />
      </>
            }
      
          {isCityAdd &&
            <>
              <div className="px-4 mb-4">
        <button
          onClick={() =>{
            setIsUserAdd(false);
            setIsBranchAdd(false);
            setIsCityAdd(false);
          }}
          className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 cursor-pointer"
        >
          ← Back
        </button>
      </div>
              <AddCity />
            
            </>
          }
          {isUserAdd &&
            <>
            <div className="px-4 mb-4">
        <button
          onClick={() =>{
            setIsUserAdd(false);
            setIsBranchAdd(false);
            setIsCityAdd(false);
          }}
          className="mt-20 bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 cursor-pointer"
        >
          ← Back
        </button>
      </div>
            <CreateUser />
                
            </>
          }
          {
  isBranchAdd ? (
    <>
      <div className="flex gap-4">
        <AdminPanelButton
          disabled={isCityAdd}
          onClick={() => {
            setIsUserAdd(false);
            setIsBranchAdd(false);
            setIsCityAdd(true);
          }}
          label={"Add City"}
        />
        <AdminPanelButton
  onClick={handleCityActions}
  label={"City Actions"}
/>

      </div>
      <div className="flex gap-4 mt-4">
        <AdminPanelButton
          disabled={isUserAdd}
          onClick={() => {
            setIsBranchAdd(false);
            setIsCityAdd(false);
            setIsUserAdd(true);
          }}
          label={"Add User"}
        />
        <AdminPanelButton
  onClick={handleUserActions}
  label={"User Actions"}
/>
          
      </div>
    </>
  ) : isCityAdd ? (
    <>
      <div className="flex gap-4">
        <AdminPanelButton
          disabled={isBranchAdd}
          onClick={() => {
            setIsCityAdd(false);
            setIsUserAdd(false);
            setIsBranchAdd(true);
          }}
          label={"Add Branch"}
        />
        <AdminPanelButton
          onClick={handleBranchActions}
          label={"Branch Actions"}
        />
      </div>
      <div className="flex gap-4 mt-4">
        <AdminPanelButton
          disabled={isUserAdd}
          onClick={() => {
            setIsBranchAdd(false);
            setIsCityAdd(false);
            setIsUserAdd(true);
          }}
          label={"Add User"}
        />
        <AdminPanelButton
  onClick={handleUserActions}
  label={"User Actions"}
/>
        
      </div>
    </>
  ) : isUserAdd ? (
    <>
      <div className="flex gap-4">
        <AdminPanelButton
          disabled={isBranchAdd}
          onClick={() => {
            setIsCityAdd(false);
            setIsUserAdd(false);
            setIsBranchAdd(true);
          }}
          label={"Add Branch"}
        />
        <AdminPanelButton
          onClick={handleBranchActions}
          label={"Branch Actions"}
        />
      </div>
      <div className="flex gap-4 mt-4">
        <AdminPanelButton
          disabled={isCityAdd}
          onClick={() => {
            setIsCityAdd(true);
            setIsUserAdd(false);
            setIsBranchAdd(false);
          }}
          label={"Add City"}
        />
        <AdminPanelButton
  onClick={handleCityActions}
  label={"City Actions"}
/>

      </div>
    </>
  ) : (
    <>
      <div className="flex gap-4">
        <AdminPanelButton
          disabled={isBranchAdd}
          onClick={() => {
            setIsCityAdd(false);
            setIsUserAdd(false);
            setIsBranchAdd(true);
          }}
          label={"Add Branch"}
        />
        <AdminPanelButton
          onClick={handleBranchActions}
          label={"Branch Actions"}
        />
      </div>
      <div className="flex gap-4 mt-4">
        <AdminPanelButton
          disabled={isCityAdd}
          onClick={() => {
            setIsUserAdd(false);
            setIsBranchAdd(false);
            setIsCityAdd(true);
          }}
          label={"Add City"}
        />
        <AdminPanelButton
  onClick={handleCityActions}
  label={"City Actions"}
/>

      </div>
      <div className="flex items-center justify-center gap-4 mt-4">
        <AdminPanelButton
          disabled={isUserAdd}
          onClick={() => {
            setIsBranchAdd(false);
            setIsCityAdd(false);
            setIsUserAdd(true);
          }}
          label={"Add User"}
        />
        <AdminPanelButton
  onClick={handleUserActions}
  label={"User Actions"}
/>
        
      </div>
    </>
  )
}

      
     
    </div>
      </div>

    </div>
    
  )
}

export default AdminPannel
