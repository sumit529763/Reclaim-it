// src/services/studentService.js
import { db } from "../lib/firebase/firebase";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

/**
 * Get student profile from Firestore
 * @param {string} uid - Firebase Auth user.uid
 */
export async function getStudent(uid) {
  try {
    const ref = doc(db, "students", uid);
    const snap = await getDoc(ref);

    if (snap.exists()) {
      return snap.data();
    } else {
      return null; // student not found
    }
  } catch (err) {
    console.error("Error fetching student:", err);
    return null; // fallback if permission denied
  }
}

/**
 * Create student profile if not exists
 * @param {string} uid - Firebase Auth user.uid
 * @param {object} data - Student info { name, email, photoURL }
 */
export async function createStudent(uid, data) {
  try {
    const ref = doc(db, "students", uid);
    await setDoc(ref, {
      ...data,
      createdAt: new Date(),
    });
    return true;
  } catch (err) {
    console.error("Error creating student:", err);
    return false; // fail gracefully
  }
}

/**
 * Update student profile
 * @param {string} uid - Firebase Auth user.uid
 * @param {object} data - fields to update
 */
export async function updateStudent(uid, data) {
  try {
    const ref = doc(db, "students", uid);
    await updateDoc(ref, {
      ...data,
      updatedAt: new Date(),
    });
    return true;
  } catch (err) {
    console.error("Error updating student:", err);
    return false; // fail gracefully
  }
}
