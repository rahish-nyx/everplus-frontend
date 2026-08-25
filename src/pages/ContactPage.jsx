import { useEffect } from "react";
import Layout from "../components/Layout.jsx";
import { useSettings } from "../settingsContext.jsx";
import { applyPageMeta } from "../seo.js";

export default function ContactPage() {
  const { settings } = useSettings();
  const contact = settings?.pages?.contact;
  const footer = settings?.footer;

  useEffect(() => {
    applyPageMeta("Contact Us | EverPlus", contact?.intro);
  }, [contact]);

  if (!settings) {
    return (
      <Layout>
        <section className="page-hero">
          <span className="section-kicker">Get In Touch</span>
          <div
            className="skeleton-block"
            style={{ height: "42px", width: "min(300px, 45%)", marginBottom: "14px", background: "rgba(255,255,255,0.14)" }}
          />
          <div
            className="skeleton-block"
            style={{ height: "18px", width: "min(520px, 65%)", background: "rgba(255,255,255,0.14)" }}
          />
        </section>

        <section className="contact-grid">
          <div className="contact-info-card">
            <div className="skeleton-block" style={{ height: "18px", width: "50%", marginBottom: "16px" }} />
            <div className="skeleton-block" style={{ height: "46px", width: "100%", marginBottom: "10px", borderRadius: "6px" }} />
            <div className="skeleton-block" style={{ height: "46px", width: "100%", marginBottom: "10px", borderRadius: "6px" }} />
            <div className="skeleton-block" style={{ height: "46px", width: "70%", borderRadius: "6px" }} />
          </div>

          <div className="contact-image-placeholder">
            <div className="skeleton-block" style={{ width: "100%", height: "100%", borderRadius: "10px" }} />
          </div>
        </section>
      </Layout>
    );
  }

  const phone = footer?.phone || "";
  const email = footer?.email || "";
  const whatsappDigits = (contact?.whatsappNumber || phone).replace(/\D/g, "");
  const whatsappHref = whatsappDigits
    ? `https://wa.me/${whatsappDigits}?text=${encodeURIComponent("Hi, I'd like to book a repair with EverPlus.")}`
    : "";

  return (
    <Layout>
      <section className="page-hero">
        <span className="section-kicker">Get In Touch</span>
        <h1>Contact Us</h1>
        {contact?.intro ? <p>{contact.intro}</p> : null}
      </section>

      <section className="contact-grid">
        <div className="contact-info-card">
          {contact?.hours ? (
            <div className="contact-row">
              <ClockIcon /> {contact.hours}
            </div>
          ) : null}

          <div className="contact-actions">
            {phone ? (
              <a className="contact-action-button call-action" href={`tel:${phone.replace(/\D/g, "")}`}>
                <PhoneIcon /> Call Now
              </a>
            ) : null}
            {email ? (
              <a className="contact-action-button email-action" href={`mailto:${email}`}>
                <MailIcon /> Email Us
              </a>
            ) : null}
            {whatsappHref ? (
              <a className="contact-action-button whatsapp-button" href={whatsappHref} target="_blank" rel="noreferrer">
                <WhatsAppIcon /> Chat on WhatsApp
              </a>
            ) : null}
          </div>

          {!email && !phone && !contact?.hours ? (
            <p className="empty-state">Contact details coming soon.</p>
          ) : null}
        </div>

        <div className="contact-image-placeholder" aria-hidden="true">
          {contact?.image?.url ? (
            <img
              src={contact.image.url}
              alt={contact.image.caption || "EverPlus contact"}
              style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "10px" }}
            />
          ) : (
            <>
              <ApplianceIcon />
              <span>Photo of technician or appliances</span>
            </>
          )}
        </div>
      </section>
    </Layout>
  );
}

function MailIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 6-10 7L2 6" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 3" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.28-1.39a9.87 9.87 0 0 0 4.76 1.21h.01c5.46 0 9.9-4.45 9.9-9.91C21.96 6.45 17.5 2 12.04 2zm5.8 14.05c-.24.68-1.4 1.3-1.93 1.38-.5.08-1.12.11-1.8-.11-.42-.13-.96-.31-1.65-.6-2.9-1.25-4.8-4.17-4.94-4.36-.14-.19-1.17-1.56-1.17-2.98s.73-2.11 1-2.4c.24-.27.53-.34.7-.34h.5c.16 0 .38-.03.58.44.24.55.79 1.93.86 2.07.07.14.11.31.02.5-.09.19-.14.31-.27.48-.14.16-.29.36-.42.49-.14.14-.28.29-.12.57.16.28.71 1.17 1.53 1.9 1.05.94 1.94 1.23 2.22 1.37.28.14.44.12.6-.07.16-.19.68-.79.87-1.06.19-.27.37-.22.62-.13.26.09 1.62.76 1.9.9.28.14.46.21.53.32.07.13.07.68-.17 1.35z" />
    </svg>
  );
}

function ApplianceIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="4" y="2" width="10" height="20" rx="1.5" />
      <line x1="4" y1="12" x2="14" y2="12" />
      <circle cx="9" cy="17" r="2" />
      <rect x="15" y="7" width="6" height="6" rx="1" />
    </svg>
  );
}
