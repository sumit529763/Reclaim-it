// src/hooks/useAuth.jsx (FINAL VERSION)

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  signInWithPopup,
  sendPasswordResetEmail, 
} from "firebase/auth";
import { auth, googleProvider } from "../lib/firebase/firebase";
import { getStudent, createStudent } from "../services/student.service";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); 
  const [initializing, setInitializing] = useState(true);
  const [profile, setProfile] = useState(null); 
  const [profileLoading, setProfileLoading] = useState(false); 

  // 1. Listen to Firebase auth state (CRITICAL FIX: Removed aggressive sign-out)
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      
      // FIX: The user remains authenticated until they access a protected route.
      // The security check is now correctly delegated to ProtectedRoute.
      
      setUser(firebaseUser);
      setInitializing(false);
      
      if (!firebaseUser) {
        setProfile(null);
      }
    });

    return () => unsub();
  }, []);

  // 2. Fetch Firestore profile once Firebase user is available (remains unchanged)
  useEffect(() => {
    if (user && !profile && !profileLoading) { 
      const fetchProfile = async () => {
        setProfileLoading(true);
        try {
          let studentProfile = await getStudent(user.uid);
          
          if (!studentProfile) {
            const newProfileData = {
              name: user.displayName || "Unnamed",
              email: user.email,
              photo: user.photoURL || null,
            };
            studentProfile = await createStudent(user.uid, newProfileData); 
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

  // 3. Derived State for Admin Check (remains unchanged)
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
      
      // Auth methods 
      loginWithEmail: (email, password) =>
        signInWithEmailAndPassword(auth, email, password),
      signupWithEmail: (email, password) =>
        createUserWithEmailAndPassword(auth, email, password),
      loginWithGoogle: () => signInWithPopup(auth, googleProvider),
      logout: () => signOut(auth),
      
      // Export the password reset function
      resetPassword: (email) => sendPasswordResetEmail(auth, email), 
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