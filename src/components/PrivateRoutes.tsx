import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from './AuthContext';

const PrivateRoute: React.FC = () => {
    const authContext = useContext(AuthContext);

    if (!authContext) {
        return null;
    }

    const { session, loading } = authContext;

    if (loading) {
        return;
    }

    if (!session) {
        return <Navigate to="/login" />;
    }

    return <Outlet />;
};

export default PrivateRoute;
