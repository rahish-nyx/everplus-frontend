import { resolveAssetUrl } from "../api.js";

const SERVICES = [
  {
    slug: "ac-repair",
    title: "AC Repair",
    href: "/services/ac-repair",
    icon: "wrench",
    description: "Diagnostics and repair for units that won't cool, trip breakers, or leak refrigerant."
  },
  {
    slug: "washing-machine-repair",
    title: "Washing Machine Repair",
    href: "/services/washing-machine-repair",
    icon: "wrench",
    description: "Fix leaks, drum noise, drainage issues, and machines that won't spin or start."
  },
  {
    slug: "refrigerator-repair",
    title: "Refrigerator Repair Services",
    href: "/services/refrigerator-repair",
    icon: "wrench",
    description: "Restore proper cooling, stop leaks, and fix compressor or thermostat failures."
  },
  {
    slug: "microwave-repair",
    title: "Microwave Repair",
    href: "/services/microwave-repair",
    icon: "wrench",
    description: "Repairs for microwaves that won't heat, spark, or power on."
  },
  {
    slug: "led-tv-repair",
    title: "LED & Smart TV Repair",
    href: "/services/led-tv-repair",
    icon: "tv",
    description: "Screen, panel, backlight, and power issues fixed by certified electronics technicians."
  }
];

export default function ServiceGrid({ services }) {
  return (
    <section className="service-section" id="services">
      <div className="section-header">
        <span className="section-kicker">What We Fix</span>
        <h2>Appliance &amp; AC Repair Services Near You</h2>
      </div>
      <div className="service-grid">
        {SERVICES.map((service) => {
          const cardImage = services?.[service.slug]?.cardImage;

          return (
            <div className="service-card" key={service.title}>
              {cardImage ? (
                <div className="service-card-image">
                  <img src={resolveAssetUrl(cardImage)} alt={service.title} />
                </div>
              ) : (
                <div className="service-icon" aria-hidden="true">
                  {service.icon === "tv" ? <TvIcon /> : <WrenchIcon />}
                </div>
              )}
              <h3>{service.title}</h3>
              <p>{service.description}</p>
              <a href={service.href}>More →</a>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function WrenchIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </svg>
  );
}

function TvIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="4" width="20" height="14" rx="2" />
      <line x1="8" y1="21" x2="16" y2="21" />
      <line x1="12" y1="18" x2="12" y2="21" />
    </svg>
  );
}
