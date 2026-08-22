// Relative path — routes through Vite's dev server proxy (see vite.config.js,
// which forwards /api and /uploads to http://127.0.0.1:5000). The browser
// only ever talks to its own origin this way, so CORS never applies.
// Override with VITE_API_BASE only for a production deployment where the
// frontend and backend are on different hosts and there's no dev proxy.
const API_BASE = import.meta.env.VITE_API_BASE || "https://everplus-backend.onrender.com";
const TOKEN_KEY = "everplus_admin_token";

export function getAdminToken() {
  return localStorage.getItem(TOKEN_KEY) || "";
}

export function setAdminToken(token) {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
}

export async function apiFetch(path, options = {}) {
  const { auth, headers, body, isForm, ...rest } = options;
  const finalHeaders = { ...(headers || {}) };

  if (!isForm) {
    finalHeaders["Content-Type"] = "application/json";
  }

  if (auth) {
    finalHeaders.Authorization = `Bearer ${getAdminToken()}`;
  }

  let response;
  try {
    response = await fetch(`${API_BASE}${path}`, {
      ...rest,
      headers: finalHeaders,
      body: isForm ? body : body ? JSON.stringify(body) : undefined
    });
  } catch {
    throw new Error(
      `Can't reach the backend. Make sure it's running on port 5000 (cd backend && node server.js), and that vite.config.js has the /api and /uploads proxy pointing at it.`
    );
  }

  let data = null;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    throw new Error(data?.message || "Something went wrong. Please try again.");
  }

  return data;
}

// ---- Public ----
export const getSettings = () => apiFetch("/api/settings");
export const createLead = (lead) => apiFetch("/api/leads", { method: "POST", body: lead });

// ---- Public: ratings ----
export const getRatings = () => apiFetch("/api/ratings");
export const submitRating = (rating) => apiFetch("/api/ratings", { method: "POST", body: rating });

// ---- Admin auth ----
export const adminLogin = (password) =>
  apiFetch("/api/admin/login", { method: "POST", body: { password } });

// ---- Admin: leads ----
export const getAdminLeads = () => apiFetch("/api/admin/leads", { auth: true });
export const updateLeadStatus = (id, status) =>
  apiFetch(`/api/admin/leads/${id}`, { method: "PATCH", auth: true, body: { status } });
export const deleteLead = (id) =>
  apiFetch(`/api/admin/leads/${id}`, { method: "DELETE", auth: true });

// ---- Admin: ratings moderation ----
export const getAdminRatings = () => apiFetch("/api/admin/ratings", { auth: true });
export const setRatingApproved = (id, approved) =>
  apiFetch(`/api/admin/ratings/${id}`, { method: "PATCH", auth: true, body: { approved } });
export const deleteRating = (id) =>
  apiFetch(`/api/admin/ratings/${id}`, { method: "DELETE", auth: true });

// ---- Admin: settings ----
export const updateGeneralSettings = (payload) =>
  apiFetch("/api/admin/settings/general", { method: "PUT", auth: true, body: payload });

export const updateHeroSlides = (heroSlides) =>
  apiFetch("/api/admin/settings/hero-slides", { method: "PUT", auth: true, body: { heroSlides } });

export const updateBrandLogos = (brandLogos) =>
  apiFetch("/api/admin/settings/brand-logos", { method: "PUT", auth: true, body: { brandLogos } });

export const updateFooterSettings = (footer) =>
  apiFetch("/api/admin/settings/footer", { method: "PUT", auth: true, body: { footer } });

export const updateAboutSettings = (about) =>
  apiFetch("/api/admin/settings/about", { method: "PUT", auth: true, body: { about } });

export const updateContactSettings = (contact) =>
  apiFetch("/api/admin/settings/contact", { method: "PUT", auth: true, body: { contact } });

export const updateFaqSettings = (items) =>
  apiFetch("/api/admin/settings/faq", { method: "PUT", auth: true, body: { items } });

export const updateServicesSettings = (services) =>
  apiFetch("/api/admin/settings/services", { method: "PUT", auth: true, body: { services } });

export const updateReviewsSettings = (reviews) =>
  apiFetch("/api/admin/settings/reviews", { method: "PUT", auth: true, body: { reviews } });

export async function uploadImage(file) {
  const form = new FormData();
  form.append("image", file);
  return apiFetch("/api/admin/upload", { method: "POST", auth: true, isForm: true, body: form });
}

export function resolveAssetUrl(url) {
  if (!url) return "";
  if (/^https?:\/\//i.test(url)) return url;
  return `${API_BASE}${url}`;
}
