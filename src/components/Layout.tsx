// src/components/Layout.tsx

import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header'; // Apne Header component ka path theek kar lein

const Layout: React.FC = () => {
    return (
        <div>
            {/* 👈 Header jo har page par dikhega */}
            <Header /> 
            
            <main className='mt-20'>
                {/* 👈 Outlet yahan child routes (pages) ko render karega */}
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;