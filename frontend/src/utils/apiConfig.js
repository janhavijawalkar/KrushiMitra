/**
 * KrushiMitra API Configuration
 * Supports Localhost, LAN sharing, & Production Cloud Deployments (Vercel, Render, Railway, Netlify, Docker)
 */

export const getApiBaseUrl = () => {
  // 1. Explicit environment variables take highest priority (Vercel, Netlify, Render)
  const envUrl =
    import.meta.env.VITE_API_URL ||
    import.meta.env.VITE_API_BASE_URL ||
    import.meta.env.VITE_BACKEND_URL;

  if (envUrl && typeof envUrl === "string" && envUrl.trim() !== "") {
    return envUrl.trim().replace(/\/+$/, "");
  }

  // 2. Browser environment
  if (typeof window !== "undefined" && window.location) {
    const { hostname, port } = window.location;

    // Vite Dev Server (port 5173 / 3000 / 4173) -> use Vite proxy '/api'
    if (port === "5173" || port === "3000" || port === "4173" || port === "5174") {
      return "/api";
    }

    // Single-origin production or reverse proxy (Nginx, Docker)
    return "/api";
  }

  return "http://127.0.0.1:5000/api";
};

export const API_BASE_URL = getApiBaseUrl();

export const buildApiUrl = (endpoint) => {
  let cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const base = getApiBaseUrl();

  // If base already includes '/api' (e.g. '/api' or 'https://api.domain.com/api')
  // and endpoint begins with '/api/', avoid '/api/api/...' duplication
  if (base.endsWith("/api") && cleanEndpoint.startsWith("/api/")) {
    cleanEndpoint = cleanEndpoint.substring(4);
  }

  // If base is a full domain without '/api' (e.g. 'https://backend.onrender.com')
  // and endpoint doesn't begin with '/api/', ensure '/api' prefix is attached
  if (!base.endsWith("/api") && !cleanEndpoint.startsWith("/api/")) {
    cleanEndpoint = `/api${cleanEndpoint}`;
  }

  return `${base}${cleanEndpoint}`;
};

export default API_BASE_URL;

