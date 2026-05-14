import { getRouter } from './router';
import { hydrate } from '@tanstack/router-core/ssr/client';

async function boot() {
  try {
    const router = getRouter();

    // Minimal options object expected by hydration code
    window.__TSS_START_OPTIONS__ = window.__TSS_START_OPTIONS__ ?? { serializationAdapters: [] };

    router.update({ basepath: process.env.TSS_ROUTER_BASEPATH, serializationAdapters: [] });

    if (!router.stores.matchesId.get().length) {
      await hydrate(router);
    }

    // signal any listeners that hydration completed
    window.$_TSR?.h();
  } catch (err) {
    console.error('Error hydrating start client', err);
  }
}

boot();
