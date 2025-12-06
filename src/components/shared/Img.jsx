import React from "react";

export default function Img({ src, alt = "", className = "w-full h-full object-cover" }) {
  const [hasError, setHasError] = React.useState(false);

  return (
    <img
      src={hasError ? "/images/placeholder.png" : src}
      alt={alt}
      className={className}
      onError={() => {
        console.log(`Image failed to load: ${src}`);
        setHasError(true);
      }}
      loading="lazy"
    />
  );
}