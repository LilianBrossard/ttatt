"use client";

import { useMemo } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { AgendaEvent } from "@/lib/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

const DynamicAgendaMap = dynamic(() => import("./AgendaMap"), {
  ssr: false,
  loading: () => <div className="w-full h-[250px] flex items-center justify-center bg-muted rounded-2xl animate-pulse text-muted-foreground">Chargement de la carte...</div>
});

interface Props {
  event: AgendaEvent;
  onClose: () => void;
}

export default function AgendaDetail({ event, onClose }: Props) {
  const dateFormatted = new Intl.DateTimeFormat("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(event.dateEtHeure));

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[800px] w-[95vw] max-h-[90vh] bg-background/95 backdrop-blur-xl border-primary/30 text-foreground overflow-hidden flex flex-col p-0 rounded-3xl" style={{ boxShadow: "0 0 40px color-mix(in srgb, var(--background) 50%, transparent)" }}>
        <p className="sr-only">Détails de l'événement {event.titre}</p>
        <ScrollArea className="w-full h-full max-h-[90vh] overflow-auto">
          <div className="flex flex-col w-full">
            {event.image && (
              <div className="relative w-full h-48 sm:h-72 rounded-t-3xl overflow-hidden shrink-0">
                <Image
                  src={event.image.url}
                  alt={event.image.fileName || "Image événement"}
                  fill
                  className="object-cover"
                  sizes="(max-width: 800px) 100vw, 800px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent"></div>
              </div>
            )}
            
            <div className="px-6 pb-8 pt-4 flex-grow flex flex-col gap-6 relative z-10 w-full">
              <DialogHeader className={event.image ? "mt-[-70px]" : "mt-2"}>
                <DialogTitle className="text-4xl sm:text-5xl font-bold leading-tight" style={{ fontFamily: "var(--font-dynaPuff)", color: "var(--foreground)", textShadow: "0 2px 10px rgba(0,0,0,0.5)"}}>
                  {event.titre}
                </DialogTitle>
                <DialogDescription className="text-primary font-semibold text-xl flex items-center gap-2 mt-2">
                  <span>📅</span> <span className="capitalize">{dateFormatted}</span>
                </DialogDescription>
              </DialogHeader>

              {/* Description Markdown */}
              {event.description && (
                <div className="w-full prose prose-sm sm:prose-base max-w-none prose-p:text-foreground/90 prose-p:leading-relaxed prose-a:text-primary">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      p: ({ children }) => <p className="mb-4">{children}</p>,
                      strong: ({ children }) => <strong className="font-bold text-primary">{children}</strong>,
                      a: ({ href, children }) => <a href={href} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">{children}</a>,
                      ul: ({ children }) => <ul className="list-disc pl-5 mb-4">{children}</ul>,
                      ol: ({ children }) => <ol className="list-decimal pl-5 mb-4">{children}</ol>,
                    }}
                  >
                    {event.description}
                  </ReactMarkdown>
                </div>
              )}

              {/* Infos & Carte */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-2 border-t border-primary/20 pt-8 w-full">
                <div className="flex flex-col gap-6 w-full">
                  {event.lieu && (
                    <div className="w-full">
                      <h4 className="text-sm uppercase tracking-widest text-foreground-secondary font-bold mb-2 flex items-center gap-2"><span>📍</span> Lieu</h4>
                      <p className="text-foreground text-lg py-2 px-4 rounded-xl bg-primary/5 border border-primary/10">{event.lieu}</p>
                    </div>
                  )}

                  {event.lien && event.lien.length > 0 && (
                    <div className="w-full">
                      <h4 className="text-sm uppercase tracking-widest text-foreground-secondary font-bold mb-3 flex items-center gap-2"><span>🔗</span> Liens Utiles</h4>
                      <div className="flex flex-col gap-3">
                        {event.lien.map((l, i) => (
                          <a 
                            key={i} 
                            href={l} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="flex items-center gap-3 text-sm text-foreground hover:text-primary transition-all p-3 rounded-xl border border-border/50 hover:border-primary/50 bg-background/40 hover:bg-primary/10 shadow-sm"
                          >
                            <svg className="w-4 h-4 shrink-0 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" /></svg>
                            <span className="truncate font-medium">{new URL(l).hostname.replace('www.', '')}</span>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {event.coordinates && event.coordinates.lat && event.coordinates.lng && (
                  <div className="w-full flex-grow min-h-[250px] md:min-h-[300px] flex flex-col">
                    <h4 className="text-sm uppercase tracking-widest text-foreground-secondary font-bold mb-3 flex items-center gap-2"><span>🗺️</span> Plan</h4>
                    <div className="flex-grow w-full rounded-2xl overflow-hidden ring-1 ring-primary/20">
                      <DynamicAgendaMap lat={event.coordinates.lat} lng={event.coordinates.lng} popupText={event.titre} />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
