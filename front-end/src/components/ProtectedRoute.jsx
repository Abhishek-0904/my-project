import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, adminOnly = false }) => {
    let user = null;
    try {
        const userStr = localStorage.getItem('user');
        user = userStr ? JSON.parse(userStr) : null;
    } catch (e) {
        console.error("Error parsing user from localStorage", e);
        localStorage.removeItem('user');
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (adminOnly && user.role !== 'admin') {
        console.warn("🛡️ ProtectedRoute: Role mismatch. User is not admin. Redirecting to dashboard.");
        return <Navigate to="/dashboard" replace />;
    }

    // Role-based redirect for regular dashboard: 
    // If an admin tries to access user dashboard, send them to admin panel
    if (!adminOnly && user.role === 'admin' && window.location.pathname === '/dashboard') {
        console.warn("🛡️ ProtectedRoute: Admin accessing user dashboard. Redirecting to admin panel.");
        return <Navigate to="/admin" replace />;
    }

    return children;
};

export default ProtectedRoute;
