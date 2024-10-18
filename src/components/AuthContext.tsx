import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/supabaseClient';
import { Session } from '@supabase/supabase-js'; // Import Session type from supabase

// Define the shape of the AuthContext
interface AuthContextType {
    session: Session | null;
    loading: boolean;
}

// Create the AuthContext with default value
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode; // Properly typed children
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getSession = async () => {
            const { data } = await supabase.auth.getSession();
            setSession(data.session);
            setLoading(false);
        };

        getSession();

        const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setLoading(false);
        });

        return () => {
            authListener.subscription.unsubscribe();
        };
    }, []);


    // Return children wrapped in the AuthContext.Provider
    return (
        <AuthContext.Provider value={{ session, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
