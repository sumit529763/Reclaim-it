// src/hooks/useAuth.jsx

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  signInWithPopup,
} from "firebase/auth";
import { auth, googleProvider } from "../lib/firebase/firebase";
import { getStudent, createStudent } from "../services/student.service";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); 
  const [initializing, setInitializing] = useState(true);
  const [profile, setProfile] = useState(null); 
  const [profileLoading, setProfileLoading] = useState(false); 

  // 1. Listen to Firebase auth state
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setInitializing(false);
      
      if (!firebaseUser) {
        setProfile(null);
      }
    });

    return () => unsub();
  }, []);

  // 2. Fetch Firestore profile once Firebase user is available (MODIFIED AND FIXED)
  useEffect(() => {
    if (user && !profile && !profileLoading) { 
      const fetchProfile = async () => {
        setProfileLoading(true);
        try {
          let studentProfile = await getStudent(user.uid);
          
          if (!studentProfile) {
            // New user case: create the profile
            const newProfileData = {
              name: user.displayName || "Unnamed",
              email: user.email,
              photo: user.photoURL || null,
            };
            
            // 🔑 FIX APPLIED: Capture the data returned by createStudent directly
            studentProfile = await createStudent(user.uid, newProfileData); 
            
            // NOTE: The previous redundant getStudent call is now correctly removed.
          }
          
          if (studentProfile) {
            setProfile(studentProfile);
          }
        } catch (err) {
          console.error("Firestore access error:", err);
        } finally {
          setProfileLoading(false);
        }
      };
      fetchProfile();
    }

  }, [user, profile, profileLoading]);

  // 3. Derived State for Admin Check (No change, remains correct)
  const isAdmin = useMemo(() => {
    return !!profile && profile.role === 'admin'; 
  }, [profile]);
  // ----------------------------------------------------

  const value = useMemo(
    () => ({
      user, 
      profile, 
      initializing,
      profileLoading, 
      isAdmin,        
      
      // Auth methods (no change)
      loginWithEmail: (email, password) =>
        signInWithEmailAndPassword(auth, email, password),
      signupWithEmail: (email, password) =>
        createUserWithEmailAndPassword(auth, email, password),
      loginWithGoogle: () => signInWithPopup(auth, googleProvider),
      logout: () => signOut(auth),
    }),
    [user, initializing, profile, profileLoading, isAdmin]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}