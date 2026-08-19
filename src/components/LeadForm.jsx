import { ClipboardCheck } from "lucide-react";
import { useState } from "react";
import { apiFetch } from "../api.js";

const initialForm = {
  name: "",
  phone: "",
  serviceType: ""
};

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
      setError("Please fill out every field.");
      return;
    }

    if (form.phone.replace(/\D/g, "").length < 10) {
      setError("Please enter a phone number with at least 10 digits.");
      return;
    }

    setSubmitting(true);

    try {
      await apiFetch("/api/leads", {
        method: "POST",
        body: JSON.stringify(form)
      });
      setForm(initialForm);
      setMessage("Thanks. EverPlus will call you shortly.");
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="lead-card" onSubmit={handleSubmit}>
      <div className="form-heading">
        <ClipboardCheck size={24} />
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
        <input name="phone" value={form.phone} onChange={updateField} placeholder="(555) 123-4567" required />
      </label>
      <label>
        Service Type
        <select name="serviceType" value={form.serviceType} onChange={updateField} required>
          <option value="">Choose a service</option>
          <option>Heating</option>
          <option>Cooling</option>
          <option>Plumbing</option>
          <option>Electrical</option>
          <option>Emergency Repair</option>
        </select>
      </label>
      {error && <p className="form-error">{error}</p>}
      {message && <p className="form-success">{message}</p>}
      <button className="primary-button" type="submit" disabled={submitting}>
        {submitting ? "Sending..." : "Get Free Quote"}
      </button>
    </form>
  );
}
