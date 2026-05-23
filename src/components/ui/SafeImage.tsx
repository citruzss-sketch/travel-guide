"use client";

import { useState } from "react";
import Image from "next/image";
import { TRAVEL_IMAGES } from "@/lib/travel-images";

interface SafeImageProps {
  src: string;
  alt: string;
  fill?: boolean;
  width?: number;
  height?: number;
  priority?: boolean;
  className?: string;
  sizes?: string;
}

export function SafeImage({
  src,
  alt,
  fill,
  width,
  height,
  priority,
  className = "",
  sizes,
}: SafeImageProps) {
  const [failed, setFailed] = useState(false);
  const resolvedSrc = failed ? TRAVEL_IMAGES.default : src;
  const useUnoptimized =
    resolvedSrc.includes("commons.wikimedia.org") ||
    resolvedSrc.includes("upload.wikimedia.org");

  if (failed && fill) {
    return <ImageFallback />;
  }

  return (
    <Image
      src={resolvedSrc}
      alt={alt}
      fill={fill}
      width={!fill ? width : undefined}
      height={!fill ? height : undefined}
      priority={priority}
      unoptimized={useUnoptimized}
      className={className}
      sizes={sizes}
      onError={() => setFailed(true)}
    />
  );
}

function ImageFallback() {
  return (
    <div
      className="absolute inset-0 bg-gradient-to-br from-accent/25 via-surface-hover to-background"
      aria-hidden
    />
  );
}
