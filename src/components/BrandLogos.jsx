import { resolveAssetUrl } from "../api.js";
import ShimmerImage from "./ShimmerImage.jsx";

const SKELETON_COUNT = 10;

export default function BrandLogos({ logos, loading }) {
  // loading === true means settings hasn't arrived yet — show skeleton
  // cards instead of disappearing, so the section doesn't "pop in" once
  // the real data loads. Once settings has loaded, if there genuinely are
  // no logos configured, render nothing (same as before).
  if (loading) {
    return (
      <section className="brand-logos-section">
        <div className="section-header">
          <span className="section-kicker">Brands We Service</span>
          <h2>Professional Service for Leading Brands</h2>
        </div>
        <div className="brand-logos-grid">
          {Array.from({ length: SKELETON_COUNT }).map((_, index) => (
            <div className="brand-logo-card" key={index}>
              <div className="skeleton-block" style={{ width: "100%", height: "60px" }} />
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (!logos || !logos.length) return null;

  return (
    <section className="brand-logos-section">
      <div className="section-header">
        <span className="section-kicker">Brands We Service</span>
        <h2>Professional Service for Leading Brands</h2>
      </div>
      <div className="brand-logos-grid">
        {logos.map((logo) => (
          <div className="brand-logo-card" key={logo.id}>
            {logo.image ? (
              <ShimmerImage
                src={resolveAssetUrl(logo.image)}
                alt={logo.name || "Brand logo"}
                width="160"
                height="100"
              />
            ) : (
              <span>{logo.name}</span>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
