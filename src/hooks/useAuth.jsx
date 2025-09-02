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

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Fetch profile safely
          let profile = await getStudent(firebaseUser.uid);

          if (!profile) {
            profile = {
              name: firebaseUser.displayName || "Unnamed",
              email: firebaseUser.email,
              photoURL: firebaseUser.photoURL || null,
            };
            // Safely create profile
            await createStudent(firebaseUser.uid, profile);
          }

          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL,
            ...profile,
          });
        } catch (err) {
          console.error("Firestore access error:", err);
          // Optional: fallback user object without Firestore data
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL,
          });
        }
      } else {
        setUser(null);
      }
      setInitializing(false);
    });

    return () => unsub();
  }, []);

  const value = useMemo(
    () => ({
      user,
      initializing,
      loginWithEmail: (email, password) =>
        signInWithEmailAndPassword(auth, email, password),
      signupWithEmail: (email, password) =>
        createUserWithEmailAndPassword(auth, email, password),
      loginWithGoogle: () => signInWithPopup(auth, googleProvider),
      logout: () => signOut(auth),
    }),
    [user, initializing]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}
