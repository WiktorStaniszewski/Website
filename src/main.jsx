import 'styles/index.css';
import 'assets/styles/_colors.css';
import 'assets/styles/_animations.css';
import 'styles/index.css';  

import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router } from 'react-router-dom';
import React from 'react';
import App from './App';
import ScrollManager from 'src/components/functions/ScrollManager';


createRoot(document.getElementById('root')).render(
  <React.StrictMode>
      <Router>
        <ScrollManager> 
          <App />
        </ScrollManager>
      </Router>
  </React.StrictMode>
);
