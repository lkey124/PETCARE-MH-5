import { createBrowserRouter, Navigate } from 'react-router-dom';
import { App } from './App.jsx';
import { HomePage } from '../pages/HomePage/HomePage.jsx';
import { ProductListPage } from '../pages/ProductListPage/ProductListPage.jsx';
import { ProductDetailPage } from '../pages/ProductDetailPage/ProductDetailPage.jsx';
import { LoginPage } from '../pages/LoginPage/LoginPage.jsx';
import { AboutPage } from '../pages/AboutPage/AboutPage.jsx';
import CartPage from '../pages/CartPage/CartPage.jsx';
import CheckoutPage from '../pages/CheckoutPage/CheckoutPage.jsx';
import OrderSuccessPage from '../pages/OrderSuccessPage/OrderSuccessPage.jsx';
import MyOrdersPage from '../pages/MyOrdersPage/MyOrdersPage.jsx';
import OrderDetailPage from '../pages/OrderDetailPage/OrderDetailPage.jsx';

import SupportPage from '../pages/SupportPage/SupportPage.jsx';
import LegalPage from '../pages/LegalPage/LegalPage.jsx';
import WarrantyPage from '../pages/WarrantyPage/WarrantyPage.jsx';
import HelpCenterPage from '../pages/HelpCenterPage/HelpCenterPage';
import HelpTopicPage from '../pages/HelpCenterPage/HelpTopicPage';
import ServicePage from '../pages/ServicePage/ServicePage.jsx';
import ServiceSuccessPage from '../pages/ServicePage/ServiceSuccessPage.jsx';
import SavedProductsPage from '../pages/SavedProductsPage/SavedProductsPage.jsx';
import VoucherPage from '../pages/VoucherPage/VoucherPage.jsx';
import AccountSettingsPage from '../pages/AccountSettingsPage/AccountSettingsPage';

// Các trang admin
import AdminLayout from '../pages/AdminPage/AdminLayout.jsx';
import OrdersPage from '../pages/AdminPage/OrdersPage/OrdersPage.jsx';
import ProductsPage from '../pages/AdminPage/ProductsPage/ProductsPage.jsx';
import ProductFormPage from '../pages/AdminPage/ProductsPage/ProductFormPage.jsx';
import CustomersPage from '../pages/AdminPage/CustomersPage/CustomersPage.jsx';
import ReportsPage from '../pages/AdminPage/ReportsPage/ReportsPage.jsx';
import { ProtectedRoute } from '../components/common/ProtectedRoute/ProtectedRoute.jsx';

export const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <App />,
      children: [
        { index: true, element: <HomePage /> },
        { path: 'products', element: <ProductListPage /> },
        { path: 'products/:slug', element: <ProductDetailPage /> },
        { path: 'login', element: <LoginPage /> },
        { path: 'about', element: <AboutPage /> },
        { path: 'cart', element: <CartPage /> },
        { path: 'checkout', element: <CheckoutPage /> },
        { path: 'order-success', element: <OrderSuccessPage /> },
        { path: 'orders', element: <MyOrdersPage /> },
        { path: 'orders/:id', element: <OrderDetailPage /> },

        // Trang hỗ trợ và pháp lý
        { path: 'support', element: <SupportPage /> },
        { path: 'legal', element: <LegalPage /> },
        { path: 'warranty', element: <WarrantyPage /> },

        // Trung tâm trợ giúp
        { path: 'help-center', element: <HelpCenterPage /> },
        { path: 'help-center/:topicId', element: <HelpTopicPage /> },

        // Dịch vụ
        { path: 'services', element: <ServicePage /> },
        { path: 'services/success', element: <ServiceSuccessPage /> },

        // Trang người dùng
        { path: 'saved-products', element: <SavedProductsPage /> },
        { path: 'vouchers', element: <VoucherPage /> },
        { path: 'settings', element: <AccountSettingsPage /> },
      ],
    },
    {
      // Trang admin nằm riêng ngoài App shell, không có Header/Footer
      // Bọc trong ProtectedRoute để chỉ admin mới vào được
      path: '/admin',
      element: (
        <ProtectedRoute>
          <AdminLayout />
        </ProtectedRoute>
      ),
      children: [
        { index: true, element: <Navigate to="/admin/orders" replace /> },
        { path: 'orders', element: <OrdersPage /> },
        { path: 'products', element: <ProductsPage /> },
        { path: 'products/new', element: <ProductFormPage /> },
        { path: 'products/edit/:id', element: <ProductFormPage /> },
        { path: 'customers', element: <CustomersPage /> },
        { path: 'reports', element: <ReportsPage /> },
      ],
    },
  ],
  {
    basename: '/PETCARE-MH-5',
  }
);
