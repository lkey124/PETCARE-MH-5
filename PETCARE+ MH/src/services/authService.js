// =============================================
// AUTH SERVICE
// Tập trung toàn bộ logic xác thực ở đây
// Các component chỉ gọi hàm, không import Firebase trực tiếp
// =============================================

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../config/firebase";

// Tạo profile người dùng trong Firestore sau khi đăng ký
// role: 1 = user thường, role: 0 = admin
const createUserProfile = async (uid, email, fullName = "", phone = "") => {
  const userRef = doc(db, "users", uid);
  await setDoc(userRef, {
    email,
    fullName,
    phone,
    role: 1, // Mặc định là user thường, đổi sang 0 trong Firestore để cấp admin
    createdAt: serverTimestamp(),
  });
};

// --- ĐĂNG KÝ bằng email và mật khẩu ---
export const registerWithEmail = async (
  email,
  password,
  fullName = "",
  phone = "",
) => {
  const result = await createUserWithEmailAndPassword(auth, email, password);
  // Tạo thêm profile trong Firestore kèm thông tin cá nhân
  await createUserProfile(result.user.uid, email, fullName, phone);
  return result.user;
};

// --- Lấy thông tin profile người dùng từ Firestore ---
export const getUserProfile = async (uid) => {
  const userSnap = await getDoc(doc(db, "users", uid));
  return userSnap.exists() ? userSnap.data() : null;
};

// --- ĐĂNG NHẬP bằng email và mật khẩu ---
export const loginWithEmail = async (email, password) => {
  const result = await signInWithEmailAndPassword(auth, email, password);
  return result.user;
};

// --- ĐĂNG NHẬP bằng Google ---
export const loginWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);

  // Chỉ tạo profile nếu là lần đầu đăng nhập
  const userRef = doc(db, "users", result.user.uid);
  const userSnap = await getDoc(userRef);
  if (!userSnap.exists()) {
    await createUserProfile(result.user.uid, result.user.email);
  }

  return result.user;
};

// --- ĐĂNG XUẤT ---
export const logout = () => signOut(auth);

// --- Kiểm tra user có phải admin không ---
// role === 0 → admin, role === 1 → user thường
export const checkIsAdmin = async (uid) => {
  const userRef = doc(db, "users", uid);
  const userSnap = await getDoc(userRef);
  return userSnap.exists() ? userSnap.data().role === 0 : false;
};
