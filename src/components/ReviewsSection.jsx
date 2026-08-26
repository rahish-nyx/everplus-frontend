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
      .catch(() => setData({ ratings: [], average: null, count: 0 }));
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

  // data is null only until the /api/ratings call resolves (success or
  // failure) — this is independent of the settings context, since this
  // section fetches its own data. Show a skeleton instead of nothing so
  // the section doesn't suddenly pop into existence.
  if (data === null) {
    return (
      <section className="reviews-band" id="reviews">
        <div>
          <span className="skeleton-block skeleton-text is-narrow" style={{ display: "inline-block", height: "16px", width: "140px" }} />
          <div className="skeleton-block" style={{ height: "34px", width: "80%", margin: "10px 0 24px", borderRadius: "6px" }} />

          <div className="reviews-list">
            {Array.from({ length: 3 }).map((_, index) => (
              <div className="review-item" key={index}>
                <div className="skeleton-block" style={{ height: "16px", width: "120px", marginBottom: "8px" }} />
                <div className="skeleton-block" style={{ height: "14px", width: "90%" }} />
              </div>
            ))}
          </div>
        </div>

        <div className="review-summary">
          <div className="skeleton-block" style={{ height: "40px", width: "90px", marginBottom: "12px", background: "rgba(255,255,255,0.14)" }} />
          <div className="skeleton-block" style={{ height: "14px", width: "100%", background: "rgba(255,255,255,0.14)" }} />
        </div>
      </section>
    );
  }

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
            ? `Based on ${1000 + count} review${count === 1 ? "" : "s"} from locals AC, Refrigerator, TV & Home Appliance repairs clients.`
            : "Average rating from local AC, Refrigerator, TV & Home Appliance repairs clients."}
        </span>
      </div>
    </section>
  );
}

function StarRow({ value }) {
  return (
    <span className="star-row" role="img" aria-label={`${value} out of 5 stars`}>
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