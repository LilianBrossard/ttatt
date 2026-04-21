export interface ProjetImage {
  url: string;
  fileName: string;
  width?: number | null;
  height?: number | null;
}

export interface Projet {
  id: string;
  titre: string;
  date?: string | null;
  priorite?: number | null;
  texte: string[]; // Blocs Markdown
  videos: string[]; // URLs YouTube
  liens: string[]; // URLs liens
  images: ProjetImage[];
}

export interface AgendaEvent {
  id: string;
  titre: string;
  description: string;
  dateEtHeure: string;
  lieu: string | null;
  lien: string[];
  image: ProjetImage | null;
  // Champs calculés via geoapify
  coordinates?: { lat: number; lng: number } | null;
}
