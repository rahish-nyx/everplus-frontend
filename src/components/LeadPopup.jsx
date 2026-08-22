import { useEffect, useState } from "react";
import { createLead } from "../api.js";

const SESSION_KEY = "everplus_lead_popup_shown";
const AUTO_OPEN_DELAY_MS = 8000;

const SERVICE_OPTIONS = [
  "AC Repair",
  "Washing Machine Repair",
  "Refrigerator Repair",
  "Microwave Repair",
  "LED & Smart TV Repair"
];

export default function LeadPopup() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", email: "", location: "", serviceType: SERVICE_OPTIONS[0] });
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY)) return;

    const timer = setTimeout(() => {
      setOpen(true);
      sessionStorage.setItem(SESSION_KEY, "1");
    }, AUTO_OPEN_DELAY_MS);

    const handleOpenRequest = () => setOpen(true);
    window.addEventListener("everplus:open-lead-popup", handleOpenRequest);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("everplus:open-lead-popup", handleOpenRequest);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.name.trim() || !form.phone.trim()) {
      setError("Please enter your name and phone number.");
      return;
    }

    setStatus("submitting");

    try {
      await createLead({
        name: form.name,
        phone: form.phone,
        email: form.email,
        location: form.location,
        serviceType: form.serviceType
      });
      setStatus("success");
    } catch (err) {
      setError(err.message);
      setStatus("idle");
    }
  };

  if (!open) return null;

  const today = new Date().toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });

  return (
    <div className="lead-popup-backdrop" onClick={() => setOpen(false)}>
      <div className="lead-popup-card" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="lead-popup-close" aria-label="Close" onClick={() => setOpen(false)}>
          ×
        </button>

        {status === "success" ? (
          <div className="lead-popup-success">
            <h3>Thanks, {form.name.split(" ")[0]}!</h3>
            <p>We've got your details — a technician will reach out shortly.</p>
            <button type="button" className="primary-button" onClick={() => setOpen(false)}>
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <h3>Get a Free Quote</h3>
            <p className="lead-popup-date">{today}</p>

            {error ? <p className="form-error">{error}</p> : null}

            <label>
              Name
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </label>
            <label>
              Phone
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                required
              />
            </label>
            <label>
              Email (optional)
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </label>
            <label>
              Location
              <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
            </label>
            <label>
              Service Needed
              <select value={form.serviceType} onChange={(e) => setForm({ ...form, serviceType: e.target.value })}>
                {SERVICE_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </label>

            <button className="primary-button" type="submit" disabled={status === "submitting"}>
              {status === "submitting" ? "Sending…" : "Request a Callback"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
