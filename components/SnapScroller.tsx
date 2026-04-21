"use client";

import { useEffect, useRef } from "react";
import { animate } from "framer-motion";

// ── Config ────────────────────────────────────────────────────────────────────
/** IDs des sections dans l'ordre d'apparition dans la page */
const SECTION_IDS = ["accueil", "projects", "agenda", "logistic", "contact"];

/** Durée de l'animation de scroll (secondes) */
const ANIM_DURATION = 0.75;

/** Temps minimal entre deux snaps (ms) — évite d'enchaîner deux sections d'un coup */
const COOLDOWN_MS = 900;

/** Seuil minimum de delta wheel/touch pour déclencher un snap (px) */
const MIN_DELTA = 30;
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Remonte l'arbre DOM depuis `el` pour savoir si on est dans
 * un conteneur scrollable (autre que body/html). Si oui, on laisse
 * le scroll natif se produire et on ne snap pas.
 */
function isInsideScrollable(el: Element | null): boolean {
  if (!el || el === document.body || el === document.documentElement) return false;
  const { overflowY } = getComputedStyle(el);
  if (
    (overflowY === "auto" || overflowY === "scroll") &&
    el.scrollHeight > el.clientHeight
  ) {
    return true;
  }
  return isInsideScrollable(el.parentElement);
}

export default function SnapScroller() {
  const currentIdx = useRef(0);
  const isAnimating = useRef(false);
  const lastSnapTime = useRef(0);

  useEffect(() => {
    // ── Helpers ───────────────────────────────────────────────────────────
    const getElements = () =>
      SECTION_IDS.map((id) => document.getElementById(id)).filter(
        Boolean,
      ) as HTMLElement[];

    /** Retourne l'index de la section la plus proche du viewport */
    const getClosestIdx = (): number => {
      const els = getElements();
      let idx = 0;
      let minDist = Infinity;
      els.forEach((el, i) => {
        const dist = Math.abs(el.getBoundingClientRect().top);
        if (dist < minDist) {
          minDist = dist;
          idx = i;
        }
      });
      return idx;
    };

    /** Anime le scroll vers la section `idx` */
    const snapTo = (idx: number) => {
      if (isAnimating.current) return;
      const els = getElements();
      const clamped = Math.max(0, Math.min(idx, els.length - 1));
      const target = els[clamped];
      if (!target) return;

      const from = window.scrollY;
      const to = target.getBoundingClientRect().top + window.scrollY;

      // Déjà sur la bonne section ?
      if (Math.abs(from - to) < 5) return;

      currentIdx.current = clamped;
      isAnimating.current = true;
      lastSnapTime.current = Date.now();

      animate(from, to, {
        duration: ANIM_DURATION,
        ease: [0.25, 0.46, 0.45, 0.94], // ease-out cubic-like
        onUpdate: (v) => window.scrollTo(0, v),
        onComplete: () => {
          // Petit délai après la fin pour éviter un déclenchement accidentel
          setTimeout(() => {
            isAnimating.current = false;
          }, 50);
        },
      });
    };

    // ── Wheel ─────────────────────────────────────────────────────────────
    const handleWheel = (e: WheelEvent) => {
      // Body verrouillé (ex: ZoomedPetal ouvert) → ne rien faire
      if (document.body.style.overflow === "hidden") return;
      // Dans un conteneur scrollable interne → scroll natif
      if (isInsideScrollable(e.target as Element)) return;

      e.preventDefault();

      if (isAnimating.current) return;
      if (Date.now() - lastSnapTime.current < COOLDOWN_MS) return;
      if (Math.abs(e.deltaY) < MIN_DELTA) return;

      const dir = e.deltaY > 0 ? 1 : -1;
      snapTo(currentIdx.current + dir);
    };

    // ── Clavier ───────────────────────────────────────────────────────────
    const handleKeyDown = (e: KeyboardEvent) => {
      if (document.body.style.overflow === "hidden") return;
      if (["ArrowDown", "PageDown"].includes(e.key)) {
        e.preventDefault();
        if (!isAnimating.current) snapTo(currentIdx.current + 1);
      } else if (["ArrowUp", "PageUp"].includes(e.key)) {
        e.preventDefault();
        if (!isAnimating.current) snapTo(currentIdx.current - 1);
      }
    };

    // ── Touch ─────────────────────────────────────────────────────────────
    let touchStartY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };
    const handleTouchEnd = (e: TouchEvent) => {
      if (document.body.style.overflow === "hidden") return;
      const dy = touchStartY - e.changedTouches[0].clientY;
      if (Math.abs(dy) < MIN_DELTA) return;
      if (isAnimating.current) return;
      if (Date.now() - lastSnapTime.current < COOLDOWN_MS) return;
      snapTo(currentIdx.current + (dy > 0 ? 1 : -1));
    };

    // ── Init ──────────────────────────────────────────────────────────────
    currentIdx.current = getClosestIdx();

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchend", handleTouchEnd);

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, []);

  return null;
}
