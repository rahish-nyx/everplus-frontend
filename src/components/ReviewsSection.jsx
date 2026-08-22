import { useEffect, useState } from "react";
import { getRatings, submitRating } from "../api.js";

export default function ReviewsSection({ reviews }) {
  const [data, setData] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", stars: 5, text: "" });
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  const load = () => {
    getRatings()
      .then(setData)
      .catch(() => {});
  };

  useEffect(load, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.name.trim()) {
      setError("Please enter your name.");
      return;
    }

    setStatus("submitting");

    try {
      const result = await submitRating(form);
      setStatus("success");
      setForm({ name: "", stars: 5, text: "" });
      if (result?.message) setError("");
    } catch (err) {
      setError(err.message);
      setStatus("idle");
    }
  };

  const average = reviews?.averageOverride || data?.average || "4.9";
  const count = data?.count || 0;

  return (
    <section className="reviews-band" id="reviews">
      <div>
        <span className="section-kicker">{reviews?.sectionTitle || "Homeowner Approved"}</span>
        <h2>{reviews?.sectionSubtitle || "Fast answers, clean work, and no surprise pricing."}</h2>

        {data?.ratings?.length ? (
          <div className="reviews-list">
            {data.ratings.slice(0, 4).map((r) => (
              <div className="review-item" key={r.id}>
                <div className="review-item-stars">
                  <StarRow value={r.stars} />
                  <strong>{r.name}</strong>
                </div>
                {r.text ? <p>{r.text}</p> : null}
              </div>
            ))}
          </div>
        ) : null}

        {!showForm ? (
          <button type="button" className="ghost-button reviews-toggle" onClick={() => setShowForm(true)}>
            Leave a Review
          </button>
        ) : status === "success" ? (
          <p className="form-success">Thanks for your feedback! It'll appear after a quick review.</p>
        ) : (
          <form className="review-form" onSubmit={handleSubmit}>
            {error ? <p className="form-error">{error}</p> : null}
            <label>
              Your Name
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </label>
            <label>
              Rating
              <StarPicker value={form.stars} onChange={(stars) => setForm({ ...form, stars })} />
            </label>
            <label>
              Your Experience (optional)
              <input value={form.text} onChange={(e) => setForm({ ...form, text: e.target.value })} />
            </label>
            <button className="primary-button" type="submit" disabled={status === "submitting"}>
              {status === "submitting" ? "Sending…" : "Submit Review"}
            </button>
          </form>
        )}
      </div>

      <div className="review-summary">
        <strong>{average}/5</strong>
        <span>
          {count > 0
            ? `Based on ${count} review${count === 1 ? "" : "s"} from local HVAC and appliance repair clients.`
            : "Average rating from local HVAC and appliance repair clients."}
        </span>
      </div>
    </section>
  );
}

function StarRow({ value }) {
  return (
    <span className="star-row" aria-label={`${value} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <StarIcon key={n} filled={n <= value} />
      ))}
    </span>
  );
}

function StarPicker({ value, onChange }) {
  return (
    <span className="star-picker">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          type="button"
          key={n}
          className="star-picker-button"
          aria-label={`${n} star${n === 1 ? "" : "s"}`}
          onClick={() => onChange(n)}
        >
          <StarIcon filled={n <= value} />
        </button>
      ))}
    </span>
  );
}

function StarIcon({ filled }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill={filled ? "#ff8c00" : "none"} stroke="#ff8c00" strokeWidth="1.5">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14l-5-4.87 6.91-1.01L12 2z" />
    </svg>
  );
}
