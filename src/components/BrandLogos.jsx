import { resolveAssetUrl } from "../api.js";

export default function BrandLogos({ logos }) {
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
              <img src={resolveAssetUrl(logo.image)} alt={logo.name || "Brand logo"} />
            ) : (
              <span>{logo.name}</span>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
