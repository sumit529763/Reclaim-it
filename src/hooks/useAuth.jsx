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
  const [user, setUser] = useState(null);       // Firebase User object
  const [initializing, setInitializing] = useState(true);
  const [profile, setProfile] = useState(null); // Firestore profile data

  // Listen to Firebase auth state
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setInitializing(false);
    });

    return () => unsub();
  }, []);

  // Fetch Firestore profile once Firebase user is available
  useEffect(() => {
    if (user && !profile) {
      const fetchProfile = async () => {
        try {
          let studentProfile = await getStudent(user.uid);
          if (!studentProfile) {
            studentProfile = {
              name: user.displayName || "Unnamed",
              email: user.email,
              photo: user.photoURL || null,
            };
            await createStudent(user.uid, studentProfile);
          }
          setProfile(studentProfile);
        } catch (err) {
          console.error("Firestore access error:", err);
        }
      };
      fetchProfile();
    }
  }, [user, profile]);

  const value = useMemo(
    () => ({
      user,            // Keep Firebase User object intact
      profile,         // Firestore profile
      initializing,
      loginWithEmail: (email, password) =>
        signInWithEmailAndPassword(auth, email, password),
      signupWithEmail: (email, password) =>
        createUserWithEmailAndPassword(auth, email, password),
      loginWithGoogle: () => signInWithPopup(auth, googleProvider),
      logout: () => signOut(auth),
    }),
    [user, initializing, profile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}
