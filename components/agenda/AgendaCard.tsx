"use client";

import type { AgendaEvent } from "@/lib/types";
import Image from "next/image";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface Props {
  event: AgendaEvent;
  onClick: () => void;
}

export default function AgendaCard({ event, onClick }: Props) {
  // Markdown removal for short description if present. Simple text truncation
  const shortDesc = event.description?.replace(/[#*`_~>\[\]]/g, "").trim();
  
  const dateFormatted = new Intl.DateTimeFormat("fr-FR", {
    weekday: "short",
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(event.dateEtHeure));

  return (
    <Card 
      onClick={onClick}
      className="cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98] border border-border/50 hover:border-primary/50 overflow-hidden bg-background/50 backdrop-blur-sm"
    >
      {event.image && (
        <div className="relative w-full h-32 overflow-hidden bg-muted">
          <Image 
            src={event.image.url} 
            alt={event.image.fileName || "Image événement"} 
            fill 
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 320px"
          />
        </div>
      )}
      
      <CardHeader className="p-4 pb-2">
        <CardTitle className="text-lg leading-tight" style={{ fontFamily: "var(--font-dynaPuff)", color: "var(--foreground)"}}>
          {event.titre}
        </CardTitle>
        <CardDescription className="font-semibold text-primary">
          <span className="capitalize">{dateFormatted}</span>
          {event.lieu && <span className="block text-xs uppercase tracking-wider text-foreground-secondary mt-1 max-w-[90%] truncate" title={event.lieu}>📍 {event.lieu}</span>}
        </CardDescription>
      </CardHeader>
      
      {!event.image && shortDesc && (
        <CardContent className="p-4 pt-0">
          <p className="text-sm line-clamp-3 text-foreground-secondary italic whitespace-pre-wrap">
            {shortDesc}
          </p>
        </CardContent>
      )}
    </Card>
  );
}
