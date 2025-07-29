import { createRoot } from 'react-dom/client'
import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/index.css';
import './assets/styles/_colors.css';
import App from './App';
import './assets/styles/_animations.css';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
