import { hygraphQuery } from "@/lib/hygraph";
import type { Projet } from "@/lib/types";
import FleurProjets from "@/components/fleur/FleurProjets";

interface ProjetsQueryResult {
  projets: Projet[];
}

const GET_PROJETS = `
  query GetProjets {
    projets {
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

  // ── Tri : priorite ASC, les null en dernier ──────────────────────────
  const sorted = [...data.projets].sort((a, b) => {
    if (a.priorite == null && b.priorite == null) return 0;
    if (a.priorite == null) return 1;
    if (b.priorite == null) return -1;
    return a.priorite - b.priorite;
  });

  // ── Pistil : premier projet si priorite === 0, sinon null ────────────
  const pistil: Projet | null =
    sorted[0]?.priorite === 0 ? sorted[0] : null;
  const petales: Projet[] = pistil ? sorted.slice(1) : sorted;

  console.log(
    `[Projets] ${data.projets.length} projet(s) | pistil: "${pistil?.titre ?? "—"}" | ${petales.length} pétale(s)`
  );

  return <FleurProjets pistilProjet={pistil} petales={petales} />;
}
