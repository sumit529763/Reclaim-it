import { db } from "../lib/firebase/firebase";
import {
  collection, addDoc, query, where, getDocs, serverTimestamp
} from "firebase/firestore";

const itemsRef = collection(db, "items");

export async function createItem(payload) {
  return addDoc(itemsRef, {
    ...payload,
    createdAt: serverTimestamp(),
  });
}

export async function getMyItems(userId) {
  const q = query(itemsRef, where("ownerId", "==", userId));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

// NEW function to get dashboard stats
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