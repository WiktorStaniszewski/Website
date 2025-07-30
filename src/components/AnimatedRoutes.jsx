import { Routes, Route, useLocation  } from 'react-router-dom';
import Layout from './Layout.jsx';
import Home from '../pages/Home.jsx';
import About from '../pages/About.jsx'
import Menu from '../pages/Menu.jsx'
import Contact from '../pages/Contact.jsx'
import Shop from '../pages/Shop.jsx'

function AnimatedRoutes() {
  const location = useLocation()
  return (
      <Routes location={location} key={location.pathname}>
          <Route path='/' element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="menu" element={<Menu />} />
          <Route path="contact" element={<Contact />} />
          <Route path="shop" element={<Shop />} />
          <Route path="*" element={<h1>404 - Page not found</h1>} />
          </Route>
      </Routes>
  )
}

export default AnimatedRoutes
