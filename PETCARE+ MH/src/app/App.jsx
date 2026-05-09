import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Header } from '../components/common/Header/Header.jsx';
import { Footer } from '../components/common/Footer/Footer.jsx';
// 1. IMPORT KHO DỮ LIỆU ĐÃ LƯU
import { SavedProvider } from '../context/SavedContext.jsx'; 

export function App() {
  const { pathname } = useLocation();

  // MỤC 3: Tự động cuộn lên đầu trang (0,0) mỗi khi đường dẫn thay đổi
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth' 
    });
  }, [pathname]);

  const isAuthPage = pathname === '/login';
  
  // MỤC 5: Mở rộng điều kiện hiển thị nền vàng
  const isYellowFooterPage = 
    pathname.startsWith('/products') || 
    pathname.startsWith('/orders') || 
    ['/cart', '/checkout', '/order-success', '/support', '/legal', '/warranty', '/vouchers', '/saved-products'].includes(pathname);

  return (
    /* 2. BỌC TOÀN BỘ ỨNG DỤNG TRONG SAVED PROVIDER */
    <SavedProvider>
      <div className={`app-shell${isYellowFooterPage ? ' app-shell--product' : ''}`}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '900px',
          background: 'linear-gradient(180deg, #FFF6CD 0%, rgba(255, 246, 205, 0.4) 50%, rgba(255, 246, 205, 0) 100%)',
          zIndex: -1,
          pointerEvents: 'none'
        }}></div>
        {!isAuthPage && <Header />}
        <main>
          <Outlet />
        </main>
        {!isAuthPage && <Footer />}
      </div>
    </SavedProvider>
  );
}