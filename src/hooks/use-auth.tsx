
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
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  updateEmail,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { doc, setDoc, serverTimestamp, updateDoc } from 'firebase/firestore';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<any>;
  signup: (email: string, pass: string) => Promise<any>;
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
  
  const signup = async (email: string, pass: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
    const user = userCredential.user;
    
    // Create a customer document in Firestore
    if (user) {
      await setDoc(doc(db, 'customers', user.uid), {
        name: user.displayName || email.split('@')[0],
        email: user.email,
        avatar: user.photoURL || `https://placehold.co/100x100.png`,
        totalOrders: 0,
        totalSpent: 0,
        joinDate: serverTimestamp(),
        isActive: true,
        role: 'customer',
      });
    }

    return userCredential;
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
    
    if (data.displayName) {
        await updateProfile(auth.currentUser, { displayName: data.displayName });
    }
    
    if (data.email && data.email !== auth.currentUser.email) {
        await updateEmail(auth.currentUser, data.email);
    }

    // Also update the firestore document if it exists
    const userDocRef = doc(db, 'customers', auth.currentUser.uid);
    await updateDoc(userDocRef, {
        name: data.displayName,
        email: data.email
    });
    
    // Manually refetch user to update state
    const updatedUser = { ...auth.currentUser, displayName: data.displayName, email: data.email };
    setUser(updatedUser as User);
  };

  const value = {
    user,
    loading,
    login,
    signup,
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
