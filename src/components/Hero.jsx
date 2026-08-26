import { useEffect, useRef, useState } from "react";
import { resolveAssetUrl } from "../api.js";
import ShimmerImage from "./ShimmerImage.jsx";
import { whatsappBookingUrl, CALL_TEL } from "../whatsapp.js";

const AUTOPLAY_MS = 6000;
const SWIPE_THRESHOLD = 40;

// Shown instantly on load and as a safety net if /api/settings hasn't
// responded yet (or the backend is unreachable), so the hero is never blank.
const FALLBACK_SLIDES = [
  {
    id: "fallback-ac",
    badge: "AC REPAIR SPECIAL",
    title: "Fast AC Repair, Any Day of the Week",
    subtitle: "Certified technicians restore your cooling fast — upfront pricing, no surprises.",
    price: "  ₹300 Service Call",
    ctaText: "Schedule AC Repair",
    image: "",
    serviceType: "AC Repair"
  },
  {
    id: "fallback-washer",
    badge: "WASHING MACHINE EXPERTS",
    title: "Washing Machine Repair Done Right",
    subtitle: "Leaks, noise, or a machine that won't spin — we fix it same day.",
    price: " ₹300 Service Call",
    ctaText: "Book a Repair",
    image: "",
    serviceType: "Washing Machine Repair"
  },
  {
    id: "fallback-tv",
    badge: "LED TV REPAIR",
    title: "LED & Smart TV Repair Specialists",
    subtitle: "Screen, panel, and power issues fixed by certified electronics technicians.",
    price: " ₹300 Service Call",
    ctaText: "Book a Repair",
    image: "",
    serviceType: "LED TV Repair"
  }
];

export default function Hero({ slides, currentOffer }) {
  const safeSlides = slides && slides.length ? slides : FALLBACK_SLIDES;
  const [active, setActive] = useState(0);
  const timerRef = useRef(null);
  const touchStartX = useRef(null);
  const touchDeltaX = useRef(0);

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

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    touchDeltaX.current = 0;
  };

  const handleTouchMove = (e) => {
    if (touchStartX.current === null) return;
    touchDeltaX.current = e.touches[0].clientX - touchStartX.current;
  };

  const handleTouchEnd = () => {
    if (Math.abs(touchDeltaX.current) > SWIPE_THRESHOLD) {
      if (touchDeltaX.current < 0) {
        goTo(active + 1);
      } else {
        goTo(active - 1);
      }
    }
    touchStartX.current = null;
    touchDeltaX.current = 0;
  };

  const slide = safeSlides[active];

  return (
    <section
      className="hero hero-carousel"
      aria-roledescription="carousel"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
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

        <div className="hero-cta-row">
          <a className="primary-button hero-cta hero-cta-call" href={`tel:${CALL_TEL}`}>
            <PhoneIcon /> Call Now
          </a>
          <a
            className="primary-button hero-cta hero-cta-whatsapp"
            href={whatsappBookingUrl(slide.serviceType || slide.title)}
            target="_blank"
            rel="noreferrer"
          >
            <WhatsAppIcon /> WhatsApp
          </a>
        </div>
      </div>

      <div className="hero-photo">
        {slide.image ? (
          <ShimmerImage
            src={resolveAssetUrl(slide.image)}
            alt={slide.title || "Service technician at work"}
            width="620"
            height="465"
          />
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
