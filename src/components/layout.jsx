import { Outlet } from 'react-router-dom';
import Footer from './footer.jsx';
import Navbar from './navbar.jsx';

function Layout() {
  return (
    <>
      <header>
        <Navbar />
      </header>
      <main>
        <Outlet />  
      </main>
      <Footer />
    </>
  );
}

export default Layout;