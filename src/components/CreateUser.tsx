import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AppRoutes } from '../constants/AppRoutes';

const CreateUser = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailErr, setEmailErr] = useState('');
  const [passwordErr, setPasswordErr] = useState('');
  const [accessPages, setAccessPages] = useState([]); // ✅ store selected pages
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // ✅ All possible pages
  const pages = [
    { label: 'Home', path: '/' },
    { label: 'Create Booking', path: '/add-booking' },
        { label: 'Booking Lists', path: '/all-bookings' },
    { label: 'Create Container', path: '/container' },
    { label: 'Containers Lists', path: '/all-containers' },
    // { label: 'Services', path: '/services' },
    { label: 'Admin Panel', path: '/admin-pannel' },
    // { label: "Whatsapp-Media", path: "/whatsapp-marketing" },

  ];

  const handleCheckboxChange = (path) => {
    setAccessPages((prev) =>
      prev.includes(path) ? prev.filter((p) => p !== path) : [...prev, path]
    );
  };

  const handleLogin = async () => {
    try {
      setLoading(true);
      setEmailErr('');
      setPasswordErr('');

      if (!email.trim()) {
        setEmailErr('Email is required!');
        setLoading(false);
        return;
      }
      if (!password.trim()) {
        setPasswordErr('Password is required!');
        setLoading(false);
        return;
      }

      const response = await axios.post(AppRoutes.register, {
        email,
        password,
        accessPages, // ✅ send selected pages
      });

      const data = response.data;
      toast.success(data?.data?.message);
      setEmail('');
      setPassword('');
      setAccessPages([]);
    } catch (error) {
      console.log(error);
      const err = error?.response?.data?.errors;
      if (err?.email) setEmailErr(err.email);
      if (err?.general) toast.error(err.general);
      if (!err) toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-96">
      <div className="bg-white/20 backdrop-blur-sm p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Create User
        </h2>

        <div className="space-y-4 w-96">
          {/* Email Field */}
          <div className="flex">
            <div className="bg-blue-600 text-yellow-300 px-4 py-3 font-medium text-sm w-32 flex items-center">
              Email
            </div>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 px-4 py-3 border-2 border-red-500 focus:outline-none focus:border-red-600 bg-gray-200"
              placeholder="Email address"
            />
          </div>
          <p className="text-red-600 text-sm">{emailErr}</p>

          {/* Password Field */}
          <div className="flex">
            <div className="bg-blue-600 text-yellow-300 px-4 py-3 font-medium text-sm w-32 flex items-center">
              Password
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="flex-1 px-4 py-3 border-2 border-red-500 focus:outline-none focus:border-red-600 bg-gray-200"
              placeholder="Password"
            />
          </div>
          <span className="text-red-600 text-sm">{passwordErr}</span>

          {/* Page-Level Access Checkboxes */}
          <div className="mt-4">
            <label className="font-medium text-gray-700">
              Assign Page Access:
            </label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {pages.map((page) => (
                <label
                  key={page.path}
                  className="flex items-center space-x-2 text-gray-800"
                >
                  <input
                    type="checkbox"
                    checked={accessPages.includes(page.path)}
                    onChange={() => handleCheckboxChange(page.path)}
                  />
                  <span>{page.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <button
            disabled={loading}
            onClick={handleLogin}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded font-medium hover:bg-blue-700 transition-colors mt-6"
          >
            {loading ? (
              <div className="flex justify-center">
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
              </div>
            ) : (
              'Create User'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateUser;
