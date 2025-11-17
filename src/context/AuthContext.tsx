import { createContext, useContext, useEffect, useState, ReactNode, Dispatch, SetStateAction } from "react";
import { AppRoutes } from "../constants/AppRoutes";
import axios from 'axios';

// --- 1. Define Types and Interfaces ---

// Define the shape of the user data you store. 
// Assuming the API returns the user's email as a string, or null if logged out.
type User = string | null; 

// Define the shape of the entire context object that will be passed via the Provider.
interface AuthContextType {
    user: User;
    setUser: Dispatch<SetStateAction<User>>; // TypeScript for a state setter function
    loading: boolean;
}

// --- 2. Create the Context and Default Value ---

// Provide a default object that matches the AuthContextType structure.
// This is essential to prevent the 'defaultValue not provided' error in TypeScript.
const DEFAULT_AUTH_CONTEXT_VALUE: AuthContextType = {
    user: null,
    setUser: () => {}, // A No-op function for the default
    loading: true, 
};

// Create the context, explicitly typing it with the defined interface.
const AuthContext = createContext<AuthContextType>(DEFAULT_AUTH_CONTEXT_VALUE);

// --- 3. Context Provider Component ---

// Define the props for the provider (it only takes children).
interface AuthContextProviderProps {
    children: ReactNode;
}

const AuthContextProvider = ({ children }: AuthContextProviderProps) => {
    // useState calls are automatically typed based on the initial value (null | string)
    const [user, setUser] = useState<User>(null);
    const [loading, setLoading] = useState(true);

    const getUserInfo = async (token: string) => {
        try {
            const response = await axios.get(AppRoutes.userInfo, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log(response);
            
            // Explicitly cast the user data to string or null based on your API response
            const email: string | undefined = response?.data?.data?.email;
            setUser(email || null);
            
        } catch (error) {
            console.error("Error fetching user info:", error);
            
            // Use type narrowing for 'error' object if possible, or use 'any' if necessary 
            // to access nested properties of an Axios error response.
            const status = (error as any).response?.status;
            
            if (status === 401 || status === 403) {
                sessionStorage.removeItem('token');
                setUser(null);
            }
        }
        finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        const token = sessionStorage.getItem('token');
        
        if (!token) { 
            setLoading(false); 
            return;
        }

        // If a token exists but the user object isn't set, fetch user info
        if (token && !user) {
            getUserInfo(token);
        }
    }, [user]); // Added 'user' to dependencies to avoid linting warnings

    // The value object is implicitly typed as AuthContextType
    const contextValue = { user, setUser, loading };
    
    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
}

// --- 4. Custom Hook for Consumption ---

const useAuth = (): AuthContextType => {
    // Explicitly type the context value returned from useContext
    const context = useContext(AuthContext);
    
    // Check to ensure the hook is used inside the Provider
    if (context === DEFAULT_AUTH_CONTEXT_VALUE) { 
        // This check ensures we aren't using the default (placeholder) context value
        throw new Error('useAuth must be used within an AuthContextProvider');
    }
    
    return context;
}

export { AuthContextProvider, useAuth };