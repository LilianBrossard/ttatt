"use client";

import { useEffect, useCallback } from "react";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { youtubeEmbedProps } from "@/lib/youtube";
import type { Projet } from "@/lib/types";

interface Props {
  projet: Projet;
  onClose: () => void;
}

export default function ProjetDetail({ projet, onClose }: Props) {
  // Fermeture avec Échap
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    // Bloquer le scroll du body pendant l'overlay
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [handleKeyDown]);

  // Formater la date FR
  const dateFormatted = projet.date
    ? new Intl.DateTimeFormat("fr-FR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }).format(new Date(projet.date))
    : null;

  return (
    /* ── Backdrop ─────────────────────────────────────────────────── */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ animation: "fadeIn 0.25s ease" }}
      onClick={onClose}
      aria-modal="true"
      role="dialog"
      aria-label={`Détails du projet : ${projet.titre}`}
    >
      {/* Fond flouté */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-md" />

      {/* ── Carte de détail ───────────────────────────────────────── */}
      <div
        className="relative z-10 w-full max-w-2xl max-h-[88vh] overflow-y-auto rounded-3xl"
        style={{
          background:
            "linear-gradient(160deg, var(--background) 0%, var(--background-secondary) 100%)",
          boxShadow:
            "0 0 0 2px var(--secondary), 0 8px 80px color-mix(in srgb, var(--secondary) 30%, transparent)",
          animation: "zoomIn 0.35s cubic-bezier(0.34,1.56,0.64,1)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── En-tête ─────────────────────────────────────────────── */}
        <div className="sticky top-0 z-20 flex items-start justify-between gap-4 px-7 pt-7 pb-4 rounded-t-3xl"
          style={{
            background: "linear-gradient(to bottom, var(--background) 70%, transparent)",
          }}
        >
          <div>
            <h3
              className="text-2xl sm:text-3xl font-bold leading-tight"
              style={{ fontFamily: "var(--font-dynaPuff)", color: "var(--foreground)" }}
            >
              {projet.titre}
            </h3>
            {dateFormatted && (
              <p className="mt-1 text-sm" style={{ color: "var(--foreground-secondary)" }}>
                {dateFormatted}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            aria-label="Fermer"
            className="shrink-0 mt-1 w-9 h-9 rounded-full flex items-center justify-center text-lg font-bold transition-colors"
            style={{
              background: "color-mix(in srgb, var(--foreground) 10%, transparent)",
              color: "var(--foreground)",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background =
                "color-mix(in srgb, var(--primary) 20%, transparent)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background =
                "color-mix(in srgb, var(--foreground) 10%, transparent)")
            }
          >
            ×
          </button>
        </div>

        <div className="px-7 pb-8 flex flex-col gap-7">
          {/* ── Images ───────────────────────────────────────────── */}
          {projet.images.length > 0 && (
            <div className="flex gap-3 flex-wrap">
              {projet.images.map((img, i) => (
                <div
                  key={i}
                  className="relative rounded-xl overflow-hidden"
                  style={{
                    width: projet.images.length === 1 ? "100%" : "calc(50% - 6px)",
                    aspectRatio: "16/9",
                  }}
                >
                  <Image
                    src={img.url}
                    alt={img.fileName}
                    fill
                    className="object-cover"
                    sizes="(max-width: 672px) 100vw, 336px"
                  />
                </div>
              ))}
            </div>
          )}

          {/* ── Blocs Markdown ────────────────────────────────────── */}
          {projet.texte.length > 0 && (
            <div className="flex flex-col gap-5">
              {projet.texte.map((bloc, i) => (
                <div
                  key={i}
                  className="prose prose-sm max-w-none"
                  style={{
                    color: "var(--foreground)",
                    // Styles Markdown inline car pas de tailwind/typography plugin
                  }}
                >
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      h1: ({ children }) => (
                        <h1 className="text-2xl font-bold mt-4 mb-2" style={{ fontFamily: "var(--font-dynaPuff)", color: "var(--foreground)" }}>{children}</h1>
                      ),
                      h2: ({ children }) => (
                        <h2 className="text-xl font-bold mt-3 mb-2" style={{ fontFamily: "var(--font-dynaPuff)", color: "var(--foreground)" }}>{children}</h2>
                      ),
                      h3: ({ children }) => (
                        <h3 className="text-lg font-bold mt-3 mb-1" style={{ fontFamily: "var(--font-dynaPuff)", color: "var(--foreground)" }}>{children}</h3>
                      ),
                      h4: ({ children }) => (
                        <h4 className="text-base font-bold mt-2 mb-1" style={{ color: "var(--foreground)" }}>{children}</h4>
                      ),
                      h5: ({ children }) => (
                        <h5 className="text-sm font-bold mt-2 mb-1" style={{ color: "var(--foreground-secondary)" }}>{children}</h5>
                      ),
                      p: ({ children }) => (
                        <p className="mb-3 leading-relaxed" style={{ color: "var(--foreground)" }}>{children}</p>
                      ),
                      strong: ({ children }) => (
                        <strong className="font-bold" style={{ color: "var(--foreground)" }}>{children}</strong>
                      ),
                      em: ({ children }) => (
                        <em className="italic">{children}</em>
                      ),
                      del: ({ children }) => (
                        <del className="line-through opacity-60">{children}</del>
                      ),
                      ul: ({ children }) => (
                        <ul className="list-disc pl-5 mb-3 space-y-1">{children}</ul>
                      ),
                      ol: ({ children }) => (
                        <ol className="list-decimal pl-5 mb-3 space-y-1">{children}</ol>
                      ),
                      li: ({ children }) => (
                        <li className="leading-relaxed" style={{ color: "var(--foreground)" }}>{children}</li>
                      ),
                      blockquote: ({ children }) => (
                        <blockquote
                          className="pl-4 my-3 italic"
                          style={{
                            borderLeft: "3px solid var(--secondary)",
                            color: "var(--foreground-secondary)",
                          }}
                        >
                          {children}
                        </blockquote>
                      ),
                      code: ({ children, className }) => {
                        const isBlock = className?.includes("language-");
                        return isBlock ? (
                          <pre className="rounded-lg p-3 my-3 text-sm overflow-x-auto"
                            style={{ background: "color-mix(in srgb, var(--foreground) 8%, transparent)" }}>
                            <code>{children}</code>
                          </pre>
                        ) : (
                          <code
                            className="px-1.5 py-0.5 rounded text-sm"
                            style={{ background: "color-mix(in srgb, var(--secondary) 20%, transparent)" }}
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
                          className="underline underline-offset-2 transition-colors"
                          style={{ color: "var(--primary)" }}
                        >
                          {children}
                        </a>
                      ),
                    }}
                  >
                    {bloc}
                  </ReactMarkdown>
                </div>
              ))}
            </div>
          )}

          {/* ── Vidéos YouTube ────────────────────────────────────── */}
          {projet.videos.length > 0 && (
            <div className="flex flex-col gap-4">
              <h4
                className="text-sm font-bold uppercase tracking-widest"
                style={{ color: "var(--foreground-secondary)" }}
              >
                Vidéos
              </h4>
              {projet.videos.map((url, i) => {
                const embedProps = youtubeEmbedProps(url);
                if (!embedProps) return null;
                return (
                  <div
                    key={i}
                    className="relative w-full rounded-2xl overflow-hidden"
                    style={{ aspectRatio: "16/9" }}
                  >
                    <iframe
                      {...embedProps}
                      width="100%"
                      height="100%"
                      className="absolute inset-0 w-full h-full"
                      referrerPolicy="strict-origin-when-cross-origin"
                      allowFullScreen
                    />
                  </div>
                );
              })}
            </div>
          )}

          {/* ── Liens ─────────────────────────────────────────────── */}
          {projet.liens.length > 0 && (
            <div className="flex flex-col gap-2">
              <h4
                className="text-sm font-bold uppercase tracking-widest"
                style={{ color: "var(--foreground-secondary)" }}
              >
                Liens
              </h4>
              <div className="flex flex-col gap-2">
                {projet.liens.map((lien, i) => (
                  <a
                    key={i}
                    href={lien}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all"
                    style={{
                      background:
                        "color-mix(in srgb, var(--primary) 10%, transparent)",
                      color: "var(--primary)",
                      border: "1px solid color-mix(in srgb, var(--primary) 25%, transparent)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background =
                        "color-mix(in srgb, var(--primary) 20%, transparent)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background =
                        "color-mix(in srgb, var(--primary) 10%, transparent)";
                    }}
                  >
                    <svg
                      className="w-3.5 h-3.5 shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                      />
                    </svg>
                    <span className="truncate">{lien}</span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
