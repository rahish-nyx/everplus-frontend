import { useEffect } from "react";
import Layout from "../components/Layout.jsx";
import { useSettings } from "../settingsContext.jsx";

export default function FaqPage() {
  const { settings } = useSettings();
  const items = settings?.pages?.faq?.items || [];

  useEffect(() => {
    document.title = "FAQ | EverPlus";
  }, []);

  return (
    <Layout>
      <section className="page-hero">
        <span className="section-kicker">Have Questions?</span>
        <h1>Frequently Asked Questions</h1>
      </section>

      <section className="faq-list">
        {items.length === 0 ? (
          <p className="empty-state">FAQs coming soon.</p>
        ) : (
          items.map((item) => (
            <details className="faq-item" key={item.id}>
              <summary>
                {item.question}
                <ChevronIcon />
              </summary>
              <p>{item.answer}</p>
            </details>
          ))
        )}
      </section>
    </Layout>
  );
}

function ChevronIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" className="faq-chevron">
      <path d="M9 18l6-6-6-6" />
    </svg>
  );
}
