import { useEffect, useState } from "react";
import {
  adminLogin,
  deleteLead,
  getAdminLeads,
  getSettings,
  setAdminToken,
  getAdminToken,
  updateAboutSettings,
  updateBrandLogos,
  updateContactSettings,
  updateFaqSettings,
  updateFooterSettings,
  updateGeneralSettings,
  updateHeroSlides,
  updateLeadStatus,
  updateServicesSettings
} from "../api.js";

const TABS = [
  { id: "leads", label: "Leads" },
  { id: "general", label: "Offer & SEO" },
  { id: "hero", label: "Hero Slides" },
  { id: "brands", label: "Brand Logos" },
  { id: "footer", label: "Footer" },
  { id: "about", label: "About Page" },
  { id: "contact", label: "Contact Page" },
  { id: "faq", label: "FAQ" },
  { id: "services", label: "Services" }
];

const DEFAULT_SEO = { title: "", description: "", keywords: "" };
const DEFAULT_FOOTER = {
  companyName: "EverPlus",
  tagline: "",
  phone: "",
  email: "",
  license: "",
  locations: [],
  services: [],
  quickLinks: [],
  social: []
};

const DEFAULT_ABOUT = {
  heading: "About EverPlus",
  intro: "",
  whoWeAreBody: "",
  whatWeDoList: [],
  disclaimer: ""
};

const DEFAULT_CONTACT = { intro: "", whatsappNumber: "", hours: "", image: { url: "", caption: "" } };

const DEFAULT_FAQ_ITEMS = [];

const SERVICE_SLUGS = [
  { slug: "ac-repair", label: "AC Repair" },
  { slug: "washing-machine-repair", label: "Washing Machine Repair" },
  { slug: "refrigerator-repair", label: "Refrigerator Repair Services" },
  { slug: "microwave-repair", label: "Microwave Repair" },
  { slug: "led-tv-repair", label: "LED & Smart TV Repair" }
];

const EMPTY_SERVICE = {
  title: "",
  tagline: "",
  highlights: [],
  shortDescription: "",
  detailedDescription: "",
  middleImage: { url: "", caption: "" },
  bottomImage: { url: "", caption: "" }
};

export default function AdminDashboard() {
  const [token, setToken] = useState(getAdminToken());

  if (!token) {
    return <AdminLogin onLoggedIn={setToken} />;
  }

  return <AdminShell onLogout={() => { setAdminToken(""); setToken(""); }} />;
}

function AdminLogin({ onLoggedIn }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { token } = await adminLogin(password);
      setAdminToken(token);
      onLoggedIn(token);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login">
      <form className="login-card" onSubmit={handleSubmit}>
        <span className="logo admin-logo">
          Ever<span>Plus</span>
        </span>
        <h1>Admin Sign In</h1>
        <p>Manage leads, offers, and site content.</p>
        {error ? <p className="form-error">{error}</p> : null}
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </label>
        <button className="primary-button" type="submit" disabled={loading}>
          {loading ? "Signing in…" : "Sign In"}
        </button>
      </form>
    </div>
  );
}

