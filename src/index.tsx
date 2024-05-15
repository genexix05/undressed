import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import AppWrapper from './components/AppWrapper';
import reportWebVitals from './reportWebVitals';

// Asegúrate de que el elemento con id 'root' exista en tu index.html
const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <AppWrapper />
  </React.StrictMode>
);

reportWebVitals();
