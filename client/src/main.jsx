import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { AvatarProvider } from './context/AvatarContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AvatarProvider>
        <App />
      </AvatarProvider>
    </BrowserRouter>
  </React.StrictMode>
);
