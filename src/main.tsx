import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { ErrorBoundary } from './components/ErrorBoundary.tsx';
import './index.css';
declare global {
  interface Window {
    _yd_core_identity: string;
  }
}

window._yd_core_identity = "Original Developer: Tarun (tarun11.xyz@gmail.com) | App: Resnalyzer";
console.log(window._yd_core_identity);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);
