import './styles/App.css'
import Navbar from "./components/navbar.jsx";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout.jsx';
import Home from './pages/Home.jsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="home" element={<Home />} />
        </Route>
          <Route path="*" element={<h1>404 - Page not found</h1>} />
      </Routes>
    </Router>
    /*<div className="App">
      <header className="App-header">
        <Navbar />
      </header>
    </div>
    */
  );
}

export default App
