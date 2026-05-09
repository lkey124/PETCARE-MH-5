import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Plus, Trash2, Upload } from "lucide-react";
import { addProduct, getProductById, updateProduct } from "../../../services/productService";
import { Toast } from "../../../components/common/Toast/Toast";
import { categories as categoryList } from "../../../data/categories";
import "../AdminLayout.css";
import "./ProductFormPage.css";

const BADGE_OPTIONS = [
  { label: "Không có",  value: "",          tone: "" },
  { label: "Bán chạy", value: "Bán chạy",  tone: "sale" },
  { label: "Yêu thích", value: "Yêu thích", tone: "fav" },
  { label: "Mới nhất", value: "Mới nhất",  tone: "new" },
];

function toSlug(str) {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

const FALLBACK_DESCRIPTION = [
  'Thiết kế tối ưu cho gia đình nuôi thú cưng trong căn hộ hiện đại, tiết kiệm thời gian chăm sóc mà vẫn đảm bảo thú cưng luôn được chăm sóc đầy đủ.',
  'Chất liệu cao cấp, bền bỉ, dễ vệ sinh và an toàn cho vật nuôi. Các bộ phận tiếp xúc thức ăn/nước đều được làm từ vật liệu thực phẩm an toàn.',
  'Kết nối ứng dụng PetCare+ để theo dõi từ xa, điều chỉnh lịch trình và nhận cảnh báo tức thì ngay trên điện thoại.',
  'Công nghệ AI tích hợp giúp nhận diện thói quen ăn uống, tự động điều chỉnh khẩu phần phù hợp với từng giai đoạn phát triển của thú cưng.',
  'Bảo hành chính hãng 12 tháng, hỗ trợ kỹ thuật 24/7 và giao hàng nhanh toàn quốc.',
];

const DEFAULT_SPECS = [
  ['Hãng', 'Pet Care+'],
  ['Xuất xứ', 'Việt Nam'],
  ['Tình trạng', 'Hàng mới 100%'],
  ['Bảo hành', '12 tháng'],
  ['Điều khiển', 'Nút bấm vật lý và ứng dụng di động'],
  ['Nguồn điện', 'Adapter chính hãng'],
  ['Kết nối', 'Wi-Fi 2.4GHz + Bluetooth'],
  ['Ngôn ngữ', 'Tiếng Việt'],
  ['Khối lượng', 'Xem hướng dẫn sản phẩm'],
  ['Phụ kiện kèm theo', 'Adapter, sách hướng dẫn, dây cáp USB'],
];

const EMPTY_FORM = {
  title: "",
  slug: "",
  subtitle: "",
  category: "",
  categoryId: "",
  price: "",
  stock: "",
  badge: "",
  badgeTone: "",
  rating: "",
  reviews: "",
  image: "",
  gallery: [],
  description: [],
  specs: [["", ""]],
};

export default function ProductFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState(EMPTY_FORM);
  const [descText, setDescText] = useState("");
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({ msg: "", type: "success", key: 0 });

  const mainImgRef = useRef(null);
  const galleryImgRef = useRef(null);
  const [uploadingMain, setUploadingMain] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);

  const showToast = (msg, type = "success") =>
    setToast((t) => ({ msg, type, key: t.key + 1 }));

  useEffect(() => {
    if (!isEdit) return;
    getProductById(id)
      .then((p) => {
        if (!p) { navigate("/admin/products"); return; }
        setForm({
          title:      p.title      || "",
          slug:       p.slug       || "",
          subtitle:   p.subtitle   || "",
          category:   p.category   || "",
          categoryId: p.categoryId || "",
          price:      p.price      || "",
          stock:      p.stock ?? "",
          badge:      p.badge      || "",
          badgeTone:  p.badgeTone  || "",
          rating:     p.rating     || "",
          reviews:    p.reviews    || "",
          image:      p.image      || "",
          gallery:    Array.isArray(p.gallery) ? p.gallery : [],
          description: Array.isArray(p.description) && p.description.length ? p.description : FALLBACK_DESCRIPTION,
          specs: (() => {
            const raw = p.specs;
            if (!Array.isArray(raw) || !raw.length) return DEFAULT_SPECS;
            // Ho tro ca hai dinh dang: [{key,value}] va [[key,value]]
            if (raw[0] && typeof raw[0] === 'object' && !Array.isArray(raw[0])) {
              return raw.map(s => [s.key || '', s.value || '']);
            }
            return raw;
          })(),
        });
        const desc = Array.isArray(p.description) && p.description.length
          ? p.description
          : FALLBACK_DESCRIPTION;
        setDescText(desc.join("\n\n"));
      })
      .catch(() => showToast("Không tải được sản phẩm", "error"))
      .finally(() => setLoading(false));
  }, [id, isEdit, navigate]);

  // --- Image upload helpers ---
  function uploadImage(file, onDone, setUploading) {
    if (!file) return;
    setUploading(true);
    const reader = new FileReader();
    reader.onload = (e) => { onDone(e.target.result); setUploading(false); };
    reader.onerror = () => { showToast("Tải ảnh thất bại", "error"); setUploading(false); };
    reader.readAsDataURL(file);
  }

  // --- Specs helpers ---
  const updateSpec = (i, col, val) =>
    setForm((f) => {
      const specs = f.specs.map((row, idx) =>
        idx === i ? (col === 0 ? [val, row[1]] : [row[0], val]) : row
      );
      return { ...f, specs };
    });

  const addSpec = () => setForm((f) => ({ ...f, specs: [...f.specs, ["", ""]] }));
  const removeSpec = (i) =>
    setForm((f) => ({ ...f, specs: f.specs.filter((_, idx) => idx !== i) }));

  // --- Gallery helpers ---
  const removeGalleryImg = (i) =>
    setForm((f) => ({ ...f, gallery: f.gallery.filter((_, idx) => idx !== i) }));

  // --- Save ---
  const handleSave = async () => {
    if (!form.title.trim() || !form.category.trim() || !form.price) {
      showToast("Vui lòng điền đầy đủ Tên, Danh mục và Giá", "error");
      return;
    }
    setSaving(true);
    const stockNum = form.stock !== "" ? Number(form.stock) : null;
    const inStock  = stockNum === null ? true : stockNum > 0;
    const autoSlug = form.slug.trim() || toSlug(form.title);
    const cleanSpecs = form.specs
      .filter(([k]) => k.trim() !== "")
      .map(([k, v]) => ({ key: k, value: v })); 
    const cleanDesc  = descText
      .split(/\n{2,}/)
      .map((s) => s.trim())
      .filter(Boolean);

    const data = {
      ...form,
      slug:        autoSlug,
      price:       Number(form.price),
      stock:       stockNum,
      inStock,
      rating:      form.rating  !== "" ? Number(form.rating)  : null,
      reviews:     form.reviews !== "" ? Number(form.reviews) : null,
      description: cleanDesc,
      specs:       cleanSpecs,
    };

    try {
      if (isEdit) {
        await updateProduct(id, data);
        showToast("Cập nhật sản phẩm thành công");
      } else {
        await addProduct(data);
        showToast("Thêm sản phẩm thành công");
      }
      setTimeout(() => navigate("/admin/products"), 900);
    } catch {
      showToast("Có lỗi xảy ra, thử lại sau", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="admin-loading">Đang tải...</p>;

  return (
    <div className="pf-page">
      <Toast key={toast.key} message={toast.msg} type={toast.type} visible={true} />

      {/* Header */}
      <div className="admin-page-header">
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button className="pf-back-btn" onClick={() => navigate("/admin/products")}>
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1>{isEdit ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}</h1>
            <p>{isEdit ? "Cập nhật thông tin và nội dung sản phẩm." : "Điền đầy đủ thông tin để tạo sản phẩm mới."}</p>
          </div>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button className="btn-outline-admin" onClick={() => navigate("/admin/products")}>Hủy</button>
          <button className="btn-primary-admin" onClick={handleSave} disabled={saving}>
            {saving ? "Đang lưu..." : isEdit ? "Lưu thay đổi" : "Thêm sản phẩm"}
          </button>
        </div>
      </div>

      <div className="pf-layout">
        {/* ===== CỘT TRÁI ===== */}
        <div className="pf-main">

          {/* Thông tin cơ bản */}
          <div className="pf-card">
            <h2 className="pf-card__title">Thông tin cơ bản</h2>
            <div className="form-row">
              <label>Tên sản phẩm *</label>
              <input className="form-input" value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                placeholder="VD: Máy cho ăn tự động Petkit Yumshare Solo" />
            </div>
            <div className="form-row">
              <label>Slug (URL)</label>
              <input className="form-input" value={form.slug}
                onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                placeholder="Tự tạo từ tên nếu để trống" />
            </div>
            <div className="form-row">
              <label>Mô tả ngắn</label>
              <input className="form-input" value={form.subtitle}
                onChange={(e) => setForm((f) => ({ ...f, subtitle: e.target.value }))}
                placeholder="VD: Máy cho ăn thông minh không dây Petkit" />
            </div>
            <div className="form-row-2col">
              <div className="form-row">
                <label>Danh mục *</label>
                <select className="form-input" value={form.categoryId}
                  onChange={(e) => {
                    const cat = categoryList.find((c) => c.id === e.target.value);
                    setForm((f) => ({ ...f, categoryId: e.target.value, category: cat ? cat.name : "" }));
                  }}>
                  <option value="">-- Chọn danh mục --</option>
                  {categoryList.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="form-row">
                <label>Giá bán (VNĐ) *</label>
                <input className="form-input" type="number" min="0" value={form.price}
                  onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                  placeholder="350000" />
              </div>
            </div>
            <div className="form-row-2col">
              <div className="form-row">
                <label>Tồn kho</label>
                <input className="form-input" type="number" min="0" value={form.stock}
                  onChange={(e) => setForm((f) => ({ ...f, stock: e.target.value }))}
                  placeholder="0" />
              </div>
              <div className="form-row">
                <label>Nhãn sản phẩm</label>
                <select className="form-input" value={form.badge}
                  onChange={(e) => {
                    const opt = BADGE_OPTIONS.find((o) => o.value === e.target.value);
                    setForm((f) => ({ ...f, badge: e.target.value, badgeTone: opt ? opt.tone : "" }));
                  }}>
                  {BADGE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
            </div>
            <div className="form-row-2col">
              <div className="form-row">
                <label>Đánh giá (0–5)</label>
                <input className="form-input" type="number" min="0" max="5" step="0.1" value={form.rating}
                  onChange={(e) => setForm((f) => ({ ...f, rating: e.target.value }))}
                  placeholder="4.8" />
              </div>
              <div className="form-row">
                <label>Số lượt đánh giá</label>
                <input className="form-input" type="number" min="0" value={form.reviews}
                  onChange={(e) => setForm((f) => ({ ...f, reviews: e.target.value }))}
                  placeholder="1345" />
              </div>
            </div>
          </div>

          {/* Mô tả chi tiết */}
          <div className="pf-card">
            <h2 className="pf-card__title">Mô tả chi tiết</h2>
            <p className="pf-card__hint">Mỗi đoạn cách nhau một dòng trống sẽ hiển thị thành đoạn riêng biệt trên trang sản phẩm.</p>
            <textarea
              className="form-input pf-textarea"
              value={descText}
              onChange={(e) => setDescText(e.target.value)}
              rows={8}
              placeholder={"Thiết kế tối ưu cho gia đình nuôi thú cưng trong căn hộ hiện đại.\n\nChất liệu cao cấp, bền bỉ, dễ vệ sinh và an toàn cho vật nuôi.\n\nKết nối ứng dụng PetCare+ để theo dõi từ xa và nhận cảnh báo tức thì."}
            />
          </div>

          {/* Thông số kỹ thuật */}
          <div className="pf-card">
            <div className="pf-card__titlerow">
              <h2 className="pf-card__title">Thông số kỹ thuật</h2>
              <button type="button" className="pf-add-spec-btn" onClick={addSpec}>
                <Plus size={14} /> Thêm dòng
              </button>
            </div>
            <div className="pf-specs-list">
              <div className="pf-specs-header">
                <span>Tên thông số</span>
                <span>Giá trị</span>
              </div>
              {form.specs.map(([k, v], i) => (
                <div key={i} className="pf-spec-row">
                  <input className="form-input" value={k}
                    onChange={(e) => updateSpec(i, 0, e.target.value)}
                    placeholder="VD: Hãng" />
                  <input className="form-input" value={v}
                    onChange={(e) => updateSpec(i, 1, e.target.value)}
                    placeholder="VD: Petkit" />
                  <button type="button" className="pf-remove-spec" onClick={() => removeSpec(i)}
                    disabled={form.specs.length === 1}>
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ===== CỘT PHẢI ===== */}
        <div className="pf-side">

          {/* Hình ảnh chính */}
          <div className="pf-card">
            <h2 className="pf-card__title">Hình ảnh chính</h2>
            <div className="pf-main-img-wrap">
              {form.image ? (
                <img src={form.image} alt="" className="pf-main-img-preview"
                  onError={(e) => { e.target.style.display = "none"; }} />
              ) : (
                <div className="pf-img-placeholder">Chưa có ảnh</div>
              )}
            </div>
            <div className="image-upload-row" style={{ marginTop: 10 }}>
              <input className="form-input" value={form.image}
                onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))}
                placeholder="/images/products/san-pham.png" />
              <button type="button" className="btn-upload-img"
                onClick={() => mainImgRef.current?.click()} disabled={uploadingMain}>
                <Upload size={15} />{uploadingMain ? "Đang tải..." : "Tải ảnh"}
              </button>
              <input ref={mainImgRef} type="file" accept="image/*" style={{ display: "none" }}
                onChange={(e) => uploadImage(e.target.files?.[0],
                  (url) => setForm((f) => ({ ...f, image: url })), setUploadingMain)} />
            </div>
          </div>

          {/* Gallery ảnh phụ */}
          <div className="pf-card">
            <h2 className="pf-card__title">Gallery ảnh phụ</h2>
            <p className="pf-card__hint">Các ảnh hiển thị trong phần thumbnail khi xem chi tiết sản phẩm.</p>
            <div className="pf-gallery-grid">
              {form.gallery.map((url, i) => (
                <div key={i} className="pf-gallery-item">
                  <img src={url} alt="" onError={(e) => { e.target.style.display = "none"; }} />
                  <button type="button" className="pf-gallery-remove" onClick={() => removeGalleryImg(i)}>
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}
              <button type="button" className="pf-gallery-add"
                onClick={() => galleryImgRef.current?.click()} disabled={uploadingGallery}>
                {uploadingGallery ? "..." : <><Plus size={20} /><span>Thêm ảnh</span></>}
              </button>
            </div>
            <input ref={galleryImgRef} type="file" accept="image/*" style={{ display: "none" }}
              onChange={(e) =>
                uploadImage(e.target.files?.[0],
                  (url) => setForm((f) => ({ ...f, gallery: [...f.gallery, url] })),
                  setUploadingGallery)
              }
            />
            <div className="pf-gallery-url-row">
              <input className="form-input" placeholder="Hoặc nhập URL ảnh phụ..."
                onKeyDown={(e) => {
                  if (e.key === "Enter" && e.target.value.trim()) {
                    setForm((f) => ({ ...f, gallery: [...f.gallery, e.target.value.trim()] }));
                    e.target.value = "";
                  }
                }} />
              <span className="pf-gallery-url-hint">Nhấn Enter để thêm</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom save bar */}
      <div className="pf-bottom-bar">
        <button className="btn-outline-admin" onClick={() => navigate("/admin/products")}>Hủy bỏ</button>
        <button className="btn-primary-admin" onClick={handleSave} disabled={saving}>
          {saving ? "Đang lưu..." : isEdit ? "Lưu thay đổi" : "Thêm sản phẩm"}
        </button>
      </div>
    </div>
  );
}
