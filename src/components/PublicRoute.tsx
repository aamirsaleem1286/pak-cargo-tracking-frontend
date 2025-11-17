// components/PublicRoute.tsx

import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Import the typed hook


const PublicRoute = () => {
    // user will be typed as 'string | null' from useAuth()
    const { user } = useAuth();

    return user ? <Navigate to="/services" /> : <Outlet />;
    
};

export default PublicRoute;