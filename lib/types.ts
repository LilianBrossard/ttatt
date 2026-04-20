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
