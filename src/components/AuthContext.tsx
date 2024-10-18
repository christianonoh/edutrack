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

  // Fetch the initial session and listen for auth state changes
  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      setLoading(false);
    };

    getSession();

    // Set up listener for auth state changes (login, logout, session updates)
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session); // Update session whenever auth state changes
      setLoading(false);
    });

    // Clean up the listener on component unmount
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Provide the session and loading state via the context
  return (
    <AuthContext.Provider value={{ session, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
