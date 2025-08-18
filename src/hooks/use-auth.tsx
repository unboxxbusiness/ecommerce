'use client';

import React, {
  useState,
  useEffect,
  createContext,
  useContext,
  ReactNode,
} from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  updateEmail,
} from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { doc, updateDoc } from 'firebase/firestore';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<any>;
  logout: () => Promise<any>;
  updateUserProfile: (data: { displayName?: string, email?: string }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);
  
  const login = (email: string, pass: string) => {
    return signInWithEmailAndPassword(auth, email, pass);
  };
  
  const logout = () => {
    return signOut(auth).then(() => {
        router.push('/login');
    });
  };

  const updateUserProfile = async (data: { displayName?: string, email?: string }) => {
    if (!auth.currentUser) {
        throw new Error("No user is currently signed in.");
    }
    const currentUser = auth.currentUser;

    if (data.displayName && data.displayName !== currentUser.displayName) {
        await updateProfile(currentUser, { displayName: data.displayName });
    }
    
    if (data.email && data.email !== currentUser.email) {
        await updateEmail(currentUser, data.email);
    }

    // Also update the firestore document if it exists
    const userDocRef = doc(db, 'customers', currentUser.uid);
    await updateDoc(userDocRef, {
        name: data.displayName,
        email: data.email
    });
    
    // Manually refetch user to update state
    await currentUser.reload();
    const refreshedUser = auth.currentUser;
    setUser(refreshedUser);
  };

  const value = {
    user,
    loading,
    login,
    logout,
    updateUserProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
