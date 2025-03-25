import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '../types';
import { getCurrentUser, signInWithGoogle, signOut, getUserRole } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  signIn: (token: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const currentUser = await getCurrentUser();
        if (currentUser) {
          // Get user role
          const role = await getUserRole();
          
          setUser({
            id: currentUser.id,
            email: currentUser.email || '',
            avatar_url: currentUser.user_metadata?.avatar_url,
            name: currentUser.user_metadata?.full_name || currentUser.user_metadata?.name,
            role: role
          });
          
          setIsAdmin(role === 'admin');
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, []);

  const signIn = async (token: string) => {
    try {
      const { user: authUser } = await signInWithGoogle(token);
      if (authUser) {
        // Get user role after sign in
        const role = await getUserRole();
        
        setUser({
          id: authUser.id,
          email: authUser.email || '',
          avatar_url: authUser.user_metadata?.avatar_url,
          name: authUser.user_metadata?.full_name || authUser.user_metadata?.name,
          role: role
        });
        
        setIsAdmin(role === 'admin');
      }
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut();
      setUser(null);
      setIsAdmin(false);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin, signIn, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
