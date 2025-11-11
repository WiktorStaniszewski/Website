import { Outlet } from 'react-router-dom';
import Footer from './footer.jsx';
import Header from './Header.jsx';
import ScrollButton from './ScrollButton.jsx';

function Layout() {
  return (
    <>
      <Header />
      <>
        <Outlet />  
      </>
      <ScrollButton />
      <Footer />
    </>
  );
}

export default Layout;