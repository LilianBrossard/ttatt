"use client";

import { useState } from "react";
import type { Projet } from "@/lib/types";

interface Props {
  projet: Projet;
  angleDeg: number; // angle du pétale (degrés, 0 = droite, -90 = haut)
  cx: number; // offset X du centre du pétale depuis le centre de la fleur (px)
  cy: number; // offset Y du centre du pétale depuis le centre de la fleur (px)
  petalW: number;
  petalH: number;
  onClick: () => void;
  /** Estomper ce pétale car un autre est sélectionné */
  dimmed?: boolean;
}

export default function Petale({
  projet,
  angleDeg,
  cx,
  cy,
  petalW,
  petalH,
  onClick,
  dimmed = false,
}: Props) {
  const [hovered, setHovered] = useState(false);

  // Le pétale est orienté verticalement (long axe = Y).
  // On le fait pointer vers l'extérieur en le faisant tourner de (angleDeg + 90)°
  // autour de son propre centre (qui est déjà placé au bon endroit).
  const rotationDeg = angleDeg + 90;

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-label={`Voir le projet : ${projet.titre}`}
      className="absolute focus:outline-none"
      style={{
        // Centre du pétale positionné relativement au centre de la fleur
        left: `calc(50% + ${cx}px)`,
        top: `calc(50% + ${cy}px)`,
        width: petalW,
        height: petalH,
        // Centrer l'élément sur son point de position, puis le faire tourner
        transform: `translate(-50%, -50%) rotate(${rotationDeg}deg) scale(${hovered ? 1.08 : 1})`,
        transformOrigin: "center center",
        // Forme ovale / ballon de rugby
        borderRadius: "50%",
        // Dégradé du centre (--background) vers l'extérieur (--background-secondary)
        // Le centre de la fleur est en bas du pétale avant rotation,
        // donc "vers le haut" dans l'espace du pétale = vers l'extérieur.
        background:
          "linear-gradient(to top, var(--background) 0%, var(--background-secondary) 100%)",
        border:
          "1px solid color-mix(in srgb, var(--foreground) 8%, transparent)",
        boxShadow: hovered
          ? `0 0 0 3px var(--secondary), 0 0 30px 8px color-mix(in srgb, var(--secondary) 40%, transparent)`
          : `0 2px 12px color-mix(in srgb, var(--foreground) 10%, transparent)`,
        transition:
          "transform 0.35s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.35s ease",
        cursor: "pointer",
        zIndex: hovered ? 5 : 2,
        overflow: "visible",
        opacity: dimmed ? 0.25 : 1,
      }}
    >
      {/* Titre — contre-rotationné pour rester horizontal et lisible */}
      <div
        className="absolute inset-0 flex items-center justify-center px-3 overflow-visible"
        style={{
          transform: `rotate(${-rotationDeg}deg)`,
          pointerEvents: "none",
        }}
      >
        <span
          className="font-bold text-center leading-tight overflow-visible text-2xl"
          style={{
            fontFamily: "var(--font-dynaPuff)",
            color: "var(--foreground)",
            // Légère ombre portée pour la lisibilité
            textShadow: "0 1px 3px rgba(255,255,255,0.8)",
            wordBreak: "break-word",
            maxWidth: petalW * 0.85,
          }}
        >
          {projet.titre}
        </span>
      </div>
    </button>
  );
}
