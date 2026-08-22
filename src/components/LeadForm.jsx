import { useState } from "react";
import { createLead } from "../api.js";

const initialForm = {
  name: "",
  phone: "",
  email: "",
  location: "",
  serviceType: ""
};

const SERVICE_OPTIONS = [
  "AC Repair",
  "Washing Machine Repair",
  "Refrigerator Repair",
  "Microwave Repair",
  "LED & Smart TV Repair"
];

export default function LeadForm() {
  const [form, setForm] = useState(initialForm);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function updateField(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!form.name.trim() || !form.phone.trim() || !form.serviceType) {
      setError("Please fill out name, phone, and service type.");
      return;
    }

    if (form.phone.replace(/\D/g, "").length < 10) {
      setError("Please enter a phone number with at least 10 digits.");
      return;
    }

    setSubmitting(true);

    try {
      // createLead already handles JSON.stringify internally via apiFetch —
      // never stringify the body yourself before passing it in.
      await createLead(form);
      setForm(initialForm);
      setMessage("Thanks. EverPlus will call you shortly.");
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="lead-card" id="lead-form" onSubmit={handleSubmit}>
      <div className="form-heading">
        <ClipboardIcon />
        <div>
          <h3>Get a Free Quote</h3>
          <p>Priority scheduling for today and tomorrow.</p>
        </div>
      </div>

      <label>
        Name
        <input name="name" value={form.name} onChange={updateField} placeholder="Your name" required />
      </label>
      <label>
        Phone
        <input name="phone" type="tel" value={form.phone} onChange={updateField} placeholder="98765 43210" required />
      </label>
      <label>
        Email (optional)
        <input name="email" type="email" value={form.email} onChange={updateField} placeholder="you@example.com" />
      </label>
      <label>
        Location
        <input name="location" value={form.location} onChange={updateField} placeholder="Area / city" />
      </label>
      <label>
        Service Type
        <select name="serviceType" value={form.serviceType} onChange={updateField} required>
          <option value="">Choose a service</option>
          {SERVICE_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>

      {error ? <p className="form-error">{error}</p> : null}
      {message ? <p className="form-success">{message}</p> : null}

      <button className="primary-button" type="submit" disabled={submitting}>
        {submitting ? "Sending…" : "Get Free Quote"}
      </button>
    </form>
  );
}

function ClipboardIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
      <rect x="9" y="3" width="6" height="4" rx="1" />
      <path d="m9 14 2 2 4-4" />
    </svg>
  );
}
