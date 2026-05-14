// Lightweight stub for `startInstance` to satisfy type references.
// This project has been converted to a static SPA, so no server start is needed.
export const startInstance = {
  getOptions: async () => ({ serializationAdapters: [], defaultSsr: false }),
};
