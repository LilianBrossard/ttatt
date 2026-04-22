"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useSection } from "../SectionContext";
import Link from "next/link";

// ==========================================
// CONFIGURATION VARIABLES
// ==========================================
export const NAV_LINKS = [
  { id: "accueil", label: "Accueil" },
  { id: "projects", label: "Projects" },
  { id: "agenda", label: "Agenda" },
  { id: "contact", label: "Contact" },
];

// Animation speed — higher = faster convergence (0 < speed ≤ 1)
const LERP_SPEED = 0.06;
// Snap threshold — when the animated index is this close, snap to target
const SNAP_THRESHOLD = 0.005;
// ==========================================

/**
 * Compute continuous roulette styles from a float distance.
 * distance 0   → full focus (opacity 1, scale 1.4, translateX 24px)
 * distance 1   → adjacent   (opacity 0.7, scale 1.1, translateX 12px)
 * distance 2   → further    (opacity 0.4, scale 0.9, translateX 0)
 * distance 3+  → far        (opacity 0.2, scale 0.75, translateX -8px)
 */
function computeRouletteStyle(floatDistance: number) {
  const keyframes: [number, number, number, number][] = [
    [0, 1.0, 1.4, 24],
    [1, 0.7, 1.1, 12],
    [2, 0.4, 0.9, 0],
    [3, 0.2, 0.75, -8],
  ];

  const d = Math.abs(floatDistance);

  if (d >= keyframes[keyframes.length - 1][0]) {
    const last = keyframes[keyframes.length - 1];
    return { opacity: last[1], scale: last[2], translateX: last[3] };
  }

  for (let i = 0; i < keyframes.length - 1; i++) {
    const [d0, o0, s0, t0] = keyframes[i];
    const [d1, o1, s1, t1] = keyframes[i + 1];
    if (d >= d0 && d <= d1) {
      const t = (d - d0) / (d1 - d0);
      return {
        opacity: o0 + (o1 - o0) * t,
        scale: s0 + (s1 - s0) * t,
        translateX: t0 + (t1 - t0) * t,
      };
    }
  }

  return { opacity: 0.2, scale: 0.75, translateX: -8 };
}

