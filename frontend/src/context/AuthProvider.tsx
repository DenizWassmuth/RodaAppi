import React, { useEffect, useState, type ReactNode } from 'react';
import axios from 'axios';
import type { AppUserType } from '../types/AppUser.ts';
import { login as authLogin, logout as authLogout } from '../utility/Auth.ts';
import { AuthContext } from './AuthContext.ts';

/**
 * AuthProvider component that wraps the app and provides auth state to children.
 */
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<AppUserType>(null);
    const [loading, setLoading] = useState(true);

    /**
     * Fetches the current user session from the backend.
     * This is called on mount and can be called manually via refreshUser.
     */
    const loadUser = async () => {
        try {
            // Check session status with the backend API
            const response = await axios.get("/api/auth");
            setUser(response.data);
        } catch (error) {
            // If the request fails (e.g., 401), the user is not authenticated
            setUser(null);
            console.log(error + " user was set to null, as user is not logged in");
        } finally {
            // Auth check is complete
            setLoading(false);
        }
    };

    // Run the initial auth check once when the provider is mounted.
    useEffect(() => {
        loadUser();
    }, []);

    // Helper functions mapped to existing utility logic
    const login = () => authLogin();
    const logout = () => authLogout();

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, refreshUser: loadUser }}>
            {children}
        </AuthContext.Provider>
    );
};
