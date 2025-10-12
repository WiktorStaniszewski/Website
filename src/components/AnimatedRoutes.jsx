import { Routes, Route, useLocation  } from 'react-router-dom';
import Layout from './Layout.jsx';
import Home from '../pages/Home.jsx';
import About from '../pages/About.jsx'
import Menu from '../pages/Menu/Menus.jsx'
import Contact from '../pages/Contact.jsx'
import Shop from '../pages/Shop/Shop.jsx'
import Blog from 'src/pages/Blog.jsx';
import { PageWrapper, LayoutWrapper } from './functions/PageWrappers.jsx';
import { AnimatePresence } from 'framer-motion';

function AnimatedRoutes() {
  const location = useLocation()
  return (
    <AnimatePresence mode='wait'>
        <Routes location={location} key={location.pathname}>
            <Route path='' element={<LayoutWrapper><Layout /></LayoutWrapper>}>
            <Route index element={<PageWrapper><Home /></PageWrapper>}/>
            <Route path="about" element={<PageWrapper><About /></PageWrapper>}/>
            <Route path="menu" element={<PageWrapper><Menu /></PageWrapper>}/>
            <Route path="contact" element={<PageWrapper><Contact /></PageWrapper>}/>
            <Route path="shop" element={<PageWrapper><Shop /></PageWrapper>}/>
            <Route path="blog" element={<PageWrapper><Blog /></PageWrapper>}/>
            <Route path="*" element={<h1>404 - Page not found</h1>} />
            </Route>
        </Routes>
      </AnimatePresence>
  )
}

export default AnimatedRoutes
