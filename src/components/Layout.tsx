import React from 'react';
import { NavBar } from './NavBar';

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div className='min-h-screen backdrop-blur-lg w-full'>
            <NavBar />
            <main className='max-w-7xl p-16 mx-auto'>
                {children}
            </main>
        </div>
    );
};

export default Layout;