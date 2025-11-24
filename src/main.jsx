import 'styles/index.css';
import 'assets/styles/_colors.css';
import 'assets/styles/_animations.css';
import 'styles/index.css';  

import React from 'react';
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router } from 'react-router-dom';
import { Wrapper } from 'components/functions/PageWrappers';
import { AuthProvider } from 'components/Context/Login/AuthProvider';

import App from './App';


createRoot(document.getElementById('root')).render(
  <React.StrictMode>
      <Router basename="/Website">
        <AuthProvider>
          <Wrapper>
            <App />
          </Wrapper>
        </AuthProvider>
      </Router>
  </React.StrictMode>
);
