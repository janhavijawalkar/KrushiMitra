/**
 * KrushiMitra API Configuration
 * Supports Local Development & Production Cloud Deployments (Vercel, Render, Railway, AWS, Docker)
 */

export const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV ? "http://127.0.0.1:5000/api" : "/api");

export const buildApiUrl = (endpoint) => {
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  return `${API_BASE_URL}${cleanEndpoint}`;
};

export default API_BASE_URL;
