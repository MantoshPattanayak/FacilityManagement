import React, { createContext, useContext, useState, useEffect } from 'react';
import { isLoggedIn, refreshAccessToken, removeToken } from './authService';
import instance from '../../../env';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [isAuthenticated, setIsAuthenticated] = useState(isLoggedIn());
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        console.log("AuthProvider isAuthenticated useEffect", isAuthenticated);
        const initializeAuth = async () => {
            if (!isLoggedIn()) {
                console.log("=================AuthProvider useEffect not logged in or expired========================")
                const newToken = await refreshAccessToken();
                console.log("newToken", newToken, !!newToken);
                setIsAuthenticated(!!newToken);
            } else {
                setIsAuthenticated(true);
            }
            setLoading(false);
        };

        initializeAuth();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}

export function withAuth(Component) {
    return function AuthComponent(props) {
        const { isAuthenticated } = useAuth();
        console.log("withAuth", isAuthenticated);
        if (!isAuthenticated) {
            window.location.href = instance().baseName ? instance().baseName + '/login-signup' : '/login-signup';
            return null;
        }
        return <Component {...props} />;
    };
}
