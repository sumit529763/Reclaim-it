// src/services/activity.service.js
import { db } from "../lib/firebase/firebase";
import { collection, addDoc, query, where, orderBy, getDocs, serverTimestamp } from "firebase/firestore";

// Save new activity
export async function logActivity(userId, action, details = "") {
  try {
    await addDoc(collection(db, "activities"), {
      userId,
      action,
      details,
      createdAt: serverTimestamp(),
    });
  } catch (err) {
    console.error("Error logging activity:", err);
  }
}

// Fetch user activities (latest first)
export async function getUserActivities(userId) {
  try {
    const q = query(
      collection(db, "activities"),
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );

    const snap = await getDocs(q);
    return snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (err) {
    console.error("Error fetching activities:", err);
    return [];
  }
}
