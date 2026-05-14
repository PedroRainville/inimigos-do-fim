import { hydrateStart } from '@tanstack/react-start-client';

async function boot() {
  try {
    await hydrateStart();
  } catch (err) {
    console.error('Error hydrating start client', err);
  }
}

boot();