function AdminShell({ onLogout }) {
  const [activeTab, setActiveTab] = useState("leads");
  const [settings, setSettings] = useState(null);

  const refreshSettings = () => {
    getSettings().then(setSettings).catch(() => {});
  };

  useEffect(() => {
    refreshSettings();
  }, []);

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <span className="logo">
          Ever<span>Plus</span>
        </span>
        <nav>
          {TABS.map((tab) => (
            <a
              key={tab.id}
              href={`#${tab.id}`}
              className={activeTab === tab.id ? "active" : ""}
              onClick={(event) => {
                event.preventDefault();
                setActiveTab(tab.id);
              }}
            >
              {tab.label}
            </a>
          ))}
        </nav>
        <button type="button" className="ghost-button" onClick={onLogout}>
          Log Out
        </button>
      </aside>

      <main className="admin-main">
        {activeTab === "leads" ? <LeadsPanel /> : null}
        {activeTab === "general" && settings ? (
          <GeneralPanel
            settings={{ currentOffer: settings.currentOffer || "", seo: settings.seo || DEFAULT_SEO }}
            onSaved={refreshSettings}
          />
        ) : null}
        {activeTab === "hero" && settings ? (
          <HeroSlidesPanel slides={settings.heroSlides || []} onSaved={refreshSettings} />
        ) : null}
        {activeTab === "brands" && settings ? (
          <BrandLogosPanel logos={settings.brandLogos || []} onSaved={refreshSettings} />
        ) : null}
        {activeTab === "footer" && settings ? (
          <FooterPanel footer={settings.footer || DEFAULT_FOOTER} onSaved={refreshSettings} />
        ) : null}
        {activeTab === "about" && settings ? (
          <AboutPanel about={settings.pages?.about || DEFAULT_ABOUT} onSaved={refreshSettings} />
        ) : null}
        {activeTab === "contact" && settings ? (
          <ContactPanel contact={settings.pages?.contact || DEFAULT_CONTACT} onSaved={refreshSettings} />
        ) : null}
        {activeTab === "faq" && settings ? (
          <FaqPanel items={settings.pages?.faq?.items || DEFAULT_FAQ_ITEMS} onSaved={refreshSettings} />
        ) : null}
        {activeTab === "services" && settings ? (
          <ServicesPanel services={settings.pages?.services || {}} onSaved={refreshSettings} />
        ) : null}
      </main>
    </div>
  );
}

// ---------------- Leads ----------------

