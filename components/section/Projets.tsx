import { hygraphQuery } from "@/lib/hygraph";
import type { Projet } from "@/lib/types";
import FleurProjets from "@/components/fleur/FleurProjets";
import Image from "next/image";

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
  const pistil: Projet | null = sorted[0]?.priorite === 0 ? sorted[0] : null;
  const petales: Projet[] = pistil ? sorted.slice(1) : sorted;

  console.log(
    `[Projets] ${data.projets.length} projet(s) | pistil: "${pistil?.titre ?? "—"}" | ${petales.length} pétale(s)`,
  );

  return (
    <div className="w-full h-full flex flex-col justify-center items-center relative">
      <Image
        src="/microphone.svg"
        alt="Microphone"
        width={200}
        height={200}
        className="hidden lg:block absolute top-1/3 right-1/10 -rotate-90"
      />
      <Image
        src="/music.svg"
        alt="Music"
        width={200}
        height={200}
        className="hidden lg:block absolute top-0 left-1/12"
      />
      <Image
        src="/pendulum.svg"
        alt="Pendulum"
        width={200}
        height={200}
        className="hidden lg:block absolute bottom-1/8 left-1/6"
      />
      <FleurProjets pistilProjet={pistil} petales={petales} />
    </div>
  );
}
