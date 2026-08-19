import { useEffect } from "react";
import Layout from "../components/Layout.jsx";
import { useSettings } from "../settingsContext.jsx";
import { resolveAssetUrl } from "../api.js";
import { whatsappBookingUrl } from "../whatsapp.js";

export default function ServicePage({ slug }) {
  const { settings } = useSettings();
  const service = settings?.pages?.services?.[slug];

  useEffect(() => {
    if (service?.title) document.title = `${service.title} | EverPlus`;
  }, [service]);

  if (settings && !service) {
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
        <h1>{service?.title || "Loading…"}</h1>
        {service?.tagline ? <p>{service.tagline}</p> : null}
      </section>

      {service?.highlights?.length ? (
        <section className="service-highlights">
          {service.highlights.map((highlight) => (
            <span className="highlight-chip" key={highlight}>
              <CheckIcon /> {highlight}
            </span>
          ))}
        </section>
      ) : null}

      {service ? (
        <section className="page-content">
          {service.shortDescription ? <p className="lead-paragraph">{service.shortDescription}</p> : null}

          {service.middleImage?.url ? (
            <figure className="service-single-image">
              <img src={resolveAssetUrl(service.middleImage.url)} alt={service.middleImage.caption || service.title} />
              {service.middleImage.caption ? <figcaption>{service.middleImage.caption}</figcaption> : null}
            </figure>
          ) : null}

          {service.detailedDescription ? <p>{service.detailedDescription}</p> : null}
        </section>
      ) : null}

      <section className="service-cta">
        <a
          className="primary-button"
          href={whatsappBookingUrl(service?.title)}
          target="_blank"
          rel="noreferrer"
        >
          Book This Repair
        </a>
      </section>

      {service?.bottomImage?.url ? (
        <section className="page-content">
          <figure className="service-single-image">
            <img src={resolveAssetUrl(service.bottomImage.url)} alt={service.bottomImage.caption || service.title} />
            {service.bottomImage.caption ? <figcaption>{service.bottomImage.caption}</figcaption> : null}
          </figure>
        </section>
      ) : null}
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
