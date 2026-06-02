import { createAuthClient } from "better-auth/react";

// In production, use the same origin (Vercel rewrites proxy /api/* to the API backend)
// This avoids cross-origin cookie issues
const baseURL = import.meta.env.PROD
    ? window.location.origin  // Same domain proxy in production
    : 'http://localhost:3000'; // Direct API in development

export const authClient = createAuthClient({
    baseURL,
});
