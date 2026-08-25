import { useEffect } from "react";
import Layout from "../components/Layout.jsx";
import Hero from "../components/Hero.jsx";
import ServiceGrid from "../components/ServiceGrid.jsx";
import BrandLogos from "../components/BrandLogos.jsx";
import ReviewsSection from "../components/ReviewsSection.jsx";
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
      <ServiceGrid services={settings?.pages?.services} />
      {/* loading={!settings}: BrandLogos returns null while empty, which is
          also true during the loading state — this tells it to show a
          skeleton instead of disappearing until settings actually arrives. */}
      <BrandLogos logos={settings?.brandLogos} loading={!settings} />
      {/* ReviewsSection fetches its own ratings data independently of
          settings, so it tracks its own loading state internally —
          no prop needed here. */}
      <ReviewsSection reviews={settings?.pages?.reviews} />
    </Layout>
  );
}
