import React from 'react';
import ReactDOM from 'react-dom/client';
import './tokens.css';
import './styles.css';
import { lazy, Suspense } from 'react';
import { App } from './App';
const CorePreview = lazy(() => import('./CorePreview'));
const path = location.pathname.replace(/\/$/, '');
const direction = new URLSearchParams(location.search).get('direction');
const archiveRoute = path === '/design-preview' && (direction === 'a' || direction === 'b');
const coreRoute = path === '' || path === '/design-preview/core' || (path === '/design-preview' && !archiveRoute);
ReactDOM.createRoot(document.getElementById('root')!).render(<React.StrictMode>
  <Suspense fallback={<div data-theme={coreRoute ? 'dark' : 'light'} style={{ minHeight: '100vh', padding: '32px', background: 'var(--ml-color-surface-subtle)', color: 'var(--ml-color-text-primary)' }} role="status">MyLife · 正在打开样张…</div>}>
    {coreRoute ? <CorePreview /> : <App />}
  </Suspense>
</React.StrictMode>);
