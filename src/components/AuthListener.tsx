import { useEffect, useState } from 'react';
import { supabase } from '@/supabaseClient';
import { Session } from '@supabase/supabase-js'; // Import Session type from supabase

const AuthListener = () => {
    const [session, setSession] = useState<Session | null>(null); // Properly typed session

    useEffect(() => {
        const getSession = async () => {
            const { data } = await supabase.auth.getSession();
            setSession(data.session);
        };
        getSession();

        // Subscribe to auth changes (e.g., login, logout)
        const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
            setSession(session);
        });

        // Clean up listener on unmount
        return () => {
            authListener.subscription.unsubscribe();
        };
    }, []);

    return null;
};

export default AuthListener;
