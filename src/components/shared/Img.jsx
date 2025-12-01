import React from "react";

export default function Img({ src, alt = "", className = "w-full h-full object-cover" }) {
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={(e) => {
        e.currentTarget.src = "/images/placeholder.png";
      }}
    />
  );
}