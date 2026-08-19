const currentYear = new Date().getFullYear();

// Shown instantly on load and as a safety net if /api/settings hasn't
// responded yet (or the backend is unreachable), so the footer is never blank.
const FALLBACK_FOOTER = {
  companyName: "EverPlus",
  tagline: "Trusted appliance & HVAC repair, done right the first time.",
  phone: "",
  email: "",
  license: "",
  locations: [],
  services: ["AC Repair", "Washing Machine Repair", "Refrigerator Repair", "Microwave Repair"],
  quickLinks: [
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
    { label: "Service Areas", href: "/service-areas" },
    { label: "FAQ", href: "/faq" }
  ],
  social: []
};

export default function Footer({ footer }) {
  const safeFooter = footer || FALLBACK_FOOTER;

  const {
    companyName,
    tagline,
    phone,
    email,
    license,
    locations = [],
    services = [],
    quickLinks = [],
    social = []
  } = safeFooter;

  return (
    <footer className="site-footer">
      <div className="footer-topbar">
        <span>Free Estimates on All Repairs</span>
        {phone ? (
          <a href={`tel:${phone.replace(/\D/g, "")}`}>
            <PhoneIcon /> {phone}
          </a>
        ) : null}
      </div>

      <div className="footer-main">
        <div className="footer-brand">
          <span className="logo">
            {companyName?.slice(0, -4) || "Ever"}
            <span>{companyName?.slice(-4) || "Plus"}</span>
          </span>
          {tagline ? <p>{tagline}</p> : null}
          {phone ? <p>Phone – {phone}</p> : null}
          {email ? <p>Email – {email}</p> : null}
          {license ? <p>License #{license}</p> : null}
        </div>

        {locations.length ? (
          <div className="footer-locations">
            <h4>The best service for your home, near you:</h4>
            {locations.map((loc, index) => (
              <div className="footer-location" key={`${loc.city}-${index}`}>
                <strong>{loc.city}</strong>
                {loc.address ? <span>{loc.address}</span> : null}
                {loc.phone ? (
                  <a href={`tel:${loc.phone.replace(/\D/g, "")}`}>{loc.phone}</a>
                ) : null}
              </div>
            ))}
          </div>
        ) : null}

        {services.length ? (
          <div className="footer-links-col">
            <h4>Our Services</h4>
            <ul>
              {services.map((service) => (
                <li key={service}>{service}</li>
              ))}
            </ul>
          </div>
        ) : null}

        {quickLinks.length ? (
          <div className="footer-links-col">
            <h4>Quick Links</h4>
            <ul>
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <a href={link.href}>{link.label}</a>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>

      {social.length ? (
        <div className="footer-social">
          {social.map((item) => (
            <a key={item.platform} href={item.url} target="_blank" rel="noreferrer" aria-label={item.platform}>
              {item.platform}
            </a>
          ))}
        </div>
      ) : null}

      <div className="footer-bottom">
        © {currentYear} {companyName || "EverPlus"}. All rights reserved.
      </div>
    </footer>
  );
}

function PhoneIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}
