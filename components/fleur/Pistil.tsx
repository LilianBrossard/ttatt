"use client";

import { useState } from "react";
import Image from "next/image";
import type { Projet } from "@/lib/types";

interface Props {
  projet: Projet | null;
  radius: number;
  onClick: () => void;
  dimmed?: boolean;
}

export default function Pistil({ projet, radius, onClick, dimmed = false }: Props) {
  const [hovered, setHovered] = useState(false);

  const size = radius * 2;
  const hasImage = (projet?.images?.length ?? 0) > 0;
  const coverImage = hasImage ? projet!.images[0] : null;
  const isClickable = !!projet;

  return (
    <div
      role={isClickable ? "button" : undefined}
      tabIndex={isClickable ? 0 : undefined}
      aria-label={projet ? `Voir le projet : ${projet.titre}` : undefined}
      onClick={isClickable ? onClick : undefined}
      onKeyDown={
        isClickable
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") onClick();
            }
          : undefined
      }
      onMouseEnter={() => isClickable && setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="absolute overflow-hidden"
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        left: "50%",
        top: "50%",
        transform: `translate(-50%, -50%) scale(${hovered ? 1.07 : 1})`,
        boxShadow: hovered
          ? `0 0 0 4px var(--secondary), 0 0 40px 12px color-mix(in srgb, var(--secondary) 45%, transparent)`
          : `0 4px 20px color-mix(in srgb, var(--foreground) 15%, transparent)`,
        background: coverImage ? undefined : "var(--secondary)",
        cursor: isClickable ? "pointer" : "default",
        zIndex: 10,
        opacity: dimmed ? 0.25 : 1,
        transition:
          "transform 0.35s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.35s ease, opacity 0.3s ease",
      }}
    >
      {/* Image de fond si disponible */}
      {coverImage && (
        <Image
          src={coverImage.url}
          alt={projet?.titre ?? ""}
          fill
          className="object-cover"
          sizes={`${size}px`}
        />
      )}

      {/* Overlay sombre pour lisibilité du titre */}
      {projet && (
        <div
          className="absolute inset-0 flex items-center justify-center p-3 text-center"
          style={{
            background: coverImage
              ? "linear-gradient(to bottom, transparent 30%, rgba(0,0,0,0.55) 100%)"
              : "transparent",
          }}
        >
          <span
            className="font-bold leading-tight drop-shadow-sm"
            style={{
              fontFamily: "var(--font-dynaPuff)",
              fontSize: `clamp(11px, ${radius * 0.18}px, 18px)`,
              color: coverImage ? "#fff" : "var(--foreground)",
            }}
          >
            {projet.titre}
          </span>
        </div>
      )}
    </div>
  );
}
