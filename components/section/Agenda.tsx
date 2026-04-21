import { hygraphQuery } from "@/lib/hygraph";
import type { AgendaEvent } from "@/lib/types";
import AgendaClient from "../agenda/AgendaClient";

const GET_AGENDAS = `
  query GetAgendas {
    agendas(first: 100) {
      id
      titre
      description
      dateEtHeure
      lieu
      lien
      image {
        url
        fileName
        width
        height
      }
    }
  }
`;

export default async function Agenda() {
  const data = await hygraphQuery<{ agendas: AgendaEvent[] }>(GET_AGENDAS);
  let events = data.agendas || [];

  const geoToken = process.env.GEOAPIFY_TOKEN;
  
  if (geoToken && events.length > 0) {
    events = await Promise.all(
      events.map(async (ev) => {
        if (!ev.lieu) return ev;
        try {
          const res = await fetch(`https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(ev.lieu)}&apiKey=${geoToken}`, {
            // Next.js caching: revalidate every hour or let the default
            next: { revalidate: 3600 }
          });
          if (res.ok) {
            const geoData = await res.json();
            if (geoData.features?.length > 0) {
              const coords = geoData.features[0].geometry.coordinates; // [lng, lat]
              return { ...ev, coordinates: { lat: coords[1], lng: coords[0] } };
            }
          }
        } catch (e) {
          console.error("Geoapify error for:", ev.lieu, e);
        }
        return ev;
      })
    );
  }

  // Trier par date la liste globale de toute façon
  events.sort((a, b) => new Date(a.dateEtHeure).getTime() - new Date(b.dateEtHeure).getTime());

  return <AgendaClient events={events} />;
}
