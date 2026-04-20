"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { youtubeEmbedProps } from "@/lib/youtube";
import type { Projet } from "@/lib/types";

interface Props {
  projet: Projet;
  onClose: () => void;
  /** Centre viewport du pétale cliqué (px) */
  fromViewportCX: number;
  fromViewportCY: number;
  /** Rotation du pétale d'origine (degrés) */
  fromRotationDeg: number;
  /** Dimensions du pétale d'origine */
  petalW: number;
  petalH: number;
}

export default function ZoomedPetal({
  projet,
  onClose,
  fromViewportCX,
  fromViewportCY,
  fromRotationDeg,
  petalW,
  petalH,
}: Props) {
  // ── deux phases : 'enter' (position originale du pétale) → 'open' (plein écran)
  const [phase, setPhase] = useState<"enter" | "open">("enter");
  // ── pour l'animation de fermeture
  const [isVisible, setIsVisible] = useState(true);

  // Forcer la phase 'open' sur le prochain frame de rendu
  useEffect(() => {
    const id1 = requestAnimationFrame(() => {
      const id2 = requestAnimationFrame(() => setPhase("open"));
      return () => cancelAnimationFrame(id2);
    });
    return () => cancelAnimationFrame(id1);
  }, []);

  // Fermeture avec animation
  const handleClose = useCallback(() => {
    setIsVisible(false);
    setTimeout(onClose, 280);
  }, [onClose]);

  // Échap
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [handleClose]);

  const isOpen = phase === "open";
  const vw = typeof window !== "undefined" ? window.innerWidth : 800;
  const vh = typeof window !== "undefined" ? window.innerHeight : 900;

  // Le pétale zoomé occupe ~88 × 92 % de l'écran
  const targetW = vw * 1.2;
  const targetH = vh * 1.2;

  // ── Style de l'ovale zoomé
  const ovalStyle: React.CSSProperties = {
    position: "fixed",
    zIndex: 60,
    borderRadius: "50%",
    background:
      "linear-gradient(to top, var(--background) 0%, var(--background-secondary) 100%)",
    boxShadow: isOpen
      ? `0 0 0 3px var(--secondary), 0 20px 100px color-mix(in srgb, var(--secondary) 30%, transparent)`
      : "none",
    overflow: "hidden",
    opacity: isVisible ? 1 : 0,
    // ── Position & taille : animées de la pos d'origine → centre écran
    left: isOpen ? "50%" : fromViewportCX,
    top: isOpen ? "50%" : fromViewportCY,
    width: isOpen ? targetW : petalW,
    height: isOpen ? targetH : petalH,
    transform: isOpen
      ? "translate(-50%, -50%) rotate(0deg)"
      : `translate(-50%, -50%) rotate(${fromRotationDeg}deg)`,
    transition: isOpen
      ? `left 0.52s cubic-bezier(0.16,1,0.3,1),
         top 0.52s cubic-bezier(0.16,1,0.3,1),
         width 0.52s cubic-bezier(0.16,1,0.3,1),
         height 0.52s cubic-bezier(0.16,1,0.3,1),
         transform 0.52s cubic-bezier(0.16,1,0.3,1),
         box-shadow 0.52s ease,
         opacity 0.25s ease`
      : "opacity 0.25s ease",
  };

  // Date formatée FR
  const dateFormatted = projet.date
    ? new Intl.DateTimeFormat("fr-FR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }).format(new Date(projet.date))
    : null;

  return (
    <>
      {/* ── Backdrop flouté ────────────────────────────────────────── */}
      <div
        className="fixed inset-0 z-50"
        style={{
          background: "rgba(0,0,0,0.45)",
          backdropFilter: "blur(10px)",
          opacity: isOpen && isVisible ? 1 : 0,
          transition: "opacity 0.45s ease",
          pointerEvents: isOpen ? "auto" : "none",
        }}
        onClick={handleClose}
      />

      {/* ── Pétale zoomé ─────────────────────────────────────────── */}
      <div style={ovalStyle}>
        {/*
         * Zone de contenu scrollable — padding ~20% H / 8% W
         * pour rester dans la zone "large" de l'ovale (évite les pointes)
         */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            overflowY: "auto",
            // Le padding pousse le contenu loin des pointes de l'ovale
            padding: `${targetH * 0.25}px ${targetW * 0.2}px ${targetH * 0.25}px`,
            opacity: isOpen && isVisible ? 1 : 0,
            transition: "opacity 0.28s ease 0.32s",
          }}
        >
          {/* ── Bouton fermer ────────────────────────────────────── */}
          <button
            onClick={handleClose}
            aria-label="Fermer"
            style={{
              position: "sticky",
              top: 0,
              float: "right",
              width: 48,
              height: 48,
              borderRadius: "50%",
              background: "var(--primary)",
              color: "var(--background)",
              border: "none",
              cursor: "pointer",
              fontSize: 20,
              lineHeight: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              marginBottom: 12,
              zIndex: 10,
            }}
          >
            ×
          </button>

          {/* ── Titre ──────────────────────────────────────────────── */}
          <h3
            style={{
              fontFamily: "var(--font-dynaPuff)",
              fontSize: "clamp(20px, 3.5vw, 32px)",
              fontWeight: 700,
              color: "var(--foreground)",
              marginBottom: 6,
              lineHeight: 1.2,
              clear: "both",
            }}
          >
            {projet.titre}
          </h3>

          {/* ── Date ───────────────────────────────────────────────── */}
          {dateFormatted && (
            <p
              style={{
                color: "var(--foreground-secondary)",
                fontSize: 14,
                marginBottom: 24,
              }}
            >
              {dateFormatted}
            </p>
          )}

          {/* ── Images ─────────────────────────────────────────────── */}
          {projet.images.length > 0 && (
            <div
              style={{
                display: "flex",
                gap: 12,
                flexWrap: "wrap",
                marginBottom: 24,
              }}
            >
              {projet.images.map((img, i) => (
                <div
                  key={i}
                  style={{
                    position: "relative",
                    width:
                      projet.images.length === 1 ? "100%" : "calc(50% - 6px)",
                    aspectRatio: "16/9",
                    borderRadius: 12,
                    overflow: "hidden",
                  }}
                >
                  <Image
                    src={img.url}
                    alt={img.fileName}
                    fill
                    className="object-cover"
                    sizes="400px"
                  />
                </div>
              ))}
            </div>
          )}

          {/* ── Blocs Markdown ─────────────────────────────────────── */}
          {projet.texte.map((bloc, i) => (
            <div key={i} style={{ marginBottom: 24 }}>
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  h1: ({ children }) => (
                    <h1
                      style={{
                        fontFamily: "var(--font-dynaPuff)",
                        fontSize: "clamp(18px, 2.5vw, 26px)",
                        fontWeight: 700,
                        color: "var(--foreground)",
                        margin: "16px 0 8px",
                      }}
                    >
                      {children}
                    </h1>
                  ),
                  h2: ({ children }) => (
                    <h2
                      style={{
                        fontFamily: "var(--font-dynaPuff)",
                        fontSize: "clamp(16px, 2vw, 22px)",
                        fontWeight: 700,
                        color: "var(--foreground)",
                        margin: "12px 0 6px",
                      }}
                    >
                      {children}
                    </h2>
                  ),
                  h3: ({ children }) => (
                    <h3
                      style={{
                        fontFamily: "var(--font-dynaPuff)",
                        fontSize: "clamp(14px, 1.8vw, 18px)",
                        fontWeight: 700,
                        color: "var(--foreground)",
                        margin: "10px 0 4px",
                      }}
                    >
                      {children}
                    </h3>
                  ),
                  h4: ({ children }) => (
                    <h4
                      style={{
                        fontSize: 15,
                        fontWeight: 700,
                        color: "var(--foreground)",
                        margin: "8px 0 4px",
                      }}
                    >
                      {children}
                    </h4>
                  ),
                  h5: ({ children }) => (
                    <h5
                      style={{
                        fontSize: 14,
                        fontWeight: 700,
                        color: "var(--foreground-secondary)",
                        margin: "6px 0 3px",
                      }}
                    >
                      {children}
                    </h5>
                  ),
                  p: ({ children }) => (
                    <p
                      style={{
                        color: "var(--foreground)",
                        lineHeight: 1.7,
                        marginBottom: 12,
                      }}
                    >
                      {children}
                    </p>
                  ),
                  strong: ({ children }) => (
                    <strong style={{ fontWeight: 700 }}>{children}</strong>
                  ),
                  em: ({ children }) => (
                    <em style={{ fontStyle: "italic" }}>{children}</em>
                  ),
                  del: ({ children }) => (
                    <del
                      style={{ textDecoration: "line-through", opacity: 0.6 }}
                    >
                      {children}
                    </del>
                  ),
                  ul: ({ children }) => (
                    <ul
                      style={{
                        listStyle: "disc",
                        paddingLeft: 20,
                        marginBottom: 12,
                      }}
                    >
                      {children}
                    </ul>
                  ),
                  ol: ({ children }) => (
                    <ol
                      style={{
                        listStyle: "decimal",
                        paddingLeft: 20,
                        marginBottom: 12,
                      }}
                    >
                      {children}
                    </ol>
                  ),
                  li: ({ children }) => (
                    <li
                      style={{
                        color: "var(--foreground)",
                        lineHeight: 1.6,
                        marginBottom: 4,
                      }}
                    >
                      {children}
                    </li>
                  ),
                  blockquote: ({ children }) => (
                    <blockquote
                      style={{
                        borderLeft: "3px solid var(--secondary)",
                        paddingLeft: 16,
                        margin: "12px 0",
                        color: "var(--foreground-secondary)",
                        fontStyle: "italic",
                      }}
                    >
                      {children}
                    </blockquote>
                  ),
                  code: ({ children, className }) => {
                    const isBlock = className?.includes("language-");
                    return isBlock ? (
                      <pre
                        style={{
                          background:
                            "color-mix(in srgb, var(--foreground) 8%, transparent)",
                          borderRadius: 8,
                          padding: "10px 14px",
                          overflowX: "auto",
                          fontSize: 13,
                          margin: "12px 0",
                        }}
                      >
                        <code>{children}</code>
                      </pre>
                    ) : (
                      <code
                        style={{
                          background:
                            "color-mix(in srgb, var(--secondary) 22%, transparent)",
                          borderRadius: 4,
                          padding: "1px 6px",
                          fontSize: "0.88em",
                        }}
                      >
                        {children}
                      </code>
                    );
                  },
                  a: ({ href, children }) => (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        color: "var(--primary)",
                        textDecoration: "underline",
                        textUnderlineOffset: 3,
                      }}
                    >
                      {children}
                    </a>
                  ),
                  hr: () => (
                    <hr
                      style={{
                        border: "none",
                        borderTop:
                          "1px solid color-mix(in srgb, var(--foreground) 15%, transparent)",
                        margin: "16px 0",
                      }}
                    />
                  ),
                }}
              >
                {bloc}
              </ReactMarkdown>
            </div>
          ))}

          {/* ── Vidéos YouTube ─────────────────────────────────────── */}
          {projet.videos.length > 0 && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 16,
                marginBottom: 24,
              }}
            >
              <p
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "var(--foreground-secondary)",
                  marginBottom: 4,
                }}
              >
                Vidéos
              </p>
              {projet.videos.map((url, i) => {
                const embedProps = youtubeEmbedProps(url);
                if (!embedProps) return null;
                return (
                  <div
                    key={i}
                    style={{
                      position: "relative",
                      aspectRatio: "16/9",
                      borderRadius: 12,
                      overflow: "hidden",
                    }}
                  >
                    <iframe
                      {...embedProps}
                      width="100%"
                      height="100%"
                      style={{ position: "absolute", inset: 0, border: "none" }}
                      referrerPolicy="strict-origin-when-cross-origin"
                      allowFullScreen
                    />
                  </div>
                );
              })}
            </div>
          )}

          {/* ── Liens ──────────────────────────────────────────────── */}
          {projet.liens.length > 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <p
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "var(--foreground-secondary)",
                  marginBottom: 4,
                }}
              >
                Liens
              </p>
              {projet.liens.map((lien, i) => (
                <a
                  key={i}
                  href={lien}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "8px 14px",
                    borderRadius: 10,
                    background:
                      "color-mix(in srgb, var(--primary) 10%, transparent)",
                    color: "var(--primary)",
                    border:
                      "1px solid color-mix(in srgb, var(--primary) 25%, transparent)",
                    fontSize: 13,
                    fontWeight: 500,
                    textDecoration: "none",
                    wordBreak: "break-all",
                  }}
                >
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    style={{ flexShrink: 0 }}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                    />
                  </svg>
                  {lien}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
