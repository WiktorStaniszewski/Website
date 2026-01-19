import 'styles/App.css';
import 'styles/index.css';
import 'assets/styles/_colors.css';
import 'assets/styles/_animations.css';

import { Routes, Route, useLocation, Outlet } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import { ViewportProvider } from 'components/context/Viewport/ViewportProvider';
import Footer from './components/Footer';
import Header from './components/Header';
import ScrollButton from './components/ScrollButton';

import Home from 'pages/Home';
import About from 'src/pages/About/About';
import Menus from 'pages/Menu/Menus';
import Recruitment from 'pages/Recruitment';
import Shop from 'pages/Shop/Shop';
import Blog from 'pages/Blog';
import AccountManager from 'pages/AccountManager';
import { PageWrapper, LayoutWrapper } from 'components/functions/PageWrappers';
import ProtectedRoute from './components/functions/ProtectedRoute';
import LoginPage from './pages/Login/LoginPage';
import Cart from './pages/Cart/Cart';
import AdminLayout from "pages/Admin/Components/AdminLayout";
import Dashboard from "pages/Admin/Dashboard";
import Products from "pages/Admin//Products";
import { useAuth } from 'components/Context/Login/AuthProvider';
import { Navigate } from 'react-router-dom';



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
  const { user, isAdmin, loading } = useAuth();
  if (loading) return null;
  if (!user || !isAdmin) return <Navigate to="/login" />;
  return children;
};

export default function App() {
  const location = useLocation();

  return (
    <ViewportProvider>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="" element={<LayoutWrapper><Layout /></LayoutWrapper>}>
            <Route index element={<PageWrapper><Home /></PageWrapper>} />
            <Route path="login" element={<PageWrapper><LoginPage /></PageWrapper>} />
            <Route path="about" element={<PageWrapper><About /></PageWrapper>} />
            <Route path="menu" element={<PageWrapper><Menus /></PageWrapper>} />
            <Route path="recruitment" element={<PageWrapper><Recruitment /></PageWrapper>} />
            <Route path="shop" element={<PageWrapper><Shop /></PageWrapper>} />
            <Route path="blog" element={<PageWrapper><Blog /></PageWrapper>} />
            <Route path="cart" element={<PageWrapper><Cart /></PageWrapper>} />
            <Route path="/admin" element={
              <AdminRoute>
                <PageWrapper>
                  <AdminLayout />
                </PageWrapper>
              </AdminRoute>
            }>
              <Route index element={<PageWrapper><Dashboard /></PageWrapper>} />
              <Route path="products" element={<PageWrapper><Products /></PageWrapper>} />
            </Route>
            <Route path="account" element={<ProtectedRoute><PageWrapper><AccountManager /></PageWrapper></ProtectedRoute>} />
            <Route path="*" element={<h1>404 - Page not found</h1>} />
          </Route>
        </Routes>
      </AnimatePresence>
    </ViewportProvider>
  );
}
