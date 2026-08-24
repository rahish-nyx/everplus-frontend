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
