"use client";

import Image from "next/image";

type Props = {
  /** Pixel width/height (square). */
  size?: number;
  className?: string;
  priority?: boolean;
};

export function DefightLogo({
  size = 48,
  className = "",
  priority = false,
}: Props) {
  return (
    <Image
      src="/defight-logo.png"
      alt="Defight"
      width={size}
      height={size}
      className={`rounded-xl object-contain ${className}`.trim()}
      priority={priority}
    />
  );
}
