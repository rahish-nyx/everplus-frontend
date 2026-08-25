import AdminDashboard from "./components/AdminDashboard.jsx";
import { SettingsProvider } from "./settingsContext.jsx";
import HomePage from "./pages/HomePage.jsx";
import AboutPage from "./pages/AboutPage.jsx";
import ContactPage from "./pages/ContactPage.jsx";
import FaqPage from "./pages/FaqPage.jsx";
import ServicePage from "./pages/ServicePage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";

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
    return <AdminDashboard />;
  }

  return <SettingsProvider>{resolvePage(path)}</SettingsProvider>;
}
