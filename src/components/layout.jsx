import { Outlet } from 'react-router-dom';
import Footer from './footer.jsx';
import Header from './Header.jsx';
import ScrollButton from './ScrollButton.jsx';
import '../styles/ScrollButton.css'

function Layout() {
  return (
    <>
      <Header />
      <main>
        <Outlet />  
      </main>
      <ScrollButton />
      <Footer />
    </>
  );
}

export default Layout;