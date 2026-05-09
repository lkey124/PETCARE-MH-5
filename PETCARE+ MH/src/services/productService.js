import {
  collection,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../config/firebase";
import { products as seedData } from "../data/products";

const COL = "products";

// === THÊM BIẾN NÀY ĐỂ LÀM CHỐT CHẶN ===
let isSeeding = false; 
// =====================================

/**
 * Lấy danh sách sản phẩm. 
 * Nếu Database trống, sẽ tự động đổ dữ liệu mẫu (seed data).
 */
export async function getProducts() {
  try {
    const snap = await getDocs(collection(db, COL));
    
    // Nếu đã có dữ liệu trong Firestore, trả về danh sách đó
    if (!snap.empty) {
      return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    }

    // === THÊM ĐOẠN KIỂM TRA NÀY ===
    // Nếu đang trong quá trình đẩy dữ liệu rồi thì chặn lại luôn, trả về mảng rỗng tạm thời
    if (isSeeding) {
      console.log("Đang tiến hành seed dữ liệu, chặn tiến trình trùng lặp...");
      return []; 
    }
    // Bật chốt chặn
    isSeeding = true;
    // ===============================

    console.log("Database trống. Bắt đầu đẩy dữ liệu mẫu...");

    // --- LOGIC SEEDING DỮ LIỆU (Khi Firestore trống) ---
    await Promise.all(
      seedData.map(({ id, ...rest }) => {
        const cleanData = {};
        
        Object.keys(rest).forEach((key) => {
          if (Array.isArray(rest[key])) {
            cleanData[key] = rest[key].flat();
          } else {
            cleanData[key] = rest[key];
          }
        });

        return addDoc(collection(db, COL), { 
          ...cleanData, 
          inStock: true,
          createdAt: new Date().toISOString() 
        });
      })
    );

    // Tắt chốt chặn sau khi hoàn thành
    isSeeding = false;
    console.log("Đã đẩy xong dữ liệu mẫu!");

    // Lấy lại dữ liệu sau khi đã seed thành công
    const snap2 = await getDocs(collection(db, COL));
    return snap2.docs.map((d) => ({ id: d.id, ...d.data() }));
    
  } catch (error) {
    // Nếu có lỗi cũng phải tắt chốt chặn để sau này còn chạy lại được
    isSeeding = false; 
    console.error("Lỗi khi lấy danh sách sản phẩm:", error);
    throw error;
  }
}

/**
 * Thêm một sản phẩm mới thủ công
 */
export async function addProduct(data) {
  try {
    return await addDoc(collection(db, COL), data);
  } catch (error) {
    console.error("Lỗi khi thêm sản phẩm:", error);
    throw error;
  }
}

/**
 * Lấy chi tiết một sản phẩm theo ID
 */
export async function getProductById(id) {
  try {
    const snap = await getDoc(doc(db, COL, id));
    if (!snap.exists()) return null;
    return { id: snap.id, ...snap.data() };
  } catch (error) {
    console.error("Lỗi khi lấy chi tiết sản phẩm:", error);
    throw error;
  }
}

/**
 * Cập nhật thông tin sản phẩm
 */
export async function updateProduct(id, data) {
  try {
    const productRef = doc(db, COL, id);
    return await updateDoc(productRef, data);
  } catch (error) {
    console.error("Lỗi khi cập nhật sản phẩm:", error);
    throw error;
  }
}

/**
 * Xóa sản phẩm
 */
export async function deleteProduct(id) {
  try {
    const productRef = doc(db, COL, id);
    return await deleteDoc(productRef);
  } catch (error) {
    console.error("Lỗi khi xóa sản phẩm:", error);
    throw error;
  }
}