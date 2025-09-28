// src/services/items.service.js
import { db } from "../lib/firebase/firebase";
import {
  collection, addDoc, query, where, getDocs, serverTimestamp, doc, getDoc, updateDoc
} from "firebase/firestore";

const itemsRef = collection(db, "items");

export async function createItem(payload) {
  return addDoc(itemsRef, {
    ...payload,
    status: 'in_review', // <-- This is the new line
    createdAt: serverTimestamp(),
  });
}

export async function getMyItems(userId) {
  const q = query(itemsRef, where("ownerId", "==", userId));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function getDashboardStats(userId) {
  const q = query(itemsRef, where("ownerId", "==", userId));
  const snap = await getDocs(q);

  const reportedCount = snap.docs.length;
  let resolvedCount = 0;
  let inReviewCount = 0;

  snap.docs.forEach(doc => {
    const data = doc.data();
    if (data.status === 'resolved') {
      resolvedCount++;
    } else if (data.status === 'in_review') {
      inReviewCount++;
    }
  });

  return {
    reported: reportedCount,
    resolved: resolvedCount,
    inReview: inReviewCount
  };
}

export async function getItem(itemId) {
    try {
        const docRef = doc(db, "items", itemId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() };
        } else {
            console.log("No such document!");
            return null;
        }
    } catch (error) {
        console.error("Error fetching document:", error);
        return null;
    }
}

// NEW function to update an item's status
export async function updateItemStatus(itemId, newStatus) {
    try {
        const itemRef = doc(db, "items", itemId);
        await updateDoc(itemRef, {
            status: newStatus,
            updatedAt: serverTimestamp()
        });
        return true;
    } catch (error) {
        console.error("Error updating item status:", error);
        return false;
    }
}