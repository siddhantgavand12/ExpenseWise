
import React from 'react';
import ReactDOM from 'react-dom/client';
// FIX: Added the '.tsx' extension to the import path to be explicit and resolve module resolution errors.
import App from './App.tsx';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);