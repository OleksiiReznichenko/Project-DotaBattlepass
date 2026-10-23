// Public builds default to demo mode, even without an environment file.
// Never set VITE_DEMO_MODE=false on a public deployment.
export const DEMO_MODE: boolean = import.meta.env.VITE_DEMO_MODE !== 'false';
