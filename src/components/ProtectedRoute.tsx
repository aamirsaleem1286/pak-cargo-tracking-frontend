// components/ProtectedRoute.tsx

import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Import the typed hook

const ProtectedRoute: React.FC = () => {
    // user will be typed as 'string | null' from useAuth()
    const { user } = useAuth();
    
    // Renders the child route (<Outlet />) if user is logged in (user is a truthy string)
    // Otherwise, navigates to the login page
    return user ? <Outlet /> : <Navigate to={'/login'} />;
};

export default ProtectedRoute;