function LeadsPanel() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    getAdminLeads()
      .then((data) => setLeads(data.leads))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleStatus = async (id, status) => {
    await updateLeadStatus(id, status);
    load();
  };

  const handleDelete = async (id) => {
    await deleteLead(id);
    load();
  };

  return (
    <>
      <div className="admin-topline">
        <h1>Leads</h1>
        <button className="ghost-button" type="button" onClick={load}>
          Refresh
        </button>
      </div>

      <div className="lead-table-wrap">
        {loading ? (
          <p className="empty-state">Loading leads…</p>
        ) : leads.length === 0 ? (
          <p className="empty-state">No leads yet.</p>
        ) : (
          <table className="lead-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Phone</th>
                <th>Service</th>
                <th>Status</th>
                <th>Received</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead.id}>
                  <td>{lead.name}</td>
                  <td>{lead.phone}</td>
                  <td>{lead.serviceType}</td>
                  <td>
                    <select value={lead.status} onChange={(e) => handleStatus(lead.id, e.target.value)}>
                      <option>New</option>
                      <option>Contacted</option>
                      <option>Completed</option>
                    </select>
                  </td>
                  <td>{new Date(lead.createdAt).toLocaleString()}</td>
                  <td className="table-actions">
                    <a className="call-button" href={`tel:${lead.phone}`}>
                      Call
                    </a>
                    <button className="delete-button" type="button" onClick={() => handleDelete(lead.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}

// ---------------- General / Offer & SEO ----------------

function GeneralPanel({ settings, onSaved }) {
  const [currentOffer, setCurrentOffer] = useState(settings.currentOffer || "");
  const [seo, setSeo] = useState(settings.seo || DEFAULT_SEO);
  const [status, setStatus] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus("Saving…");
    try {
      await updateGeneralSettings({ currentOffer, seo });
      setStatus("Saved.");
      onSaved();
    } catch (err) {
      setStatus(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="admin-topline">
        <h1>Offer &amp; SEO</h1>
      </div>

      {status ? <p className="form-success">{status}</p> : null}

      <div className="offer-manager">
        <label>
          Current Offer (shown site-wide)
          <input value={currentOffer} onChange={(e) => setCurrentOffer(e.target.value)} required />
        </label>
      </div>

      <div className="offer-manager" style={{ flexDirection: "column", alignItems: "stretch", gap: "12px" }}>
        <label>
          SEO Title
          <input value={seo.title} onChange={(e) => setSeo({ ...seo, title: e.target.value })} />
        </label>
        <label>
          Meta Description
          <input value={seo.description} onChange={(e) => setSeo({ ...seo, description: e.target.value })} />
        </label>
        <label>
          Keywords (comma separated)
          <input value={seo.keywords} onChange={(e) => setSeo({ ...seo, keywords: e.target.value })} />
        </label>
      </div>

      <button className="primary-button" type="submit">
        Save Changes
      </button>
    </form>
  );
}

// ---------------- Hero Slides ----------------

function emptySlide() {
  return {
    id: `slide-${Date.now()}`,
    badge: "",
    title: "",
    subtitle: "",
    price: "",
    ctaText: "Schedule Now",
    image: "",
    serviceType: ""
  };
}

function HeroSlidesPanel({ slides, onSaved }) {
  const [items, setItems] = useState(slides || []);
  const [status, setStatus] = useState("");

  const updateSlide = (index, patch) => {
    setItems((current) => current.map((slide, i) => (i === index ? { ...slide, ...patch } : slide)));
  };

  const removeSlide = (index) => {
    setItems((current) => current.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    setStatus("Saving…");
    try {
      await updateHeroSlides(items);
      setStatus("Saved.");
      onSaved();
    } catch (err) {
      setStatus(err.message);
    }
  };

  return (
    <>
      <div className="admin-topline">
        <h1>Hero Slides</h1>
        <button className="ghost-button" type="button" onClick={() => setItems((c) => [...c, emptySlide()])}>
          + Add Slide
        </button>
      </div>

      {status ? <p className="form-success">{status}</p> : null}

      {items.map((slide, index) => (
        <div className="offer-manager" style={{ flexDirection: "column", alignItems: "stretch", gap: "12px" }} key={slide.id}>
          <label>
            Badge Text
            <input value={slide.badge} onChange={(e) => updateSlide(index, { badge: e.target.value })} />
          </label>
          <label>
            Headline
            <input value={slide.title} onChange={(e) => updateSlide(index, { title: e.target.value })} />
          </label>
          <label>
            Subheadline
            <input value={slide.subtitle} onChange={(e) => updateSlide(index, { subtitle: e.target.value })} />
          </label>
          <label>
            Price / Offer
            <input value={slide.price} onChange={(e) => updateSlide(index, { price: e.target.value })} />
          </label>
          <label>
            Button Text
            <input value={slide.ctaText} onChange={(e) => updateSlide(index, { ctaText: e.target.value })} />
          </label>
          <label>
            Service Type (e.g. AC Repair)
            <input value={slide.serviceType} onChange={(e) => updateSlide(index, { serviceType: e.target.value })} />
          </label>
          <label>
            Slide Image Link
            <input
              value={slide.image}
              onChange={(e) => updateSlide(index, { image: e.target.value })}
              placeholder="Paste an image URL (https://...)"
            />
          </label>
          {slide.image ? <img src={slide.image} alt="" style={{ maxWidth: "180px", borderRadius: "6px" }} /> : null}
          <button className="delete-button" type="button" onClick={() => removeSlide(index)}>
            Remove Slide
          </button>
        </div>
      ))}

      <button className="primary-button" type="button" onClick={handleSave}>
        Save Hero Slides
      </button>
    </>
  );
}

// ---------------- Brand Logos ----------------

function BrandLogosPanel({ logos, onSaved }) {
  const [items, setItems] = useState(logos || []);
  const [status, setStatus] = useState("");

  const updateLogo = (index, patch) => {
    setItems((current) => current.map((logo, i) => (i === index ? { ...logo, ...patch } : logo)));
  };

  const removeLogo = (index) => {
    setItems((current) => current.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    setStatus("Saving…");
    try {
      await updateBrandLogos(items);
      setStatus("Saved.");
      onSaved();
    } catch (err) {
      setStatus(err.message);
    }
  };

  return (
    <>
      <div className="admin-topline">
        <h1>Brand Logos</h1>
        <button
          className="ghost-button"
          type="button"
          onClick={() => setItems((c) => [...c, { id: `logo-${Date.now()}`, name: "", image: "" }])}
        >
          + Add Logo
        </button>
      </div>

      {status ? <p className="form-success">{status}</p> : null}

      <div className="brand-logos-grid admin-brand-grid">
        {items.map((logo, index) => (
          <div className="offer-manager" style={{ flexDirection: "column", alignItems: "stretch", gap: "10px" }} key={logo.id}>
            <label>
              Brand Name
              <input value={logo.name} onChange={(e) => updateLogo(index, { name: e.target.value })} />
            </label>
            <label>
              Logo Image Link
              <input
                value={logo.image}
                onChange={(e) => updateLogo(index, { image: e.target.value })}
                placeholder="Paste an image URL (https://...)"
              />
            </label>
            {logo.image ? <img src={logo.image} alt="" style={{ maxWidth: "140px" }} /> : null}
            <button className="delete-button" type="button" onClick={() => removeLogo(index)}>
              Remove
            </button>
          </div>
        ))}
      </div>

      <button className="primary-button" type="button" onClick={handleSave}>
        Save Brand Logos
      </button>
    </>
  );
}

// ---------------- Footer ----------------

function FooterPanel({ footer, onSaved }) {
  const [form, setForm] = useState({
    companyName: "",
    tagline: "",
    phone: "",
    email: "",
    license: "",
    locations: [],
    services: [],
    quickLinks: [],
    social: [],
    ...(footer || {})
  });
  const [status, setStatus] = useState("");

  const updateList = (key, index, patch) => {
    setForm((current) => ({
      ...current,
      [key]: current[key].map((item, i) => (i === index ? { ...item, ...patch } : item))
    }));
  };

  const addToList = (key, empty) => {
    setForm((current) => ({ ...current, [key]: [...current[key], empty] }));
  };

  const removeFromList = (key, index) => {
    setForm((current) => ({ ...current, [key]: current[key].filter((_, i) => i !== index) }));
  };

  const handleSave = async () => {
    setStatus("Saving…");
    try {
      await updateFooterSettings(form);
      setStatus("Saved.");
      onSaved();
    } catch (err) {
      setStatus(err.message);
    }
  };

  return (
    <>
      <div className="admin-topline">
        <h1>Footer</h1>
      </div>

      {status ? <p className="form-success">{status}</p> : null}

      <div className="offer-manager" style={{ flexDirection: "column", alignItems: "stretch", gap: "12px" }}>
        <label>
          Company Name
          <input value={form.companyName} onChange={(e) => setForm({ ...form, companyName: e.target.value })} />
        </label>
        <label>
          Tagline
          <input value={form.tagline} onChange={(e) => setForm({ ...form, tagline: e.target.value })} />
        </label>
        <label>
          Phone
          <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        </label>
        <label>
          Email
          <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </label>
        <label>
          License Number
          <input value={form.license} onChange={(e) => setForm({ ...form, license: e.target.value })} />
        </label>
      </div>

      <h3>Locations</h3>
      {form.locations.map((loc, index) => (
        <div className="offer-manager" key={index}>
          <label>
            City
            <input value={loc.city || ""} onChange={(e) => updateList("locations", index, { city: e.target.value })} />
          </label>
          <label>
            Address
            <input value={loc.address || ""} onChange={(e) => updateList("locations", index, { address: e.target.value })} />
          </label>
          <label>
            Phone
            <input value={loc.phone || ""} onChange={(e) => updateList("locations", index, { phone: e.target.value })} />
          </label>
          <button className="delete-button" type="button" onClick={() => removeFromList("locations", index)}>
            Remove
          </button>
        </div>
      ))}
      <button className="ghost-button" type="button" onClick={() => addToList("locations", { city: "", address: "", phone: "" })}>
        + Add Location
      </button>

      <h3>Quick Links</h3>
      {form.quickLinks.map((link, index) => (
        <div className="offer-manager" key={index}>
          <label>
            Label
            <input value={link.label} onChange={(e) => updateList("quickLinks", index, { label: e.target.value })} />
          </label>
          <label>
            URL
            <input value={link.href} onChange={(e) => updateList("quickLinks", index, { href: e.target.value })} />
          </label>
          <button className="delete-button" type="button" onClick={() => removeFromList("quickLinks", index)}>
            Remove
          </button>
        </div>
      ))}
      <button className="ghost-button" type="button" onClick={() => addToList("quickLinks", { label: "", href: "" })}>
        + Add Quick Link
      </button>

      <h3>Social Links</h3>
      {form.social.map((item, index) => (
        <div className="offer-manager" key={index}>
          <label>
            Platform
            <input value={item.platform} onChange={(e) => updateList("social", index, { platform: e.target.value })} />
          </label>
          <label>
            URL
            <input value={item.url} onChange={(e) => updateList("social", index, { url: e.target.value })} />
          </label>
          <button className="delete-button" type="button" onClick={() => removeFromList("social", index)}>
            Remove
          </button>
        </div>
      ))}
      <button className="ghost-button" type="button" onClick={() => addToList("social", { platform: "", url: "" })}>
        + Add Social Link
      </button>

      <div style={{ marginTop: "18px" }}>
        <button className="primary-button" type="button" onClick={handleSave}>
          Save Footer
        </button>
      </div>
    </>
  );
}

// ---------------- About Page ----------------

function AboutPanel({ about, onSaved }) {
  const [form, setForm] = useState({ ...DEFAULT_ABOUT, ...(about || {}) });
  const [status, setStatus] = useState("");

  const updateListItem = (index, value) => {
    setForm((current) => ({
      ...current,
      whatWeDoList: current.whatWeDoList.map((item, i) => (i === index ? value : item))
    }));
  };

  const addListItem = () => {
    setForm((current) => ({ ...current, whatWeDoList: [...current.whatWeDoList, ""] }));
  };

  const removeListItem = (index) => {
    setForm((current) => ({ ...current, whatWeDoList: current.whatWeDoList.filter((_, i) => i !== index) }));
  };

  const handleSave = async () => {
    setStatus("Saving…");
    try {
      await updateAboutSettings(form);
      setStatus("Saved.");
      onSaved();
    } catch (err) {
      setStatus(err.message);
    }
  };

  return (
    <>
      <div className="admin-topline">
        <h1>About Page</h1>
      </div>

      {status ? <p className="form-success">{status}</p> : null}

      <div className="offer-manager" style={{ flexDirection: "column", alignItems: "stretch", gap: "12px" }}>
        <label>
          Heading
          <input value={form.heading} onChange={(e) => setForm({ ...form, heading: e.target.value })} />
        </label>
        <label>
          Intro Paragraph
          <input value={form.intro} onChange={(e) => setForm({ ...form, intro: e.target.value })} />
        </label>
        <label>
          "Who We Are" Body
          <input value={form.whoWeAreBody} onChange={(e) => setForm({ ...form, whoWeAreBody: e.target.value })} />
        </label>
      </div>

      <h3>"What We Do" List</h3>
      {form.whatWeDoList.map((item, index) => (
        <div className="offer-manager" key={index}>
          <label>
            Item
            <input value={item} onChange={(e) => updateListItem(index, e.target.value)} />
          </label>
          <button className="delete-button" type="button" onClick={() => removeListItem(index)}>
            Remove
          </button>
        </div>
      ))}
      <button className="ghost-button" type="button" onClick={addListItem}>
        + Add Item
      </button>

      <div className="offer-manager" style={{ flexDirection: "column", alignItems: "stretch", gap: "12px", marginTop: "18px" }}>
        <label>
          Disclaimer
          <input value={form.disclaimer} onChange={(e) => setForm({ ...form, disclaimer: e.target.value })} />
        </label>
      </div>

      <div style={{ marginTop: "18px" }}>
        <button className="primary-button" type="button" onClick={handleSave}>
          Save About Page
        </button>
      </div>
    </>
  );
}

// ---------------- Contact Page ----------------

function ContactPanel({ contact, onSaved }) {
  const [form, setForm] = useState({
    ...DEFAULT_CONTACT,
    ...(contact || {}),
    image: { ...DEFAULT_CONTACT.image, ...(contact?.image || {}) }
  });
  const [status, setStatus] = useState("");

  const handleSave = async () => {
    setStatus("Saving…");
    try {
      await updateContactSettings(form);
      setStatus("Saved.");
      onSaved();
    } catch (err) {
      setStatus(err.message);
    }
  };

  return (
    <>
      <div className="admin-topline">
        <h1>Contact Page</h1>
      </div>

      {status ? <p className="form-success">{status}</p> : null}

      <div className="offer-manager" style={{ flexDirection: "column", alignItems: "stretch", gap: "12px" }}>
        <label>
          Intro Paragraph
          <input value={form.intro} onChange={(e) => setForm({ ...form, intro: e.target.value })} />
        </label>
        <label>
          WhatsApp Number (digits only, with country code — e.g. 917869130336)
          <input
            value={form.whatsappNumber}
            onChange={(e) => setForm({ ...form, whatsappNumber: e.target.value })}
            placeholder="Defaults to the footer phone number if left blank"
          />
        </label>
        <label>
          Business Hours
          <input value={form.hours} onChange={(e) => setForm({ ...form, hours: e.target.value })} />
        </label>
      </div>

      <h3>Contact Page Image</h3>
      <div className="offer-manager" style={{ flexDirection: "column", alignItems: "stretch", gap: "10px" }}>
        <label>
          Image Link
          <input
            value={form.image.url}
            onChange={(e) => setForm({ ...form, image: { ...form.image, url: e.target.value } })}
            placeholder="Paste an image URL (https://...)"
          />
        </label>
        <label>
          Caption (optional)
          <input
            value={form.image.caption}
            onChange={(e) => setForm({ ...form, image: { ...form.image, caption: e.target.value } })}
          />
        </label>
        {form.image.url ? (
          <img src={form.image.url} alt="" style={{ maxWidth: "220px", borderRadius: "6px" }} />
        ) : null}
      </div>

      <p style={{ color: "var(--muted)", fontSize: "0.86rem" }}>
        Phone and email shown on the Contact page come from the Footer tab — update them there.
      </p>

      <div style={{ marginTop: "10px" }}>
        <button className="primary-button" type="button" onClick={handleSave}>
          Save Contact Page
        </button>
      </div>
    </>
  );
}

// ---------------- FAQ ----------------

function FaqPanel({ items, onSaved }) {
  const [list, setList] = useState(items || []);
  const [status, setStatus] = useState("");

  const updateItem = (index, patch) => {
    setList((current) => current.map((item, i) => (i === index ? { ...item, ...patch } : item)));
  };

  const removeItem = (index) => {
    setList((current) => current.filter((_, i) => i !== index));
  };

  const addItem = () => {
    setList((current) => [...current, { id: `faq-${Date.now()}`, question: "", answer: "" }]);
  };

  const handleSave = async () => {
    setStatus("Saving…");
    try {
      await updateFaqSettings(list);
      setStatus("Saved.");
      onSaved();
    } catch (err) {
      setStatus(err.message);
    }
  };

  return (
    <>
      <div className="admin-topline">
        <h1>FAQ</h1>
        <button className="ghost-button" type="button" onClick={addItem}>
          + Add Question
        </button>
      </div>

      {status ? <p className="form-success">{status}</p> : null}

      {list.map((item, index) => (
        <div className="offer-manager" style={{ flexDirection: "column", alignItems: "stretch", gap: "10px" }} key={item.id}>
          <label>
            Question
            <input value={item.question} onChange={(e) => updateItem(index, { question: e.target.value })} />
          </label>
          <label>
            Answer
            <input value={item.answer} onChange={(e) => updateItem(index, { answer: e.target.value })} />
          </label>
          <button className="delete-button" type="button" onClick={() => removeItem(index)}>
            Remove
          </button>
        </div>
      ))}

      <button className="primary-button" type="button" onClick={handleSave}>
        Save FAQ
      </button>
    </>
  );
}

// ---------------- Services ----------------

function ServicesPanel({ services, onSaved }) {
  const [items, setItems] = useState(() => {
    const initial = {};
    SERVICE_SLUGS.forEach(({ slug }) => {
      initial[slug] = { ...EMPTY_SERVICE, ...(services[slug] || {}) };
    });
    return initial;
  });
  const [activeSlug, setActiveSlug] = useState(SERVICE_SLUGS[0].slug);
  const [status, setStatus] = useState("");

  const current = items[activeSlug];

  const updateCurrent = (patch) => {
    setItems((prev) => ({ ...prev, [activeSlug]: { ...prev[activeSlug], ...patch } }));
  };

  const updateHighlight = (index, value) => {
    updateCurrent({ highlights: current.highlights.map((h, i) => (i === index ? value : h)) });
  };

  const addHighlight = () => updateCurrent({ highlights: [...current.highlights, ""] });
  const removeHighlight = (index) =>
    updateCurrent({ highlights: current.highlights.filter((_, i) => i !== index) });

  const updateMiddleImage = (patch) => {
    updateCurrent({ middleImage: { ...current.middleImage, ...patch } });
  };

  const updateBottomImage = (patch) => {
    updateCurrent({ bottomImage: { ...current.bottomImage, ...patch } });
  };

  const handleSave = async () => {
    setStatus("Saving…");
    try {
      await updateServicesSettings(items);
      setStatus("Saved.");
      onSaved();
    } catch (err) {
      setStatus(err.message);
    }
  };

  return (
    <>
      <div className="admin-topline">
        <h1>Services</h1>
      </div>

      {status ? <p className="form-success">{status}</p> : null}

      <div className="service-tab-picker">
        {SERVICE_SLUGS.map(({ slug, label }) => (
          <button
            key={slug}
            type="button"
            className={`ghost-button ${activeSlug === slug ? "is-active-pill" : ""}`}
            onClick={() => setActiveSlug(slug)}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="offer-manager" style={{ flexDirection: "column", alignItems: "stretch", gap: "12px" }}>
        <label>
          Title
          <input value={current.title} onChange={(e) => updateCurrent({ title: e.target.value })} />
        </label>
        <label>
          Tagline
          <input value={current.tagline} onChange={(e) => updateCurrent({ tagline: e.target.value })} />
        </label>
        <label>
          Short Description
          <input value={current.shortDescription} onChange={(e) => updateCurrent({ shortDescription: e.target.value })} />
        </label>
        <label>
          Detailed Description
          <input value={current.detailedDescription} onChange={(e) => updateCurrent({ detailedDescription: e.target.value })} />
        </label>
      </div>

      <h3>Highlights</h3>
      {current.highlights.map((h, index) => (
        <div className="offer-manager" key={index}>
          <label>
            Highlight
            <input value={h} onChange={(e) => updateHighlight(index, e.target.value)} />
          </label>
          <button className="delete-button" type="button" onClick={() => removeHighlight(index)}>
            Remove
          </button>
        </div>
      ))}
      <button className="ghost-button" type="button" onClick={addHighlight}>
        + Add Highlight
      </button>

      <h3>Middle Image (shown in the middle of the page)</h3>
      <div className="offer-manager" style={{ flexDirection: "column", alignItems: "stretch", gap: "10px" }}>
        <label>
          Image Link
          <input
            value={current.middleImage.url}
            onChange={(e) => updateMiddleImage({ url: e.target.value })}
            placeholder="Paste an image URL (https://...)"
          />
        </label>
        <label>
          Caption (optional)
          <input value={current.middleImage.caption} onChange={(e) => updateMiddleImage({ caption: e.target.value })} />
        </label>
        {current.middleImage.url ? (
          <img src={current.middleImage.url} alt="" style={{ maxWidth: "220px", borderRadius: "6px" }} />
        ) : null}
      </div>

      <h3>Image Below the Book Button</h3>
      <div className="offer-manager" style={{ flexDirection: "column", alignItems: "stretch", gap: "10px" }}>
        <label>
          Image Link
          <input
            value={current.bottomImage.url}
            onChange={(e) => updateBottomImage({ url: e.target.value })}
            placeholder="Paste an image URL (https://...)"
          />
        </label>
        <label>
          Caption (optional)
          <input value={current.bottomImage.caption} onChange={(e) => updateBottomImage({ caption: e.target.value })} />
        </label>
        {current.bottomImage.url ? (
          <img src={current.bottomImage.url} alt="" style={{ maxWidth: "220px", borderRadius: "6px" }} />
        ) : null}
      </div>

      <div style={{ marginTop: "18px" }}>
        <button className="primary-button" type="button" onClick={handleSave}>
          Save Services
        </button>
      </div>
    </>
  );
}
