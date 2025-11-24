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

export default function App() {
  const location = useLocation();

  return (
    <ViewportProvider>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="" element={<LayoutWrapper><Layout /></LayoutWrapper>}>
            <Route index element={<PageWrapper><Home /></PageWrapper>} />
            <Route path="about" element={<PageWrapper><About /></PageWrapper>} />
            <Route path="menu" element={<PageWrapper><Menus /></PageWrapper>} />
            <Route path="recruitment" element={<PageWrapper><Recruitment /></PageWrapper>} />
            <Route path="shop" element={<PageWrapper><Shop /></PageWrapper>} />
            <Route path="blog" element={<PageWrapper><Blog /></PageWrapper>} />
            <Route path="accManager" element={<ProtectedRoute><PageWrapper><AccountManager /></PageWrapper></ProtectedRoute>} />
            <Route path="*" element={<h1>404 - Page not found</h1>} />
          </Route>
        </Routes>
      </AnimatePresence>
    </ViewportProvider>
  );
}
