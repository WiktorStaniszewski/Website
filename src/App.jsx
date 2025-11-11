import 'styles/App.css'
import { Routes, Route, useLocation  } from 'react-router-dom';
import Layout from 'components/Layout';
import { ViewportProvider } from "components/Context/ViewportProvider";
import Home from 'pages/Home';
import About from 'pages/About'
import Menus from 'pages/Menu/Menus'
import Recruitment from 'src/pages/Recruitment'
import Shop from 'src/pages/Shop/Shop'
import Blog from 'src/pages/Blog';
import AccountManager from 'pages/AccountManager';
import { PageWrapper, LayoutWrapper } from 'components/functions/PageWrappers';
import { AnimatePresence } from 'framer-motion';

function App() {
  const location = useLocation()
  return (
    <ViewportProvider>
      <AnimatePresence mode='wait'>
          <Routes location={location} key={location.pathname}>
              <Route path='' element={<LayoutWrapper><Layout /></LayoutWrapper>}>
                <Route index element={<PageWrapper><Home /></PageWrapper>}/>
                <Route path="about" element={<PageWrapper><About /></PageWrapper>}/>
                <Route path="menu" element={<PageWrapper><Menus /></PageWrapper>}/>
                <Route path="recruitment" element={<PageWrapper><Recruitment /></PageWrapper>}/>
                <Route path="shop" element={<PageWrapper><Shop /></PageWrapper>}/>
                <Route path="blog" element={<PageWrapper><Blog /></PageWrapper>}/>
                <Route path="accManager" element={<PageWrapper><AccountManager /></PageWrapper>}/>
                <Route path="*" element={<h1>404 - Page not found</h1>} />
              </Route>
          </Routes>
        </AnimatePresence>
      </ViewportProvider>
  )
}

export default App
