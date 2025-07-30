import { createRoot } from 'react-dom/client'
import React from 'react';
import './styles/index.css';
import './assets/styles/_colors.css';
import App from './App';
import './assets/styles/_animations.css';
import { BrowserRouter as Router } from 'react-router-dom';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <App />
    </Router>
  </React.StrictMode>
);
