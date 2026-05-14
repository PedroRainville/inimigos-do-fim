import { startInstance } from './start';

async function boot() {
  try {
    // Try common method names used by start instances.
    const anyStart = startInstance as any;
    if (typeof anyStart.start === 'function') {
      await anyStart.start();
      return;
    }
    if (typeof anyStart.hydrate === 'function') {
      await anyStart.hydrate();
      return;
    }
    if (typeof anyStart._start === 'function') {
      await anyStart._start();
      return;
    }

    // Fallback: no-op but keep the build happy.
    console.warn('startInstance has no start/hydrate method. App may require a different client entry.');
  } catch (err) {
    console.error('Error booting client startInstance', err);
  }
}

boot();
