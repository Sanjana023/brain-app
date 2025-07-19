import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';

 
window.addEventListener('DOMContentLoaded', () => {
  const splash = document.getElementById('splash-screen');
  const rootDiv = document.getElementById('root');

  setTimeout(() => {
    if (splash) splash.classList.add('hidden');  
    if (rootDiv) rootDiv.classList.remove('hidden');  
  }, 5000);  
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
