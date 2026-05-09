// =============================================
// CẤU HÌNH FIREBASE
// Đọc toàn bộ thông tin từ biến môi trường .env
// Không bao giờ hard-code API key trực tiếp vào đây
// =============================================

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Lấy config từ file .env (Vite yêu cầu prefix VITE_)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Khởi tạo ứng dụng Firebase (chỉ chạy 1 lần)
const app = initializeApp(firebaseConfig);

// Các dịch vụ Firebase sẽ dùng trong dự án
export const auth = getAuth(app); // Xác thực người dùng
export const db = getFirestore(app); // Cơ sở dữ liệu Firestore
export const storage = getStorage(app); // Lưu trữ file (ảnh sản phẩm)
