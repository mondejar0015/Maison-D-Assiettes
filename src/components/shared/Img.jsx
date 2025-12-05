import React from "react";

export default function Img({ src, alt = "", className = "w-full h-full object-cover" }) {
  // Check if src is a valid URL or use placeholder
  const imageSrc = src && src.startsWith('http') ? src : "/images/placeholder.png";
  
  return (
    <img
      src={imageSrc}
      alt={alt}
      className={className}
      onError={(e) => {
        console.log(`Image failed to load: ${src}`);
        e.currentTarget.src = "/images/placeholder.png";
      }}
    />
  );
}