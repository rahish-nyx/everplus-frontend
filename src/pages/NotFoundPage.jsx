import Layout from "../components/Layout.jsx";

export default function NotFoundPage() {
  return (
    <Layout>
      <section className="page-hero">
        <span className="section-kicker">404</span>
        <h1>Page not found</h1>
        <p>The page you're looking for doesn't exist or may have moved. Try one of these instead:</p>
      </section>
      <section className="page-content">
        <ul className="checklist">
          <li><a href="/">Home</a></li>
          <li><a href="/services/ac-repair">AC Repair</a></li>
          <li><a href="/services/washing-machine-repair">Washing Machine Repair</a></li>
          <li><a href="/services/refrigerator-repair">Refrigerator Repair</a></li>
          <li><a href="/services/microwave-repair">Microwave Repair</a></li>
          <li><a href="/services/led-tv-repair">LED &amp; Smart TV Repair</a></li>
          <li><a href="/contact">Contact Us</a></li>
          <li><a href="/faq">FAQ</a></li>
        </ul>
      </section>
    </Layout>
  );
}
