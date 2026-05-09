// =============================================
// ORDER SERVICE
// Xử lý toàn bộ logic liên quan đến đơn hàng với Firestore
// =============================================

import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  limit,
  where,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../config/firebase";

// Tên collection trong Firestore
const ORDERS_COLLECTION = "orders";

// --- LƯU ĐƠN HÀNG MỚI vào Firestore ---
export const saveOrder = async (orderData) => {
  const ordersRef = collection(db, ORDERS_COLLECTION);

  const docRef = await addDoc(ordersRef, {
    userId: orderData.userId || null,
    userEmail: orderData.userEmail || "",
    fullName: orderData.fullName,
    phone: orderData.phone,
    address: orderData.address,
    paymentMethod: orderData.paymentMethod,
    items: orderData.items, // Mảng sản phẩm đã mua
    total: orderData.total,
    status: "pending", // Trạng thái ban đầu: chờ xử lý
    createdAt: serverTimestamp(),
  });

  return docRef.id; // Trả về mã đơn hàng để hiển thị cho khách
};

// --- LẤY MỘT ĐƠN HÀNG THEO ID ---
export const getOrderById = async (orderId) => {
  const snap = await getDoc(doc(db, ORDERS_COLLECTION, orderId));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() };
};

// --- LẤY DANH SÁCH ĐƠN HÀNG (dùng cho admin) ---
export const getOrders = async (limitCount = 50) => {
  const q = query(
    collection(db, ORDERS_COLLECTION),
    orderBy("createdAt", "desc"),
    limit(limitCount),
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
};

// --- LẤY ĐƠN HÀNG CỦA MỘT USER (dùng cho trang lịch sử mua hàng) ---
// Dùng where đơn giản, tránh cần Composite Index; sort theo createdAt trong JS
export const getOrdersByUser = async (userId) => {
  const q = query(
    collection(db, ORDERS_COLLECTION),
    where("userId", "==", userId),
  );
  const snapshot = await getDocs(q);
  const docs = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
  return docs.sort((a, b) => {
    const ta = a.createdAt?.toMillis?.() ?? 0;
    const tb = b.createdAt?.toMillis?.() ?? 0;
    return tb - ta;
  });
};

// --- CẬP NHẬT TRẠNG THÁI ĐƠN HÀNG (dùng cho admin) ---
export const updateOrderStatus = async (orderId, newStatus) => {
  const orderRef = doc(db, ORDERS_COLLECTION, orderId);
  await updateDoc(orderRef, { status: newStatus });
};

export const deleteOrder = async (orderId) => {
  await deleteDoc(doc(db, ORDERS_COLLECTION, orderId));
};

// --- LẤY THỐNG KÊ ĐƠN HÀNG 30 NGÀY GẦN NHẤT (dùng cho biểu đồ) ---
export const getOrderStats = async () => {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const q = query(
    collection(db, ORDERS_COLLECTION),
    where("createdAt", ">=", thirtyDaysAgo),
    orderBy("createdAt", "asc"),
  );

  const snapshot = await getDocs(q);
  const orders = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));

  // Gom nhóm đơn hàng theo từng ngày
  const statsMap = {};
  orders.forEach((order) => {
    // Firestore Timestamp → JS Date → định dạng dd/MM
    const date = order.createdAt?.toDate?.() ?? new Date();
    const dayKey = `${date.getDate()}/${date.getMonth() + 1}`;

    if (!statsMap[dayKey]) {
      statsMap[dayKey] = { date: dayKey, orders: 0, revenue: 0 };
    }
    statsMap[dayKey].orders += 1;
    statsMap[dayKey].revenue += order.total || 0;
  });

  return Object.values(statsMap);
};
