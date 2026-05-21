import { createContext, useContext } from 'react';
import type { AppUserType } from '../types/AppUser.ts';

/**
 * Defines the shape of the Authentication Context.
 */
export interface AuthContextType {
    user: AppUserType;       // The current user object or null/undefined if not logged in
    loading: boolean;        // Indicates if the initial auth check is still in progress
    login: () => void;       // Function to trigger the OAuth2 login flow
    logout: () => void;      // Function to trigger the logout flow
    refreshUser: () => Promise<void>; // Manually re-fetch user data from the server
}

// Create the context with an undefined default value.
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Custom hook for components to access auth state easily.
 * Throws an error if used outside an AuthProvider.
 */
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
