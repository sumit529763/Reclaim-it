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
  orderBy,
} from "firebase/firestore";
const itemsRef = collection(db, "items");
export async function createItem(payload) {
  return addDoc(itemsRef, {
    ...payload,
    status: "in_review",
    createdAt: serverTimestamp(),
  });
}
export async function getMyItems(userId) {
  const q = query(itemsRef, where("ownerId", "==", userId));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}
export async function getDashboardStats(userId) {
  const q = query(itemsRef, where("ownerId", "==", userId));
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
//Fetch LOST items only
// export async function getLostItems() {
//   const q = query(
//     itemsRef,
//     where("type", "==", "lost"),
//     orderBy("createdAt", "desc")
//   );
//   const snap = await getDocs(q);
//   return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
// } 

// ✅ Fetch LOST items only
export async function getLostItems() {
  const q = query(
    itemsRef,
    where("type", "==", "lost"),
    orderBy("createdAt", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

// ✅ Fetch FOUND items only
export async function getFoundItems() {
  const q = query(
    itemsRef,
    where("type", "==", "found"),
    orderBy("createdAt", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}
