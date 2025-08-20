
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
import { handleSignup } from '@/app/actions';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<any>;
  logout: () => Promise<any>;
  signup: (email: string, pass: string) => Promise<any>;
  updateUserProfile: (data: { displayName?: string, email?: string }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const createSession = async (user: User) => {
    const idToken = await user.getIdToken(true); // Force refresh the token
    const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: idToken }),
    });
    if (!res.ok) {
        throw new Error('Failed to create session');
    }
    return res.json();
};

const clearSession = async () => {
    await fetch('/api/auth/logout', {
        method: 'POST',
    });
};


export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setLoading(true);
      if (user) {
        setUser(user);
        await createSession(user);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);
  
  const login = (email: string, pass: string) => {
    return signInWithEmailAndPassword(auth, email, pass);
  };
  
  const logout = async () => {
    await signOut(auth)
    await clearSession();
    router.push('/login');
  };

  const signup = async (email: string, password: string) => {
    const formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);
    const result = await handleSignup(formData);
    if (result.error) {
      throw new Error(result.error);
    }
    // After signup, log the user in to trigger onAuthStateChanged and session creation
    await login(email, password);
    return result;
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
    signup,
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
