// src/services/items.service.js (FINAL & COMPLETE)

import { db } from "../lib/firebase/firebase";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  serverTimestamp,
  doc,
  getDoc,
  updateDoc,
  deleteDoc, // 🔑 ADDED: Import deleteDoc
  orderBy,
} from "firebase/firestore";

const itemsRef = collection(db, "items");

export async function createItem(payload) {
  return addDoc(itemsRef, {
    ...payload,
    // All items start here, hidden from public view
    status: "in_review", 
    createdAt: serverTimestamp(),
  });
}

export async function getMyItems(userId) {
  // Fetches all items reported by the user, regardless of status
  const q = query(itemsRef, where("ownerId", "==", userId), orderBy("createdAt", "desc"));
  try {
      const snap = await getDocs(q);
      return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch (error) {
      console.error("Error fetching my items:", error);
      return [];
  }
}

export async function getDashboardStats(userId) {
  // Used for the dashboard overview cards
  const q = query(itemsRef, where("ownerId", "==", userId));
  try {
      const snap = await getDocs(q);
      const reportedCount = snap.docs.length;
      let resolvedCount = 0;
      let inReviewCount = 0;
      snap.docs.forEach((doc) => {
        const data = doc.data();
        if (data.status === "resolved") {
          resolvedCount++;
        } else if (data.status === "in_review") {
          inReviewCount++;
        }
      });
      return {
        reported: reportedCount,
        resolved: resolvedCount,
        inReview: inReviewCount,
      };
  } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      return { reported: 0, resolved: 0, inReview: 0 };
  }
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

export async function updateItemStatus(itemId, newStatus) {
  try {
    const itemRef = doc(db, "items", itemId);
    await updateDoc(itemRef, {
      status: newStatus,
      updatedAt: serverTimestamp(),
    });
    return true;
  } catch (error) {
    console.error("Error updating item status:", error);
    return false;
  }
}

/**
 * Admin function to permanently delete an item document.
 */
export async function deleteItem(itemId) {
    try {
        const itemRef = doc(db, "items", itemId);
        await deleteDoc(itemRef);
        return true;
    } catch (error) {
        console.error(`Error deleting item ${itemId}:`, error);
        return false;
    }
}

/**
 * Admin function to retrieve items matching a specific status (e.g., for review queues).
 */
export async function getItemsByStatusForAdmin(statusFilter) {
  try {
    const q = query(
      itemsRef, 
      where("status", "==", statusFilter), 
      orderBy("createdAt", "desc")
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch (err) {
    console.error("Error fetching admin items by status:", err);
    return [];
  }
}


/**
 * Public facing function to fetch only verified Lost Items.
 */
export async function getLostItems() {
  const q = query(
    itemsRef,
    where("status", "==", "active_lost"), 
    where("type", "==", "lost"),
    orderBy("createdAt", "desc")
  );
  try {
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch (error) {
      console.error("Error fetching lost items:", error);
      return []; 
  }
}

/**
 * Public facing function to fetch only verified Found Items.
 */
export async function getFoundItems() {
  const q = query(
    itemsRef,
    where("status", "==", "active_found"), 
    where("type", "==", "found"),
    orderBy("createdAt", "desc")
  );
  try {
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch (error) {
      console.error("Error fetching found items:", error);
      return []; 
  }
}