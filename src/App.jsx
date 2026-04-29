import 'styles/App.css';
import 'styles/index.css';
import 'assets/styles/_colors.css';
import 'assets/styles/_animations.css';

import { useEffect } from 'react';
import { Routes, Route, useLocation, Outlet, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import { ViewportProvider } from 'src/context/Viewport/ViewportProvider';
import { useAuth } from 'src/context/AuthProvider';
import { PageWrapper, LayoutWrapper } from 'components/layout/PageWrappers';

import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import ScrollButton from './components/ui/ScrollButton';
import ProtectedRoute from './components/auth/ProtectedRoute';

import Home from 'pages/Home';
import About from 'src/pages/About/About';
import Menus from 'pages/Menu/Menus';
import Recruitment from 'pages/Recruitment';
import Shop from 'pages/Shop/Shop';
import ProductPage from 'pages/Shop/ProductPage';
import Blog from 'pages/Blog';
import Cart from './pages/Cart/Cart';
import Checkout from 'pages/Checkout/Checkout';
import OrderSuccess from 'pages/Checkout/OrderSuccess';
import OrderPendingPayment from 'pages/Checkout/OrderPendingPayment';

import LoginPage from './pages/Login/LoginPage';
import RegisterPage from './pages/Register/RegisterPage'; 
import AccountManager from 'src/pages/Account/AccountManager';
import UserOrderDetails from './pages/Account/UserOrderDetails';

import AdminLayout from "src/pages/Admin/AdminLayout"; 
import Dashboard from "src/pages/Admin/Components/Dashboard";
import Products from "src/pages/Admin/Components/Inventory";
import AdminOrders from './pages/Admin/Components/Orders';
import OrderDetails from './pages/Admin/Components/OrderDetails';
import Users from './pages/Admin/Components/Users';
import UserDetails from './pages/Admin/Components/UserDetails';
import AdminDeliveries from './pages/Admin/Components/AdminDeliveries';

function Layout() {
  return (
    <>
      <Header />
      <Outlet />
      <ScrollButton />
      <Footer />
    </>
  );
}

const AdminRoute = ({ children }) => {
  const { isAdmin, loading } = useAuth();
  if (loading) return null;
  if (!isAdmin) return <Navigate to="/login" />;
  return children;
};

const SuperAdminRoute = ({ children }) => {
  const { isSuperAdmin, loading } = useAuth();
  if (loading) return null;
  if (!isSuperAdmin) return <Navigate to="/admin" />;
  return children;
};

export default function App() {
  const location = useLocation();

  useEffect(() => {
    if (location.pathname !== '/checkout' && location.pathname !== '/order-success' && location.pathname !== '/order-pending') {
      const expiryString = localStorage.getItem('somnium_checkout_expires');
      const sessionId = localStorage.getItem('somnium_session_id');

      if (expiryString && sessionId) {
        fetch('http://localhost:5000/api/reservations/release-checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId }),
          keepalive: true
        }).catch(console.error);

        localStorage.removeItem('somnium_checkout_expires');
      }
    }
  },[location.pathname]);

  return (
    <ViewportProvider>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="" element={<LayoutWrapper><Layout /></LayoutWrapper>}>
            
            <Route index element={<PageWrapper><Home /></PageWrapper>} />
            <Route path="login" element={<PageWrapper><LoginPage /></PageWrapper>} />
            <Route path="register" element={<PageWrapper><RegisterPage /></PageWrapper>} />
            <Route path="about" element={<PageWrapper><About /></PageWrapper>} />
            <Route path="menu" element={<PageWrapper><Menus /></PageWrapper>} />
            <Route path="recruitment" element={<PageWrapper><Recruitment /></PageWrapper>} />
            
            <Route path="shop" element={<PageWrapper><Shop /></PageWrapper>} />
            <Route path="shop/:id" element={<PageWrapper><ProductPage /></PageWrapper>} />
            
            <Route path="blog" element={<PageWrapper><Blog /></PageWrapper>} />
            <Route path="cart" element={<PageWrapper><Cart /></PageWrapper>} />
            <Route path="order-success" element={<PageWrapper><OrderSuccess /></PageWrapper>} />
            <Route path="order-pending" element={
              <ProtectedRoute>
                <PageWrapper><OrderPendingPayment /></PageWrapper>
              </ProtectedRoute>
            } />
            
            <Route path="checkout" element={
              <ProtectedRoute>
                <PageWrapper><Checkout /></PageWrapper>
              </ProtectedRoute>
            } />
            
            <Route path="admin" element={
              <AdminRoute>
                <PageWrapper>
                  <AdminLayout />
                </PageWrapper>
              </AdminRoute>
            }>
              <Route index element={<PageWrapper><Dashboard /></PageWrapper>} />
              <Route path="orders" element={<PageWrapper><AdminOrders /></PageWrapper>} />
              <Route path="orders/:id" element={<PageWrapper><OrderDetails /></PageWrapper>} />
              
              <Route path="products" element={<SuperAdminRoute><PageWrapper><Products /></PageWrapper></SuperAdminRoute>} />
              <Route path="deliveries" element={<SuperAdminRoute><PageWrapper><AdminDeliveries /></PageWrapper></SuperAdminRoute>} />
              <Route path="users" element={<SuperAdminRoute><PageWrapper><Users /></PageWrapper></SuperAdminRoute>} />
              <Route path="users/:id" element={<SuperAdminRoute><PageWrapper><UserDetails /></PageWrapper></SuperAdminRoute>} />
            </Route>
            
            <Route path="account" element={
              <ProtectedRoute>
                <PageWrapper><AccountManager /></PageWrapper>
              </ProtectedRoute>
            } />
            
            <Route path="account/orders/:id" element={
              <ProtectedRoute>
                <PageWrapper><UserOrderDetails /></PageWrapper>
              </ProtectedRoute>
            } />

            <Route path="*" element={<h1>404 - Page not found</h1>} />
          </Route>
        </Routes>
      </AnimatePresence>
    </ViewportProvider>
  );
}