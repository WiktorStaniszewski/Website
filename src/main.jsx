import 'styles/index.css';
import 'assets/styles/_colors.css';

import React from 'react';
import { createRoot } from 'react-dom/client'
import { HashRouter as Router } from 'react-router-dom';
import { Wrapper } from 'components/layout/PageWrappers';
import { AuthProvider } from 'src/context/AuthProvider';

import App from './App';
import { CartProvider } from 'src/context/CartProvider';


createRoot(document.getElementById('root')).render(
  <React.StrictMode>
      <Router>
        <AuthProvider>
          <CartProvider>
            <Wrapper>
              <App />
            </Wrapper>
          </CartProvider>
        </AuthProvider>
      </Router>
  </React.StrictMode>
);
