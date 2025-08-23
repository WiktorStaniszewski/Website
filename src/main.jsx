import 'styles/index.css';
import 'assets/styles/_colors.css';
import 'assets/styles/_animations.css';
import { createRoot } from 'react-dom/client'
import React from 'react';
import App from './App';
import { BrowserRouter as Router } from 'react-router-dom';
import ScrollManager from './components/ScrollManager.jsx';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
      <Router>
        <ScrollManager>
          <App />
        </ScrollManager>
      </Router>
  </React.StrictMode>
);
