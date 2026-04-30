import 'styles/App.css';
import 'styles/index.css';
import 'assets/styles/_colors.css';
import 'assets/styles/_animations.css';

import { useEffect, lazy, Suspense } from 'react';
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
import LoginPage from './pages/Login/LoginPage';
import RegisterPage from './pages/Register/RegisterPage';

const About = lazy(() => import('src/pages/About/About'));
const Menus = lazy(() => import('pages/Menu/Menus'));
const Recruitment = lazy(() => import('pages/Recruitment'));
const Shop = lazy(() => import('pages/Shop/Shop'));
const ProductPage = lazy(() => import('pages/Shop/ProductPage'));
const Blog = lazy(() => import('pages/Blog'));
const Cart = lazy(() => import('./pages/Cart/Cart'));
const Checkout = lazy(() => import('pages/Checkout/Checkout'));
const OrderSuccess = lazy(() => import('pages/Checkout/OrderSuccess'));
const OrderPendingPayment = lazy(() => import('pages/Checkout/OrderPendingPayment'));

const AccountManager = lazy(() => import('src/pages/Account/AccountManager'));
const UserOrderDetails = lazy(() => import('./pages/Account/UserOrderDetails'));

const AdminLayout = lazy(() => import("src/pages/Admin/AdminLayout"));
const Dashboard = lazy(() => import("src/pages/Admin/Components/Dashboard"));
const Products = lazy(() => import("src/pages/Admin/Components/Inventory"));
const AdminOrders = lazy(() => import('./pages/Admin/Components/Orders'));
const OrderDetails = lazy(() => import('./pages/Admin/Components/OrderDetails'));
const Users = lazy(() => import('./pages/Admin/Components/Users'));
const UserDetails = lazy(() => import('./pages/Admin/Components/UserDetails'));
const AdminDeliveries = lazy(() => import('./pages/Admin/Components/AdminDeliveries'));

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-4 animate-in fade-in duration-300">
        <div className="w-10 h-10 border-3 border-white/20 border-t-(--medium-shade) rounded-full animate-spin"></div>
      </div>
    </div>
  );
}

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
        <Routes location={location}>
          <Route path="" element={<LayoutWrapper><Layout /></LayoutWrapper>}>
            
            <Route index element={<PageWrapper><Home /></PageWrapper>} />
            <Route path="login" element={<PageWrapper><LoginPage /></PageWrapper>} />
            <Route path="register" element={<PageWrapper><RegisterPage /></PageWrapper>} />

            <Route path="about" element={<Suspense fallback={<PageLoader />}><PageWrapper><About /></PageWrapper></Suspense>} />
            <Route path="menu" element={<Suspense fallback={<PageLoader />}><PageWrapper><Menus /></PageWrapper></Suspense>} />
            <Route path="recruitment" element={<Suspense fallback={<PageLoader />}><PageWrapper><Recruitment /></PageWrapper></Suspense>} />
            
            <Route path="shop" element={<Suspense fallback={<PageLoader />}><PageWrapper><Shop /></PageWrapper></Suspense>} />
            <Route path="shop/:id" element={<Suspense fallback={<PageLoader />}><PageWrapper animation="slideRight"><ProductPage /></PageWrapper></Suspense>} />
            
            <Route path="blog" element={<Suspense fallback={<PageLoader />}><PageWrapper><Blog /></PageWrapper></Suspense>} />
            <Route path="cart" element={<Suspense fallback={<PageLoader />}><PageWrapper><Cart /></PageWrapper></Suspense>} />
            <Route path="order-success" element={<Suspense fallback={<PageLoader />}><PageWrapper><OrderSuccess /></PageWrapper></Suspense>} />
            <Route path="order-pending" element={
              <ProtectedRoute>
                <Suspense fallback={<PageLoader />}><PageWrapper><OrderPendingPayment /></PageWrapper></Suspense>
              </ProtectedRoute>
            } />
            
            <Route path="checkout" element={
              <ProtectedRoute>
                <Suspense fallback={<PageLoader />}><PageWrapper animation="slideRight"><Checkout /></PageWrapper></Suspense>
              </ProtectedRoute>
            } />
            
            <Route path="admin" element={
              <AdminRoute>
                <Suspense fallback={<PageLoader />}>
                  <PageWrapper>
                    <AdminLayout />
                  </PageWrapper>
                </Suspense>
              </AdminRoute>
            }>
              <Route index element={<Suspense fallback={<PageLoader />}><PageWrapper><Dashboard /></PageWrapper></Suspense>} />
              <Route path="orders" element={<Suspense fallback={<PageLoader />}><PageWrapper><AdminOrders /></PageWrapper></Suspense>} />
              <Route path="orders/:id" element={<Suspense fallback={<PageLoader />}><PageWrapper animation="slideRight"><OrderDetails /></PageWrapper></Suspense>} />
              
              <Route path="products" element={<SuperAdminRoute><Suspense fallback={<PageLoader />}><PageWrapper><Products /></PageWrapper></Suspense></SuperAdminRoute>} />
              <Route path="deliveries" element={<SuperAdminRoute><Suspense fallback={<PageLoader />}><PageWrapper><AdminDeliveries /></PageWrapper></Suspense></SuperAdminRoute>} />
              <Route path="users" element={<SuperAdminRoute><Suspense fallback={<PageLoader />}><PageWrapper><Users /></PageWrapper></Suspense></SuperAdminRoute>} />
              <Route path="users/:id" element={<SuperAdminRoute><Suspense fallback={<PageLoader />}><PageWrapper animation="slideRight"><UserDetails /></PageWrapper></Suspense></SuperAdminRoute>} />
            </Route>
            
            <Route path="account" element={
              <ProtectedRoute>
                <Suspense fallback={<PageLoader />}><PageWrapper><AccountManager /></PageWrapper></Suspense>
              </ProtectedRoute>
            } />
            
            <Route path="account/orders/:id" element={
              <ProtectedRoute>
                <Suspense fallback={<PageLoader />}><PageWrapper animation="slideRight"><UserOrderDetails /></PageWrapper></Suspense>
              </ProtectedRoute>
            } />

            <Route path="*" element={<h1>404 - Page not found</h1>} />
          </Route>
        </Routes>
      </AnimatePresence>
    </ViewportProvider>
  );
}