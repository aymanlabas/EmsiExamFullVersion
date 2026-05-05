import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user, loading } = useContext(AuthContext);

    if (loading) {
        return (
            <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700"></div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" />;
    }

    // If allowedRoles specified, check user role
    if (allowedRoles && !allowedRoles.includes(user.role)) {
        // Redirect to appropriate dashboard based on role
        switch (user.role) {
            case 'ADMIN': return <Navigate to="/admin" />;
            case 'PROFESSEUR': return <Navigate to="/professeur" />;
            case 'ETUDIANT': return <Navigate to="/exams" />;
            default: return <Navigate to="/login" />;
        }
    }

    return children;
};

export default ProtectedRoute;
