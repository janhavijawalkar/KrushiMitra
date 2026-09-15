/**
 * KrushiMitra API Configuration
 * Supports Localhost, LAN sharing (mobile phones & other devices), & Production Cloud Deployments (Vercel, Render, Railway, AWS, Docker)
 */

export const getApiBaseUrl = () => {
  // 1. Explicit environment variable takes highest priority
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL.replace(/\/+$/, "");
  }

  // 2. In browser environment
  if (typeof window !== "undefined" && window.location) {
    const { hostname, port, protocol } = window.location;

    // When running under Vite Dev Server (port 5173 / 3000 / etc.)
    // We use the Vite proxy path '/api' which routes directly to Flask on 127.0.0.1:5000
    // This allows any mobile phone, tablet, or external PC on the local network to communicate flawlessly!
    if (port === "5173" || port === "3000" || port === "4173" || port === "5174") {
      return "/api";
    }

    // In production or reverse proxy deployments (Nginx, Vercel, Render)
    return "/api";
  }

  return "http://127.0.0.1:5000/api";
};

export const API_BASE_URL = getApiBaseUrl();

export const buildApiUrl = (endpoint) => {
  let cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const base = getApiBaseUrl();
  // Prevent double '/api/api/...' when caller provides '/api/...'
  if (base.endsWith("/api") && cleanEndpoint.startsWith("/api/")) {
    cleanEndpoint = cleanEndpoint.substring(4);
  }
  return `${base}${cleanEndpoint}`;
};

export default API_BASE_URL;
