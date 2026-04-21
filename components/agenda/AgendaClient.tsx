"use client";

import { useMemo, useState } from "react";
import type { AgendaEvent } from "@/lib/types";
import AgendaCard from "./AgendaCard";
import AgendaDetail from "./AgendaDetail";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Props {
  events: AgendaEvent[];
}

export default function AgendaClient({ events }: Props) {
  const [selectedEvent, setSelectedEvent] = useState<AgendaEvent | null>(null);

  const columns = useMemo(() => {
    const today = new Date();
    // Mois actuel
    const startYear = today.getFullYear();
    const startMonth = today.getMonth(); // 0-11

    // Calculer la date max parmi les événements
    let maxDate = new Date(today.getFullYear(), today.getMonth(), 1);
    for (const ev of events) {
      const evDate = new Date(ev.dateEtHeure);
      if (evDate > maxDate) {
        maxDate = evDate;
      }
    }

    const endYear = maxDate.getFullYear();
    const endMonth = maxDate.getMonth();

    // Calculer le nombre total de mois
    const totalMonths =
      (endYear - startYear) * 12 + (endMonth - startMonth) + 1;

    // Regrouper les événements
    const groups: { label: string; events: AgendaEvent[] }[] = [];

    for (let i = 0; i < totalMonths; i++) {
      const year = startYear + Math.floor((startMonth + i) / 12);
      const monthIndex = (startMonth + i) % 12;

      const label = new Intl.DateTimeFormat("fr-FR", {
        month: "long",
        year: "numeric",
      }).format(new Date(year, monthIndex, 1));

      const monthEvents = events.filter((ev) => {
        const d = new Date(ev.dateEtHeure);
        return d.getFullYear() === year && d.getMonth() === monthIndex;
      });
      // Sort chronologically inside the month
      monthEvents.sort(
        (a, b) =>
          new Date(a.dateEtHeure).getTime() - new Date(b.dateEtHeure).getTime(),
      );

      groups.push({ label, events: monthEvents });
    }

    return groups;
  }, [events]);

  if (events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center text-foreground-secondary h-[400px]">
        <h3 className="text-2xl font-bold font-(family-name:--font-dynaPuff) mb-2">
          Agenda
        </h3>
        <p>Aucun événement n'est prévu pour le moment. Revenez vite !</p>
      </div>
    );
  }

  return (
    <div className="w-full flex-grow flex flex-col p-4 md:p-8 overflow-hidden relative z-10 pointer-events-auto">
      <h2
        className="text-5xl font-bold mb-8 text-center"
        style={{
          fontFamily: "var(--font-dynaPuff)",
          color: "var(--foreground)",
        }}
      >
        Agenda
      </h2>

      <div className="w-full whitespace-nowrap rounded-lg flex-grow h-full min-h-0 overflow-x-auto overflow-y-hidden outline-none">
        <div className="flex w-max space-x-4 p-4 h-full items-stretch">
          {columns.map((col, i) => (
            <div
              key={i}
              className={`flex flex-col rounded-2xl p-4 transition-all overflow-hidden relative ${
                col.events.length > 0 ? "w-80" : "w-16 items-center opacity-70"
              } h-full`}
              style={{
                background:
                  "color-mix(in srgb, var(--background) 50%, transparent)",
                boxShadow:
                  "inset 0 0 20px color-mix(in srgb, var(--primary) 5%, transparent)",
                border:
                  "1px solid color-mix(in srgb, var(--primary) 10%, transparent)",
                backdropFilter: "blur(12px)",
              }}
            >
              <div
                className="font-bold text-center mb-4 uppercase tracking-wider sticky top-0 bg-background/50 backdrop-blur-md p-2 rounded-lg z-10 shrink-0"
                style={{
                  color:
                    col.events.length > 0
                      ? "var(--primary)"
                      : "var(--foreground-secondary)",
                  writingMode:
                    col.events.length > 0 ? "horizontal-tb" : "vertical-lr",
                  transform: col.events.length > 0 ? "none" : "rotate(180deg)",
                }}
              >
                {col.label}
              </div>

              {col.events.length > 0 && (
                <ScrollArea className="flex-grow pr-2 min-h-0 h-full">
                  <div className="flex flex-col gap-4 pb-4">
                    {col.events.map((ev) => (
                      <AgendaCard
                        key={ev.id}
                        event={ev}
                        onClick={() => setSelectedEvent(ev)}
                      />
                    ))}
                  </div>
                </ScrollArea>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Modal / Dialog via prop onClose passée pour remettre à null */}
      {selectedEvent && (
        <AgendaDetail
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}
    </div>
  );
}
