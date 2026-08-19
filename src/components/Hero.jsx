import { useEffect, useRef, useState } from "react";
import { resolveAssetUrl } from "../api.js";
import { whatsappBookingUrl } from "../whatsapp.js";

const AUTOPLAY_MS = 6000;

// Shown instantly on load and as a safety net if /api/settings hasn't
// responded yet (or the backend is unreachable), so the hero is never blank.
const FALLBACK_SLIDES = [
  {
    id: "fallback-ac",
    badge: "AC REPAIR SPECIAL",
    title: "Fast AC Repair, Any Day of the Week",
    subtitle: "Certified technicians restore your cooling fast — upfront pricing, no surprises.",
    price: "$59 Diagnostic",
    ctaText: "Schedule AC Repair",
    image: "",
    serviceType: "AC Repair"
  },
  {
    id: "fallback-washer",
    badge: "WASHING MACHINE EXPERTS",
    title: "Washing Machine Repair Done Right",
    subtitle: "Leaks, noise, or a machine that won't spin — we fix it same day.",
    price: "$49 Service Call",
    ctaText: "Book a Repair",
    image: "",
    serviceType: "Washing Machine Repair"
  },
  {
    id: "fallback-tv",
    badge: "LED TV REPAIR",
    title: "LED & Smart TV Repair Specialists",
    subtitle: "Screen, panel, and power issues fixed by certified electronics technicians.",
    price: "Free Estimate",
    ctaText: "Get a Free Estimate",
    image: "",
    serviceType: "LED TV Repair"
  }
];

export default function Hero({ slides, currentOffer }) {
  const safeSlides = slides && slides.length ? slides : FALLBACK_SLIDES;
  const [active, setActive] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    if (safeSlides.length < 2) return undefined;

    timerRef.current = setInterval(() => {
      setActive((current) => (current + 1) % safeSlides.length);
    }, AUTOPLAY_MS);

    return () => clearInterval(timerRef.current);
  }, [safeSlides.length]);

  if (!safeSlides.length) {
    return null;
  }

  const goTo = (index) => {
    clearInterval(timerRef.current);
    setActive((index + safeSlides.length) % safeSlides.length);
  };

  const slide = safeSlides[active];

  return (
    <section className="hero hero-carousel" aria-roledescription="carousel">
      <button
        type="button"
        className="hero-arrow hero-arrow-prev"
        aria-label="Previous slide"
        onClick={() => goTo(active - 1)}
      >
        <ChevronIcon flip />
      </button>

      <div className="hero-copy" key={slide.id}>
        {slide.badge ? <span className="offer-pill">{slide.badge}</span> : null}
        <h1>{slide.title || "We Fix It Fast"}</h1>
        {slide.subtitle ? <h2>{slide.subtitle}</h2> : null}

        <div className="trust-badges">
          {slide.price ? (
            <span>
              <PriceTagIcon /> {slide.price}
            </span>
          ) : currentOffer ? (
            <span>
              <PriceTagIcon /> {currentOffer}
            </span>
          ) : null}
          <span>
            <ShieldIcon /> Licensed &amp; Insured
          </span>
          <span>
            <ClockIcon /> Same-Day Availability
          </span>
        </div>

        <a
          className="primary-button hero-cta"
          href={whatsappBookingUrl(slide.serviceType || slide.title)}
          target="_blank"
          rel="noreferrer"
        >
          {slide.ctaText || "Schedule Now"}
        </a>
      </div>

      <div className="hero-photo">
        {slide.image ? (
          <img src={resolveAssetUrl(slide.image)} alt={slide.title || "Service technician at work"} />
        ) : (
          <div className="hero-photo-placeholder" aria-hidden="true">
            {slide.serviceType || "EverPlus"}
          </div>
        )}
      </div>

      <button
        type="button"
        className="hero-arrow hero-arrow-next"
        aria-label="Next slide"
        onClick={() => goTo(active + 1)}
      >
        <ChevronIcon />
      </button>

      <div className="hero-dots">
        {safeSlides.map((item, index) => (
          <button
            key={item.id}
            type="button"
            className={`hero-dot ${index === active ? "is-active" : ""}`}
            aria-label={`Go to slide ${index + 1}`}
            onClick={() => goTo(index)}
          />
        ))}
      </div>
    </section>
  );
}

function ChevronIcon({ flip }) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      style={{ transform: flip ? "rotate(180deg)" : "none" }}
    >
      <path d="M9 18l6-6-6-6" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 3" />
    </svg>
  );
}

function PriceTagIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20.59 13.41 11 3.83A2 2 0 0 0 9.59 3.24L4 3a1 1 0 0 0-1 1l.24 5.59a2 2 0 0 0 .59 1.41l9.58 9.59a2 2 0 0 0 2.83 0l4.35-4.35a2 2 0 0 0 0-2.83z" />
      <circle cx="7.5" cy="7.5" r="1.2" />
    </svg>
  );
}
