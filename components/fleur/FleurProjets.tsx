"use client";

import { useState, useRef, useEffect } from "react";
import type { Projet } from "@/lib/types";
import Pistil from "./Pistil";
import Petale from "./Petale";
import ZoomedPetal from "./ZoomedPetal";

// ─── Constantes géométriques de base (px, non scalées) ───────────────────────
const PISTIL_R = 110;
const PETAL_W = 200;
const PETAL_H = 400;
const GAP = -60; // négatif → pétale s'enfonce sous le pistil
const OFFSET = PISTIL_R + GAP + PETAL_H / 2; // = 250
const CONTAINER = (OFFSET + PETAL_H / 2 + 16) * 2; // ≈ 932

interface SelectedInfo {
  projet: Projet;
  viewportCX: number;
  viewportCY: number;
  rotationDeg: number;
  /** Taille visuelle réelle du pétale après scale (pour l'animation de départ) */
  petalW: number;
  petalH: number;
}

interface Props {
  pistilProjet: Projet | null;
  petales: Projet[];
}

export default function FleurProjets({ pistilProjet, petales }: Props) {
  const [selected, setSelected] = useState<SelectedInfo | null>(null);
  const [scale, setScale] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);

  // ── Calcul du scale pour que la fleur rentre dans la zone disponible ─────
  useEffect(() => {
    const update = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      // Sur lg+ (≥1024px), la nav prend 25vw → contenu = 75vw
      const contentW = vw >= 1024 ? vw * 0.75 : vw;
      // Tenir dans 96% de la largeur contenu OU 92% de la hauteur viewport
      const available = Math.min(contentW * 0.96, vh * 0.92);
      setScale(Math.min(1, available / CONTAINER));
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // Compensation de marge pour annuler l'espace layout laissé par scale()
  // (toujours ≤ 0 quand scale < 1)
  const marginComp = (CONTAINER * scale - CONTAINER) / 2;

  const handlePetalClick = (
    projet: Projet,
    cx: number,
    cy: number,
    rotationDeg: number,
  ) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    setSelected({
      projet,
      // Coords viewport = centre du rect scalé + offset du pétale scalé
      viewportCX: rect.left + rect.width / 2 + cx * scale,
      viewportCY: rect.top + rect.height / 2 + cy * scale,
      rotationDeg,
      petalW: PETAL_W * scale,
      petalH: PETAL_H * scale,
    });
  };

  const handlePistilClick = () => {
    if (!pistilProjet) return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    setSelected({
      projet: pistilProjet,
      viewportCX: rect.left + rect.width / 2,
      viewportCY: rect.top + rect.height / 2,
      rotationDeg: 0,
      petalW: PISTIL_R * 2 * scale,
      petalH: PISTIL_R * 2 * scale,
    });
  };

  const isAnySelected = selected !== null;

  return (
    <>
      <div className="flex items-center justify-center w-full">
        <div
          ref={containerRef}
          className="relative shrink-0"
          style={{
            width: CONTAINER,
            height: CONTAINER,
            transform: `scale(${scale})`,
            transformOrigin: "center center",
            // Compense l'espace layout non réduit par transform: scale
            margin: marginComp,
          }}
        >
          {/* ── Pétales ──────────────────────────────────────────────── */}
          {petales.map((projet, i) => {
            const angleDeg = (360 / petales.length) * i - 90;
            const angleRad = (angleDeg * Math.PI) / 180;
            const cx = Math.cos(angleRad) * OFFSET;
            const cy = Math.sin(angleRad) * OFFSET;
            const rotationDeg = angleDeg + 90;

            return (
              <Petale
                key={projet.id}
                projet={projet}
                angleDeg={angleDeg}
                cx={cx}
                cy={cy}
                petalW={PETAL_W}
                petalH={PETAL_H}
                onClick={() => handlePetalClick(projet, cx, cy, rotationDeg)}
                dimmed={isAnySelected && selected?.projet.id !== projet.id}
              />
            );
          })}

          {/* ── Pistil ───────────────────────────────────────────────── */}
          <Pistil
            projet={pistilProjet}
            radius={PISTIL_R}
            onClick={handlePistilClick}
            dimmed={isAnySelected && selected?.projet.id !== pistilProjet?.id}
          />
        </div>
      </div>

      {/* ── Overlay zoom ─────────────────────────────────────────────── */}
      {selected && (
        <ZoomedPetal
          projet={selected.projet}
          onClose={() => setSelected(null)}
          fromViewportCX={selected.viewportCX}
          fromViewportCY={selected.viewportCY}
          fromRotationDeg={selected.rotationDeg}
          petalW={selected.petalW}
          petalH={selected.petalH}
        />
      )}
    </>
  );
}
