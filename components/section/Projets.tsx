import { hygraphQuery } from "@/lib/hygraph";

// Types correspondant au schéma Hygraph
export interface Projet {
  id: string;
  titre: string;
  date?: string | null;
  priorite?: number | null;
  texte: string[];          // Liste de blocs Markdown
  videos: string[];         // URLs de vidéos
  liens: string[];          // URLs de liens
  images: {
    url: string;
    fileName: string;
    width?: number | null;
    height?: number | null;
  }[];
}

interface ProjetsQueryResult {
  projets: Projet[];
}

const GET_PROJETS = `
  query GetProjets {
    projets(orderBy: priorite_ASC) {
      id
      titre
      date
      priorite
      texte
      videos
      liens
      images {
        url
        fileName
        width
        height
      }
    }
  }
`;

export default async function Projets() {
  const data = await hygraphQuery<ProjetsQueryResult>(GET_PROJETS);
  const projets = data.projets;

  console.log(`\n[Projets] ${projets.length} projet(s) récupéré(s) depuis Hygraph :`);
  projets.forEach((p, i) => {
    console.log(
      `  [${i + 1}] "${p.titre}"`,
      `| date: ${p.date ?? "—"}`,
      `| priorité: ${p.priorite ?? "—"}`,
      `| ${p.texte.length} bloc(s) texte`,
      `| ${p.videos.length} vidéo(s)`,
      `| ${p.liens.length} lien(s)`,
      `| ${p.images.length} image(s)`
    );
  });

  return <></>;
}
