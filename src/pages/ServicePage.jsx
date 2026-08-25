import { useEffect } from "react";
import Layout from "../components/Layout.jsx";
import { useSettings } from "../settingsContext.jsx";
import { resolveAssetUrl } from "../api.js";
import { applyPageMeta } from "../seo.js";
import { whatsappBookingUrl, CALL_TEL } from "../whatsapp.js";
import { SERVICES, WrenchIcon, TvIcon } from "../components/ServiceGrid.jsx";
import ShimmerImage from "../components/ShimmerImage.jsx";

export default function ServicePage({ slug }) {
  const { settings } = useSettings();
  const service = settings?.pages?.services?.[slug];
  const loading = !settings;

  useEffect(() => {
    if (service?.title) applyPageMeta(`${service.title} | EverPlus`, service.shortDescription || service.tagline);
  }, [service]);

  // Settings hasn't arrived yet — show a skeleton instead of the old plain
  // "Loading…" text, so this matches the shimmer treatment used everywhere
  // else on the site.
  if (loading) {
    return (
      <Layout>
        <section className="page-hero service-page-hero">
          <span className="section-kicker">Service</span>
          <div
            className="skeleton-block"
            style={{ height: "48px", width: "min(560px, 70%)", marginBottom: "14px", background: "rgba(255,255,255,0.14)" }}
          />
          <div
            className="skeleton-block"
            style={{ height: "20px", width: "min(420px, 55%)", background: "rgba(255,255,255,0.14)" }}
          />
        </section>

        <section className="service-highlights">
          {Array.from({ length: 4 }).map((_, index) => (
            <span
              className="skeleton-block"
              key={index}
              style={{ height: "36px", width: "140px", borderRadius: "999px" }}
            />
          ))}
        </section>

        <section className="page-content">
          <div className="skeleton-block" style={{ height: "18px", width: "80%" }} />
          <div className="skeleton-block" style={{ height: "18px", width: "60%" }} />
          <div
            className="skeleton-block"
            style={{ height: "320px", width: "100%", maxWidth: "720px", margin: "10px auto 0" }}
          />
        </section>
      </Layout>
    );
  }

  if (!service) {
    return (
      <Layout>
        <section className="page-hero">
          <h1>Service Not Found</h1>
          <p>
            We couldn't find that service. <a href="/">Return home</a>.
          </p>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="page-hero service-page-hero">
        <span className="section-kicker">Service</span>
        <h1>{service.title}</h1>
        {service.tagline ? <p>{service.tagline}</p> : null}
      </section>

      {service.highlights?.length ? (
        <section className="service-highlights">
          {service.highlights.map((highlight) => (
            <span className="highlight-chip" key={highlight}>
              <CheckIcon /> {highlight}
            </span>
          ))}
        </section>
      ) : null}

      <section className="page-content">
        {service.shortDescription ? <p className="lead-paragraph">{service.shortDescription}</p> : null}

        {service.middleImage?.url ? (
          <figure className="service-single-image">
            <ShimmerImage
              src={resolveAssetUrl(service.middleImage.url)}
              alt={service.middleImage.caption || service.title}
              width="720"
              height="420"
            />
            {service.middleImage.caption ? <figcaption>{service.middleImage.caption}</figcaption> : null}
          </figure>
        ) : null}

        {service.detailedDescription ? <p>{service.detailedDescription}</p> : null}
      </section>

      <section className="service-cta">
        <div className="hero-cta-row">
          <a className="primary-button hero-cta hero-cta-call" href={`tel:${CALL_TEL}`}>
            <PhoneIcon /> Call Now
          </a>
          <a
            className="primary-button hero-cta hero-cta-whatsapp"
            href={whatsappBookingUrl(service.title)}
            target="_blank"
            rel="noreferrer"
          >
            <WhatsAppIcon /> WhatsApp
          </a>
        </div>
      </section>

      {service.bottomImage?.url ? (
        <section className="page-content">
          <figure className="service-single-image">
            <ShimmerImage
              src={resolveAssetUrl(service.bottomImage.url)}
              alt={service.bottomImage.caption || service.title}
              width="720"
              height="420"
            />
            {service.bottomImage.caption ? <figcaption>{service.bottomImage.caption}</figcaption> : null}
          </figure>
        </section>
      ) : null}

      <section className="other-services-section">
        <div className="section-header">
          <span className="section-kicker">Other Services</span>
        </div>
        <div className="other-services-row">
          {SERVICES.filter((item) => item.slug !== slug).map((item) => {
            const cardImage = settings?.pages?.services?.[item.slug]?.cardImage;

            return (
              <a className="other-service-card" href={item.href} key={item.slug}>
                {cardImage ? (
                  <div className="other-service-card-image">
                    <ShimmerImage
                      src={resolveAssetUrl(cardImage)}
                      alt={item.title}
                      width="260"
                      height="160"
                    />
                  </div>
                ) : (
                  <div className="service-icon" aria-hidden="true">
                    {item.icon === "tv" ? <TvIcon /> : <WrenchIcon />}
                  </div>
                )}
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <span className="other-service-more">More →</span>
              </a>
            );
          })}
        </div>
      </section>
    </Layout>
  );
}

function CheckIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
      <path d="M20 6 9 17l-5-5" />
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

function WhatsAppIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.28-1.39a9.87 9.87 0 0 0 4.76 1.21h.01c5.46 0 9.9-4.45 9.9-9.91C21.96 6.45 17.5 2 12.04 2zm5.8 14.05c-.24.68-1.4 1.3-1.93 1.38-.5.08-1.12.11-1.8-.11-.42-.13-.96-.31-1.65-.6-2.9-1.25-4.8-4.17-4.94-4.36-.14-.19-1.17-1.56-1.17-2.98s.73-2.11 1-2.4c.24-.27.53-.34.7-.34h.5c.16 0 .38-.03.58.44.24.55.79 1.93.86 2.07.07.14.11.31.02.5-.09.19-.14.31-.27.48-.14.16-.29.36-.42.49-.14.14-.28.29-.12.57.16.28.71 1.17 1.53 1.9 1.05.94 1.94 1.23 2.22 1.37.28.14.44.12.6-.07.16-.19.68-.79.87-1.06.19-.27.37-.22.62-.13.26.09 1.62.76 1.9.9.28.14.46.21.53.32.07.13.07.68-.17 1.35z" />
    </svg>
  );
}
