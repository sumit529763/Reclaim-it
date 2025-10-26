// src/services/student.service.js



import { db } from "../lib/firebase/firebase";

import { doc, getDoc, setDoc } from "firebase/firestore";



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

    return null;

  }

}



/**

 * Create student profile if not exists

 * * 🔑 FIX: Now returns the created profile data object instead of just 'true'.

 * @param {string} uid - Firebase Auth user.uid

 * @param {object} data - Student info { name, email, photoURL }

 */

export async function createStudent(uid, data) {

  try {

    const ref = doc(db, "students", uid);

   

    // Create the final data object, including the default role

    const newProfile = {

      ...data,

      role: "user", // <-- Default role remains

      createdAt: new Date(),

    };



    await setDoc(ref, newProfile);

   

    // FIX APPLIED: Return the full, newly created profile

    return newProfile;

   

  } catch (err) {

    console.error("Error creating student:", err);

    return null; // Return null on failure

  }

}



/**

 * Update or create student profile

 * @param {string} uid - Firebase Auth user.uid

 * @param {object} data - fields to update

 */

export async function updateStudent(uid, data) {

  try {

    const ref = doc(db, "students", uid);

    await setDoc(ref, {

      ...data,

      updatedAt: new Date(),

    }, { merge: true }); // Using setDoc with merge: true for partial updates



    return true;

  } catch (err) {

    console.error("Error updating student:", err);

    return false; // fail gracefully

  }

}