// src/services/auth.service.js

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification, 
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
import { auth, googleProvider } from "../lib/firebase/firebase";

export async function registerWithEmail(email, password, displayName) {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  
  // CRITICAL ADDITION: Sends the verification email
  await sendEmailVerification(cred.user);
  
  if (displayName) {
    await updateProfile(cred.user, { displayName });
  }
  return cred.user;
}

export function loginWithEmail(email, password) {
  return signInWithEmailAndPassword(auth, email, password).then(r => r.user);
}

export function loginWithGoogle() {
  return signInWithPopup(auth, googleProvider).then(r => r.user);
}

export function logout() {
  return signOut(auth);
}