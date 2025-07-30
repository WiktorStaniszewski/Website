import { Outlet } from 'react-router-dom';
import Footer from './footer.jsx';
import Navbar from './navbar.jsx';

function Layout() {
  return (
    <>
      <Navbar />
      <main>
        <Outlet />  
      </main>
      <Footer />
    </>
  );
}

export default Layout;