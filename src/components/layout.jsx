import { Outlet } from 'react-router-dom';
import Footer from './footer.jsx';
import Header from './Header.jsx';

function Layout() {
  return (
    <>
      <Header/>
      <main>
        <Outlet />  
      </main>
      <Footer />
    </>
  );
}

export default Layout;