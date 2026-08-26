import React, { lazy, Suspense } from "react";
import { SettingsProvider } from "./settingsContext.jsx";
import HomePage from "./pages/HomePage.jsx";

// Lazy load non-homepage routes so their code is only downloaded when requested
const AdminDashboard = lazy(() => import("./components/AdminDashboard.jsx"));
const AboutPage = lazy(() => import("./pages/AboutPage.jsx"));
const ContactPage = lazy(() => import("./pages/ContactPage.jsx"));
const FaqPage = lazy(() => import("./pages/FaqPage.jsx"));
const ServicePage = lazy(() => import("./pages/ServicePage.jsx"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage.jsx"));

function resolvePage(pathname) {
  const path = pathname.replace(/\/+$/, "") || "/";

  if (path === "/") return <HomePage />;
  if (path === "/about") return <AboutPage />;
  if (path === "/contact") return <ContactPage />;
  if (path === "/faq") return <FaqPage />;

  const serviceMatch = path.match(/^\/services\/([a-z0-9-]+)$/);
  if (serviceMatch) return <ServicePage slug={serviceMatch[1]} />;

  return <NotFoundPage />;
}

export default function App() {
  const path = window.location.pathname;

  if (path.startsWith("/admin")) {
    return (
      <Suspense fallback={<div style={{ minHeight: "100vh", background: "#f4f7fb" }} />}>
        <AdminDashboard />
      </Suspense>
    );
  }

  return (
    <SettingsProvider>
      <Suspense fallback={<div style={{ minHeight: "60vh" }} />}>
        {resolvePage(path)}
      </Suspense>
    </SettingsProvider>
  );
}