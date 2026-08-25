import { useEffect } from "react";
import Layout from "../components/Layout.jsx";
import { useSettings } from "../settingsContext.jsx";
import { applyPageMeta } from "../seo.js";

export default function AboutPage() {
  const { settings } = useSettings();
  const about = settings?.pages?.about;

  useEffect(() => {
    if (about?.heading) applyPageMeta(`${about.heading} | EverPlus`, about.intro);
  }, [about]);

  if (!settings) {
    return (
      <Layout>
        <section className="page-hero">
          <span className="section-kicker">About Us</span>
          <div
            className="skeleton-block"
            style={{ height: "42px", width: "min(420px, 55%)", marginBottom: "14px", background: "rgba(255,255,255,0.14)" }}
          />
          <div
            className="skeleton-block"
            style={{ height: "18px", width: "min(560px, 70%)", background: "rgba(255,255,255,0.14)" }}
          />
        </section>

        <section className="page-content">
          <div className="content-block">
            <div className="skeleton-block" style={{ height: "22px", width: "160px", marginBottom: "12px" }} />
            <div className="skeleton-block" style={{ height: "16px", width: "100%", marginBottom: "6px" }} />
            <div className="skeleton-block" style={{ height: "16px", width: "92%" }} />
          </div>

          <div className="content-block">
            <div className="skeleton-block" style={{ height: "22px", width: "160px", marginBottom: "12px" }} />
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="skeleton-block" style={{ height: "40px", width: "100%", marginBottom: "8px" }} />
            ))}
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="page-hero">
        <span className="section-kicker">About Us</span>
        <h1>{about?.heading || "About EverPlus"}</h1>
        {about?.intro ? <p>{about.intro}</p> : null}
      </section>

      {about ? (
        <section className="page-content">
          <div className="content-block">
            <h2>Who We Are</h2>
            <p>{about.whoWeAreBody}</p>
          </div>

          {about.whatWeDoList?.length ? (
            <div className="content-block">
              <h2>What We Do</h2>
              <p>We specialize in repairing and servicing home appliances, including:</p>
              <ul className="checklist">
                {about.whatWeDoList.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ) : null}

          {about.disclaimer ? (
            <div className="content-block disclaimer-block">
              <h2>Not a Manufacturer or Authorized Service Center</h2>
              <p>{about.disclaimer}</p>
            </div>
          ) : null}
        </section>
      ) : null}
    </Layout>
  );
}
