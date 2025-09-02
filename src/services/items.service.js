import { db } from "@/lib/firebase/firebase";
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
