import {
  collection,
  getDocs,
  query,
  orderBy,
  limit,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../config/firebase";

export async function getUsers(limitCount = 100) {
  const q = query(
    collection(db, "users"),
    orderBy("createdAt", "desc"),
    limit(limitCount),
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

export async function addUser(data) {
  const ref = await addDoc(collection(db, "users"), {
    fullName: data.fullName || "",
    email: data.email || "",
    phone: data.phone || "",
    role: Number(data.role ?? 1),
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateUser(userId, data) {
  await updateDoc(doc(db, "users", userId), {
    fullName: data.fullName || "",
    phone: data.phone || "",
    role: Number(data.role ?? 1),
  });
}

export async function deleteUser(userId) {
  await deleteDoc(doc(db, "users", userId));
}
