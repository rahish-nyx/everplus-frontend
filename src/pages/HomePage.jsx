import { useEffect } from "react";
import Layout from "../components/Layout.jsx";
import Hero from "../components/Hero.jsx";
import ServiceGrid from "../components/ServiceGrid.jsx";
import BrandLogos from "../components/BrandLogos.jsx";
import { useSettings } from "../settingsContext.jsx";

function setMeta(name, content, attr = "name") {
  if (!content) return;
  let tag = document.head.querySelector(`meta[${attr}="${name}"]`);
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute(attr, name);
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", content);
}

function applySeo(seo) {
  if (!seo) return;
  if (seo.title) document.title = seo.title;
  setMeta("description", seo.description);
  setMeta("keywords", seo.keywords);
  setMeta("og:title", seo.title, "property");
  setMeta("og:description", seo.description, "property");
}

export default function HomePage() {
  const { settings } = useSettings();

  useEffect(() => {
    if (settings?.seo) applySeo(settings.seo);
  }, [settings]);

  return (
    <Layout>
      <Hero slides={settings?.heroSlides} currentOffer={settings?.currentOffer} />
      <ServiceGrid />
      <BrandLogos logos={settings?.brandLogos} />
      <section className="reviews-band" id="reviews">
        <div>
          <span className="section-kicker">Homeowner Approved</span>
          <h2>Fast answers, clean work, and no surprise pricing.</h2>
        </div>
        <div className="review-summary">
          <strong>4.9/5</strong>
          <span>Average rating from local HVAC and appliance repair clients.</span>
        </div>
      </section>
    </Layout>
  );
}
