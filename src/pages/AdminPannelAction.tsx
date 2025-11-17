import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';
import { AppRoutes } from '../constants/AppRoutes';
import { toast } from 'react-toastify';

const AdminPannelAction = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const actionType = location.state?.actionType;

  const [data, setData] = useState([]);
  const [editItem, setEditItem] = useState(null);
  const [formValue, setFormValue] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // For user editing
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [selectedPages, setSelectedPages] = useState([]);
  const [selectedRole, setSelectedRole] = useState('user');

  const [loading, setLoading] = useState(true);

  const allPages = [
    { label: "Home", path: "/" },
    { label: "Create Booking", path: "/add-booking" },
    { label: "Bookings Lists", path: "/all-bookings" },
    { label: "Create Container", path: "/container" },
    { label: "Containers Lists", path: "/all-containers" },
    // { label: "Services", path: "/services" },
  { label: 'Admin Panel', path: '/admin-pannel' },
    // { label: "Whatsapp-Media", path: "/whatsapp-marketing" },
  ];

  useEffect(() => {
    if (actionType === 'branchAction') fetchBranches();
    else if (actionType === 'cityAction') fetchCities();
    else if (actionType === 'userAction') fetchUsers();
      if (editUser) {
    setSelectedRole(editUser.role || "");
    setSelectedPages(editUser.accessPages || []);
  }
  }, [actionType,editUser]);

  // ================== Fetch Functions ==================
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = sessionStorage.getItem('token');
      const response = await axios.get(AppRoutes.allUsers, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setData(response.data?.data?.users || []);
    } catch (error) {
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const fetchBranches = async () => {
    try {
      setLoading(true);
      const res = await axios.get(AppRoutes.allBranch);
      setData(res.data?.data?.allBranches || []);
    } catch (error) {
      toast.error('Failed to fetch branches');
    } finally { setLoading(false); }
  };

  const fetchCities = async () => {
    try {
      setLoading(true);
      const res = await axios.get(AppRoutes.allCity);
      setData(res.data?.data?.allCities || []);
    } catch (error) {
      toast.error('Failed to fetch cities');
    } finally { setLoading(false); }
  };

  // ================== Edit Handlers ==================
  // ================== Edit Handlers ==================
const handleEditContainer = (item) => {
  setEditItem(item);
  setFormValue(actionType === "branchAction" ? item.branch : item.city);
  setIsModalOpen(true);
};

const handleEditUser = (user) => {
  setEditUser(user);
  setSelectedRole(user.role);
  setSelectedPages(user.accessPages || []);
  console.log("userss", user.accessPages);

  // ✅ open modal AFTER React has updated the states
  setTimeout(() => {
    setIsUserModalOpen(true);
  }, 50);
};

const handleCheckboxChange = (e, pagePath) => {
  if (e.target.checked) {
    setSelectedPages((prev) => [...prev, pagePath]);
  } else {
    setSelectedPages((prev) => prev.filter((p) => p !== pagePath));
  }
};

// ================== Update Handlers ==================
const handleUpdate = async () => {
  try {
    if (actionType === "branchAction") {
      await axios.post(`${AppRoutes.editBranch}/${editItem._id}`, {
        branch: { BranchName: formValue },
      });
      toast.success("Branch updated successfully ✅");
      fetchBranches();
      setIsModalOpen(false);
    } 
    else if (actionType === "cityAction") {
      await axios.post(`${AppRoutes.editCity}/${editItem._id}`, {
        city: { CityName: formValue },
      });
      toast.success("City updated successfully ✅");
      fetchCities();
      setIsModalOpen(false);
    }
  } catch (error) {
    console.error("Update failed:", error);
    toast.error("Update failed ❌");
  }
};

// ✅ Separate user update handler
const handleUpdateUser = async () => {
  try {
    const token = sessionStorage.getItem("token");

    await axios.put(
      `${AppRoutes.editUser}/${editUser._id}`,
      {
        email: editUser.email,
        role: selectedRole,
        pages: selectedPages, // ✅ include selected checkboxes
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    toast.success("User updated successfully ✅");
    setIsUserModalOpen(false);
    fetchUsers();
  } catch (error) {
    console.error("Failed to update user:", error);
    toast.error("Failed to update user ❌");
  }
};

// ================== Delete Handler ==================
const handleDeleteContainer = async (id) => {
  const confirmDelete = window.confirm(
    `Are you sure you want to delete this ${
      actionType === "branchAction"
        ? "branch"
        : actionType === "userAction"
        ? "user"
        : "city"
    }?`
  );
  if (!confirmDelete) return;

  try {
    const token = sessionStorage.getItem("token");

    if (actionType === "branchAction") {
      await axios.delete(`${AppRoutes.deleteBranch}/${id}`);
      toast.success("Branch deleted successfully");
      fetchBranches();
    } 
    else if (actionType === "userAction") {
      await axios.delete(`${AppRoutes.deleteUser}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("User deleted successfully");
      fetchUsers();
    } 
    else {
      await axios.delete(`${AppRoutes.deleteCity}/${id}`);
      toast.success("City deleted successfully");
      fetchCities();
    }
  } catch (error) {
    console.error("Delete failed:", error);
    toast.error("Delete failed ❌");
  }
};

// ================== Loading ==================
if (loading) {
  return (
    <div className="flex items-center justify-center h-screen text-purple-600 text-xl">
      Loading...
    </div>
  );
}


  return (
    <div className="bg-gray-50 min-h-screen">
      <Header />
      <h1 className="text-center text-2xl font-bold text-blue-800 px-4 pt-6 pb-2">
        {actionType === 'branchAction' ? 'All Branches' : actionType === 'userAction' ? 'All Users' : 'All Cities'}
      </h1>

      <div className="px-4 mb-4">
        <button
          onClick={() => navigate('/admin-pannel')}
          className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
        >← Back</button>
      </div>

      {/* ================== Table ================== */}
      <div className="p-4">
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
          <table className="w-full text-sm text-left text-gray-700 bg-white">
            <thead className="text-xl uppercase bg-gray-200 text-gray-800">
              <tr className="border-b border-gray-300">
                <th className="px-6 py-3 text-center whitespace-nowrap">S.No</th>
                <th className="px-6 py-3 text-center whitespace-nowrap">
                  {actionType === 'branchAction' ? 'Branch' : actionType === 'userAction' ? 'Email' : 'City'}
                </th>
                <th className="px-6 py-3 text-left whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.length > 0 ? data.map((d, index) => (
                <tr key={index} className="bg-white border-b hover:bg-gray-50">
                  <td className="px-6 py-4 text-center">{index + 1}</td>
                  <td className="px-6 py-4 text-center">
                    {actionType === 'branchAction' ? d.branch : actionType === 'userAction' ? d.email : d.city}
                  </td>
                  <td className="px-6 flex gap-4 py-4 text-center">
                    {actionType !== 'userAction' && (
                      <button onClick={() => handleEditContainer(d)} className="text-green-600 hover:text-blue-800">Edit</button>
                    )}
                    {actionType === 'userAction' && (
                      <button onClick={() => handleEditUser(d)} className="text-green-600 hover:text-blue-800">Edit</button>
                    )}
                    <button onClick={() => handleDeleteContainer(d._id)} className="text-red-600 hover:text-blue-800">Delete</button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={3} className="text-center py-8 text-red-600 font-semibold text-lg">
                    {actionType === 'branchAction' ? 'No Branches Found' : actionType === 'userAction' ? 'No Users Found' : 'No Cities Found'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================== Branch/City Modal ================== */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-md w-[90%] max-w-md relative">
            <button className="absolute top-2 right-3 text-gray-700 text-xl cursor-pointer" onClick={() => setIsModalOpen(false)}>&times;</button>
            <h2 className="text-xl font-bold mb-4 text-center">
              {actionType === 'branchAction' ? 'Update Branch' : 'Update City'}
            </h2>
            <input
              type="text"
              value={formValue}
              onChange={(e) => setFormValue(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded mb-4"
              placeholder={`Enter ${actionType === 'branchAction' ? 'Branch' : 'City'} Name`}
            />
            <button onClick={handleUpdate} className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Update</button>
          </div>
        </div>
      )}

      {/* ================== User Modal ================== */}
      {isUserModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-md w-[90%] max-w-md relative">
            <button className="absolute top-2 right-3 text-gray-700 text-xl cursor-pointer" onClick={() => setIsUserModalOpen(false)}>&times;</button>
            <h2 className="text-xl font-bold mb-4 text-center">Update User</h2>

            <input
              type="text"
              value={editUser?.email || ''}
              onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
              className="w-full border border-gray-300 p-2 rounded mb-4"
              placeholder="Email"
            />

            <div className="mb-4">
              <label className="font-medium">Role:</label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="w-full border border-gray-300 p-2 rounded mt-1"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="font-medium">Pages Access:</label>
              <div className="grid grid-cols-2 gap-2 mt-2 max-h-40 overflow-y-auto">
                {allPages.map((page, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      value={page.path}
                    checked={selectedPages.includes(page.path)}
                   onChange={(e) => handleCheckboxChange(e, page.path)}
                    />
                    <label>{page.label}</label>
                  </div>
                ))}
              </div>
            </div>

            <button onClick={handleUpdateUser} className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Update User</button>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminPannelAction;
