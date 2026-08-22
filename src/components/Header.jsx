import { useState } from "react";
import { whatsappBookingUrl } from "../whatsapp.js";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Microwave Repair", href: "/services/microwave-repair" },
  { label: "Refrigerator Repair Services", href: "/services/refrigerator-repair" },
  { label: "Washing Machine Repair", href: "/services/washing-machine-repair" },
  { label: "Ac Repair Services", href: "/services/ac-repair" },
  { label: "LED & Smart TV Repair", href: "/services/led-tv-repair" }
];

const PHONE_DISPLAY = "(786) 913-0336";
const PHONE_TEL = "+17869130336";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="utility-bar">
        <span>Same-day appliance &amp; AC repair — licensed technicians</span>
        <a className="header-phone-link" href={`tel:${PHONE_TEL}`}>
          <PhoneIcon /> Call/Text {PHONE_DISPLAY}
        </a>
      </div>

      <div className="main-nav">
        <a className="logo" href="/">
          Ever<span>Plus</span>
        </a>

        <nav className={`nav-links ${menuOpen ? "is-open" : ""}`}>
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href} onClick={() => setMenuOpen(false)}>
              {link.label}
            </a>
          ))}
          <a className="header-cta" href={`tel:${PHONE_TEL}`}>
            {PHONE_DISPLAY}
          </a>
          <a
            className="header-cta header-whatsapp-cta"
            href={whatsappBookingUrl()}
            target="_blank"
            rel="noreferrer"
          >
            <WhatsAppIcon /> Chat on WhatsApp
          </a>
        </nav>

        <button
          type="button"
          className="menu-button all-services-button"
          aria-label="Toggle all services menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span className="all-services-text">ALL SERVICES</span>
        </button>
      </div>
    </header>
  );
}

function PhoneIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.28-1.39a9.87 9.87 0 0 0 4.76 1.21h.01c5.46 0 9.9-4.45 9.9-9.91C21.96 6.45 17.5 2 12.04 2zm5.8 14.05c-.24.68-1.4 1.3-1.93 1.38-.5.08-1.12.11-1.8-.11-.42-.13-.96-.31-1.65-.6-2.9-1.25-4.8-4.17-4.94-4.36-.14-.19-1.17-1.56-1.17-2.98s.73-2.11 1-2.4c.24-.27.53-.34.7-.34h.5c.16 0 .38-.03.58.44.24.55.79 1.93.86 2.07.07.14.11.31.02.5-.09.19-.14.31-.27.48-.14.16-.29.36-.42.49-.14.14-.28.29-.12.57.16.28.71 1.17 1.53 1.9 1.05.94 1.94 1.23 2.22 1.37.28.14.44.12.6-.07.16-.19.68-.79.87-1.06.19-.27.37-.22.62-.13.26.09 1.62.76 1.9.9.28.14.46.21.53.32.07.13.07.68-.17 1.35z" />
    </svg>
  );
}

