import React from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from '@tanstack/react-router';
import { getRouter } from './router';

function boot() {
  try {
    const router = getRouter();
    const el = document.getElementById('root');
    if (!el) {
      console.error('Root element not found');
      return;
    }
    const root = createRoot(el);
    root.render(<RouterProvider router={router} />);
  } catch (err) {
    console.error('Error starting SPA', err);
  }
}

boot();