export default function Nav({ youtubeUrl }: { youtubeUrl?: string }) {
  const { activeSection } = useSection();
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const activeIndex = NAV_LINKS.findIndex((link) => link.id === activeSection);
  const targetIndex = activeIndex >= 0 ? activeIndex : 0;

  const [animatedIndex, setAnimatedIndex] = useState(targetIndex);
  const animatedRef = useRef(animatedIndex);
  const targetRef = useRef(targetIndex);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    targetRef.current = targetIndex;
  }, [targetIndex]);

  const animate = useCallback(() => {
    const current = animatedRef.current;
    const target = targetRef.current;
    const diff = target - current;

    if (Math.abs(diff) < SNAP_THRESHOLD) {
      animatedRef.current = target;
      setAnimatedIndex(target);
      rafRef.current = null;
      return;
    }

    const next = current + diff * LERP_SPEED;
    animatedRef.current = next;
    setAnimatedIndex(next);
    rafRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (rafRef.current === null) {
      rafRef.current = requestAnimationFrame(animate);
    }
    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [targetIndex, mounted, animate]);

  // Fermer le menu sur Échap
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const toggleMenu = () => setIsOpen((v) => !v);
  const closeMenu = () => setIsOpen(false);

  const getLinkInlineStyle = (index: number) => {
    if (!mounted)
      return { opacity: 0.7, transform: "scale(1) translateX(0px)" };
    const { opacity, scale, translateX } = computeRouletteStyle(
      index - animatedIndex,
    );
    return {
      opacity,
      transform: `scale(${scale}) translateX(${translateX}px)`,
    };
  };

  const isLinkActive = (index: number) =>
    mounted && Math.abs(index - animatedIndex) < 0.5;

  return (
    <>
      {/* ── Bouton burger / croix — toujours visible ── */}
      <button
        onClick={toggleMenu}
        className="fixed top-6 left-6 z-[60] w-12 h-12 flex flex-col justify-center items-center rounded-full bg-(--background) shadow-[0_4px_15px_rgba(0,0,0,0.12)] border border-(--foreground-secondary)/10"
        aria-label={isOpen ? "Fermer le menu" : "Ouvrir le menu"}
        aria-expanded={isOpen}
      >
        <div className="relative w-6 h-5">
          {/* Barre 1 */}
          <span
            className={`absolute left-0 w-full h-[2px] bg-(--foreground) transition-all duration-300 ease-in-out ${
              isOpen ? "top-2 rotate-45" : "top-0"
            }`}
          />
          {/* Barre 2 */}
          <span
            className={`absolute left-0 top-2 w-full h-[2px] bg-(--foreground) transition-all duration-300 ease-in-out ${
              isOpen ? "opacity-0 translate-x-2" : "opacity-100"
            }`}
          />
          {/* Barre 3 */}
          <span
            className={`absolute left-0 w-full h-[2px] bg-(--foreground) transition-all duration-300 ease-in-out ${
              isOpen ? "top-2 -rotate-45" : "top-4"
            }`}
          />
        </div>
      </button>

      {/* ── Panneau latéral — slide depuis la gauche ── */}
      <nav
        className={`
          fixed top-0 left-0 h-full z-50
          w-[85vw] sm:w-[60vw] lg:w-[25vw] lg:min-w-[280px] lg:max-w-[350px]
          bg-(--background) border-r border-(--foreground-secondary)/10
          shadow-2xl
          transition-transform duration-500 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
        aria-hidden={!isOpen}
      >
        {/* Décalage pour laisser la place au bouton burger en haut */}
        <div className="pt-20 h-full flex flex-col py-12 px-8 lg:px-12 justify-between">
          {/* Titre */}
          <div className="shrink-0">
            <h2 className="text-4xl lg:text-6xl font-bold font-(family-name:--font-dynaPuff) text-(--foreground)">
              TTATT
            </h2>
          </div>

          {/* Liens roulette */}
          <div className="flex flex-col justify-center gap-6 lg:gap-8 grow my-8 font-(family-name:--font-lato)">
            {NAV_LINKS.map((link, index) => (
              <Link
                key={link.id}
                href={`#${link.id}`}
                onClick={closeMenu}
                style={getLinkInlineStyle(index)}
                className={`
                  origin-left will-change-transform
                  transition-[color,opacity] duration-400 ease-out
                  hover:text-(--primary) hover:opacity-100 cursor-pointer
                  block w-fit text-2xl lg:text-3xl font-bold
                  ${isLinkActive(index) ? "text-(--primary)" : ""}
                `}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* YouTube */}
          <div className="shrink-0">
            <a
              href={youtubeUrl || "https://www.youtube.com/"}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-3 text-lg font-bold text-(--foreground) hover:text-(--primary) transition-colors"
            >
              <svg
                viewBox="0 -3 20 20"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                className="fill-(--foreground) group-hover:fill-(--primary) transition-colors"
              >
                <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                <g
                  id="SVGRepo_tracerCarrier"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></g>
                <g id="SVGRepo_iconCarrier">
                  <title>youtube logo</title>
                  <defs></defs>
                  <g
                    id="Page-1"
                    stroke="none"
                    strokeWidth="1"
                    fill="none"
                    fillRule="evenodd"
                  >
                    <g
                      id="Dribbble-Light-Preview"
                      transform="translate(-300.000000, -7442.000000)"
                      fill="currentColor"
                    >
                      <g
                        id="icons"
                        transform="translate(56.000000, 160.000000)"
                      >
                        <path
                          d="M251.988432,7291.58588 L251.988432,7285.97425 C253.980638,7286.91168 255.523602,7287.8172 257.348463,7288.79353 C255.843351,7289.62824 253.980638,7290.56468 251.988432,7291.58588 M263.090998,7283.18289 C262.747343,7282.73013 262.161634,7282.37809 261.538073,7282.26141 C259.705243,7281.91336 248.270974,7281.91237 246.439141,7282.26141 C245.939097,7282.35515 245.493839,7282.58153 245.111335,7282.93357 C243.49964,7284.42947 244.004664,7292.45151 244.393145,7293.75096 C244.556505,7294.31342 244.767679,7294.71931 245.033639,7294.98558 C245.376298,7295.33761 245.845463,7295.57995 246.384355,7295.68865 C247.893451,7296.0008 255.668037,7296.17532 261.506198,7295.73552 C262.044094,7295.64178 262.520231,7295.39147 262.895762,7295.02447 C264.385932,7293.53455 264.28433,7285.06174 263.090998,7283.18289"
                          id="youtube-[#168]"
                        ></path>
                      </g>
                    </g>
                  </g>
                </g>
              </svg>
              Youtube
            </a>
          </div>
        </div>
      </nav>

      {/* ── Backdrop (ferme le menu en cliquant à côté) ── */}
      <div
        className={`
          fixed inset-0 z-40
          bg-black/20 backdrop-blur-sm
          transition-opacity duration-500
          ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
        `}
        onClick={closeMenu}
        aria-hidden="true"
      />
    </>
  );
}
