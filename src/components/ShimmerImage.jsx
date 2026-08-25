import { useState } from "react";

// Wraps an <img> with a shimmer placeholder that shows until the image has
// actually finished loading, then cross-fades to the real image. Drop-in
// replacement for a plain <img> — pass the same src/alt/width/height props.
export default function ShimmerImage({ src, alt, width, height, className = "" }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className={`shimmer-wrap ${loaded ? "" : "is-loading"} ${className}`.trim()}>
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading="lazy"
        className={loaded ? "is-loaded" : ""}
        onLoad={() => setLoaded(true)}
      />
    </div>
  );
}
