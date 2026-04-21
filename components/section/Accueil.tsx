"use client";

import { useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { motion } from "framer-motion";

// ── Math helpers ──────────────────────────────────────────────────────────────
const { random, PI, sin, cos, floor, ceil } = Math;

function rnd(min: number, max?: number): number {
  if (max === undefined) {
    max = min;
    min = 0;
  }
  return random() * (max - min) + min;
}
function rndInt(min: number, max: number): number {
  return floor(rnd(ceil(min), floor(max) + 1));
}

// ── Color helpers (pas besoin de chroma.js) ───────────────────────────────────
/** Génère N couleurs HSL harmonieuses pour une fleur */
function makeColors(n: number, alpha: number): string[] {
  const baseH = random() * 360;
  const span = 60 + random() * 120; // écart de teinte 60-180°
  return Array.from({ length: n }, (_, i) => {
    const t = n > 1 ? i / (n - 1) : 0;
    const h = (baseH + t * span) % 360;
    const s = 60 + random() * 30; // 60-90 %
    const l = 40 + random() * 25; // 40-65 %
    return `hsla(${h.toFixed(1)},${s.toFixed(1)}%,${l.toFixed(1)}%,${alpha.toFixed(2)})`;
  });
}

// ── SVG helpers ───────────────────────────────────────────────────────────────
type Pt = [number, number];

function ns(tag: string) {
  return document.createElementNS("http://www.w3.org/2000/svg", tag);
}

/** Chemin SVG d'un pétale (double courbe Q) */
function petalD(
  x: number,
  y: number,
  startA: number,
  endA: number,
  ir: number,
  or: number,
  cpda: number,
  cpdr: number,
): string {
  const da = endA - startA;
  const sr = ir / 5; // rayon du point de départ (centre-ish)
  const sp: Pt = [x + cos(startA + da / 2) * sr, y + sin(startA + da / 2) * sr];
  const cp1: Pt = [
    x + cos(startA - cpda) * (ir + cpdr),
    y + sin(startA - cpda) * (ir + cpdr),
  ];
  const cp2: Pt = [
    x + cos(endA + cpda) * (ir + cpdr),
    y + sin(endA + cpda) * (ir + cpdr),
  ];
  const ep: Pt = [x + cos(startA + da / 2) * or, y + sin(startA + da / 2) * or];
  const q = (s: Pt, c: Pt, e: Pt) =>
    `M${s[0]} ${s[1]} Q${c[0]} ${c[1]} ${e[0]} ${e[1]}`;
  return q(sp, cp1, ep) + " " + q(sp, cp2, ep);
}

// ── Animations d'apparition des couches (6 variantes) ────────────────────────
const LAYER_ANIMS = [
  "flrA1",
  "flrA2",
  "flrA3",
  "flrA4",
  "flrA5",
  "flrA6",
] as const;

const KEYFRAMES_CSS = `
@keyframes flrA1{from{opacity:0}to{opacity:1}}
@keyframes flrA2{from{opacity:0;transform:scale3d(.2,.2,.2)}to{opacity:1;transform:scale3d(1,1,1)}}
@keyframes flrA3{from{opacity:0;transform:rotateZ(-270deg)}to{opacity:1;transform:rotateZ(0deg)}}
@keyframes flrA4{from{opacity:0;transform:rotateZ(360deg) scale3d(.2,.2,.2)}to{opacity:1;transform:rotateZ(0deg) scale3d(1,1,1)}}
@keyframes flrA5{
  0%  {opacity:0;transform:scale3d(.3,.3,.3)}
  20% {transform:scale3d(1.1,1.1,1.1)}
  40% {transform:scale3d(.9,.9,.9)}
  60% {transform:scale3d(1.03,1.03,1.03)}
  80% {transform:scale3d(.97,.97,.97)}
  to  {opacity:1;transform:scale3d(1,1,1)}
}
@keyframes flrA6{from{opacity:0;transform:rotate3d(1,1,1,360deg) scale3d(.1,.1,.1)}to{opacity:1;transform:rotate3d(1,1,1,0deg) scale3d(1,1,1)}}
`;

// ── Création d'une fleur SVG ──────────────────────────────────────────────────
function spawnFlower(svg: SVGSVGElement, x: number, y: number): SVGGElement {
  const petals = rndInt(4, 12);
  const rings = rndInt(3, 9);
  const step = rndInt(3, 8);
  const alpha = rnd(0.7, 1);
  const angle = rnd(PI);
  const iRadius = rnd(2, 5);
  const iRadiusCoef = rnd(1, 7);
  const oRadius = rnd(5, 10);
  const oRadiusCoef = rnd(iRadiusCoef, 7);
  const layerAnim = LAYER_ANIMS[rndInt(0, LAYER_ANIMS.length - 1)];
  const reverseDelay = random() > 0.5;
  const colors = makeColors(rings > 6 ? 3 : 2, alpha);
  const animDur = rings * 0.3; // secondes

  const group = ns("g") as SVGGElement;
  svg.appendChild(group);

  for (let i = rings; i > 0; i--) {
    const np = floor((i + step - 1) / step) * petals;
    const ir = iRadius + i * iRadiusCoef;
    const or_ = oRadius + i * oRadiusCoef;
    const ang = angle + ((i % 2) * PI) / np;
    const da = (2 * PI) / np;
    const dr = or_ - ir;
    const cpda = rnd((0.5 * da) / 5, (1.5 * da) / 5);
    const cpdr = rnd(dr * 0.25, dr * 1.1);

    // Couleur interpolée de l'extérieur vers le centre
    const ci = Math.min(
      Math.floor((i / rings) * (colors.length - 1)),
      colors.length - 1,
    );
    const color = colors[ci];

    const layer = ns("g") as SVGGElement;

    for (let j = 0; j < np; j++) {
      const a = ang + j * da;
      const path = ns("path") as SVGPathElement;
      path.setAttribute("d", petalD(x, y, a, a + da, ir, or_, cpda, cpdr));
      path.style.cssText = `fill:${color};stroke:rgba(0,0,0,.25);stroke-width:.4px;stroke-linecap:round;stroke-linejoin:round`;
      layer.appendChild(path);
    }

    const di = reverseDelay ? rings - i + 1 : i;
    Object.assign(layer.style, {
      animationName: layerAnim,
      animationDuration: animDur + "s",
      animationDelay: di * 0.15 + "s",
      animationFillMode: "both",
      transformBox: "fill-box",
      transformOrigin: "center center",
    });

    group.appendChild(layer);
  }

  return group;
}

// ── Composant React ───────────────────────────────────────────────────────────
/** Délai avant de démarrer le fondu (laisse le temps à l'animation de bloom) */
const FADE_DELAY_MS = 2500;
/** Durée du fondu d'opacité (ms) */
const FADE_DURATION_MS = 5_000;
/** Intervalle de création des fleurs (ms) */
const SPAWN_INTERVAL_MS = 150;

export default function Accueil({ presentation }: { presentation?: string }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef<{ x: number; y: number; inside: boolean }>({
    x: 0,
    y: 0,
    inside: false,
  });

  useEffect(() => {
    // Injecter les @keyframes une seule fois dans le <head>
    if (!document.getElementById("flr-keyframes")) {
      const style = document.createElement("style");
      style.id = "flr-keyframes";
      style.textContent = KEYFRAMES_CSS;
      document.head.appendChild(style);
    }

    const svg = svgRef.current;
    const section = sectionRef.current;
    if (!svg || !section) return;

    // Adapter le viewBox au SVG (coordonnées centrées)
    const syncViewBox = () => {
      const { width, height } = svg.getBoundingClientRect();
      svg.setAttribute(
        "viewBox",
        `${-width / 2} ${-height / 2} ${width} ${height}`,
      );
    };
    syncViewBox();
    const ro = new ResizeObserver(syncViewBox);
    ro.observe(svg);

    // Suivre la souris dans la section
    const onMove = (e: MouseEvent) => {
      const r = svg.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - r.left - r.width / 2,
        y: e.clientY - r.top - r.height / 2,
        inside: true,
      };
    };
    const onLeave = () => {
      mouseRef.current.inside = false;
    };

    section.addEventListener("mousemove", onMove);
    section.addEventListener("mouseleave", onLeave);

    // Spawner une fleur toutes les 500ms à la dernière position connue
    const interval = setInterval(() => {
      if (!mouseRef.current.inside) return;
      const { x, y } = mouseRef.current;
      const group = spawnFlower(svg, x, y);

      // Après le bloom → fondu de 10s → suppression
      setTimeout(() => {
        group.style.transition = `opacity ${FADE_DURATION_MS / 1000}s ease-in`;
        group.style.opacity = "0";
        setTimeout(() => group.remove(), FADE_DURATION_MS + 50);
      }, FADE_DELAY_MS);
    }, SPAWN_INTERVAL_MS);

    return () => {
      clearInterval(interval);
      section.removeEventListener("mousemove", onMove);
      section.removeEventListener("mouseleave", onLeave);
      ro.disconnect();
    };
  }, []);
  const title = "TTATT";

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }, // Délai entre chaque lettre
    },
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 },
  };

  return (
    <div
      ref={sectionRef}
      className="relative w-full min-h-screen overflow-hidden"
    >
      {/* Canvas SVG — derrière le texte, pointer-events none pour ne pas bloquer */}
      <svg
        ref={svgRef}
        className="absolute inset-0 w-full h-full"
        style={{ pointerEvents: "none" }}
        aria-hidden="true"
      />

      {/* Contenu texte — centré, par-dessus le SVG */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen pointer-events-none p-4">
        <motion.h2
          variants={container}
          initial="hidden"
          animate="show"
          className="text-6xl lg:text-8xl font-bold font-(family-name:--font-dynaPuff) drop-shadow-lg select-none bg-radial-[at_50%_75%] from-background via-secondary to-background to-110% bg-clip-text text-transparent flex"
        >
          {title.split("").map((char, index) => (
            <motion.span key={index} variants={item}>
              {char}
            </motion.span>
          ))}
        </motion.h2>

        {/* ── Qui sommes nous ? ─────────────────────────────────── */}
        {presentation && (
          <div
            className="mt-16 w-full max-w-3xl rounded-3xl p-6 lg:p-10 pointer-events-auto"
            style={{
              background:
                "color-mix(in srgb, var(--background) 30%, transparent)",
              boxShadow:
                "0 8px 32px color-mix(in srgb, var(--foreground) 10%, transparent)",
              backdropFilter: "blur(12px)",
            }}
          >
            <h3
              className="text-2xl lg:text-4xl font-bold mb-6 text-start"
              style={{
                fontFamily: "var(--font-dynaPuff)",
                color: "var(--foreground)",
              }}
            >
              Qui sommes nous ?
            </h3>
            <div
              className="prose prose-sm lg:prose-base max-w-none prose-p:leading-relaxed prose-p:mb-4"
              style={{ color: "var(--foreground)" }}
            >
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  p: ({ children }) => (
                    <p style={{ color: "var(--foreground)" }}>{children}</p>
                  ),
                  strong: ({ children }) => (
                    <strong
                      className="font-bold"
                      style={{ color: "var(--primary)" }}
                    >
                      {children}
                    </strong>
                  ),
                  em: ({ children }) => <em className="italic">{children}</em>,
                  a: ({ href, children }) => (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline underline-offset-2 transition-colors"
                      style={{ color: "var(--primary)" }}
                    >
                      {children}
                    </a>
                  ),
                  ul: ({ children }) => (
                    <ul className="list-disc pl-5 mb-4 space-y-1">
                      {children}
                    </ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="list-decimal pl-5 mb-4 space-y-1">
                      {children}
                    </ol>
                  ),
                }}
              >
                {presentation}
              </ReactMarkdown>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
