import axios from 'axios';
import React,{useState,useEffect} from 'react'
import { useNavigate,useLocation  } from 'react-router-dom';
import { AppRoutes } from '../constants/AppRoutes';
import {useAuth} from '../context/AuthContext'
import { toast } from 'react-toastify';
import heroImage from "@/assets/final1200x600.png";
const Login = () => {
    const {setUser} = useAuth()
    const location = useLocation()
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailErr,setEmailErr] = useState('')
    const [passwordErr,setPasswordErr] = useState('')
    const [loading,setLoading] = useState(false)
    const navigate = useNavigate();
    const handleLogin =async () => {
      try {
        setLoading(true)
        setEmailErr('');
        setPasswordErr('');
          // Simple email regex for validation
      //     const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      // if (!email.trim()) {
      //   setEmailErr('Email are required!');
      //   return;
      // }
     
      if (!password.trim()) {
        setPasswordErr('Password are required!');
        return;
        
      }
      
      // if (!isValidEmail) {
      //   setEmailErr('Please enter a valid email address!');
      //   return;
      // }
     
    const response = await axios.post(AppRoutes.login,{email,password})
    const data = response.data;
    console.log("userss " ,response.data)
    sessionStorage.setItem('token',data?.data?.userData?.accessToken)
    sessionStorage.setItem("role", data?.data?.userData?.role);
sessionStorage.setItem("accessPages", JSON.stringify(data?.data?.userData?.pages));

    setUser(data?.data?.userData?.email)
    console.log(data);
    
    toast.success(data?.data?.message);
    navigate('/services')
    
    
} catch (error) {
    console.log(error);
    const err = error?.response?.data?.errors;
    if (err?.email) setEmailErr(err.email);
    if (err?.general) toast.error(err.general);
    if (!err) toast.error('Something went wrong');
  
} finally{
  setLoading(false)
  
}
      
  };
  const pathName = location.pathname
    // useEffect(() => {
    //     const user = localStorage.getItem('user');
    //     if (user) {
    //       navigate('/services');
    //     }
    //   }, [navigate]);
     const BackToHomeButton = ({ navigate }: { navigate: (path: string) => void }) => (
    <div className="mt-8 flex justify-center">
        <button
            onClick={() => navigate('/')}
            className="rounded-md bg-blue-700 px-5 py-2.5 text-sm font-medium text-white shadow hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
            Back to Pak Chinar Int'I Cargo Home
        </button>
    </div>
);
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Professional delivery service"
          className="w-full object-cover h-screen"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/30 to-transparent"></div>
      </div>
      <form
        className="bg-white/20 backdrop-blur-sm p-8 rounded-lg shadow-lg"
        onSubmit={(e) => {
          e.preventDefault(); // prevent page refresh
          handleLogin(); // your login logic
        }}
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          {pathName === "/login" ? "Admin Login" : "User Login"}
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

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded font-medium hover:bg-blue-700 transition-colors mt-6 cursor-pointer"
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
              "Login"
            )}
          </button>
          <BackToHomeButton navigate={navigate}/>
        </div>
      </form>
    </div>
  );
}

export default Login