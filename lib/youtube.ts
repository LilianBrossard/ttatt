/**
 * Extrait l'ID d'une vidéo YouTube depuis n'importe quel format d'URL.
 * Supporte : watch?v=, youtu.be/, embed/, shorts/
 *
 * @example
 * extractYoutubeId("https://www.youtube.com/watch?v=SjDMwsbaSd8&t=182s")
 * // → "SjDMwsbaSd8"
 */
export function extractYoutubeId(url: string): string | null {
  const patterns = [
    /[?&]v=([^&#]+)/, // watch?v=ID ou ?v=ID&...
    /youtu\.be\/([^?&#]+)/, // youtu.be/ID
    /embed\/([^?&#]+)/, // embed/ID
    /shorts\/([^?&#]+)/, // shorts/ID
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match?.[1]) return match[1];
  }
  return null;
}

/**
 * Retourne les props nécessaires pour un <iframe> YouTube embed.
 */
export function youtubeEmbedProps(url: string): {
  src: string;
  title: string;
  allow: string;
} | null {
  const id = extractYoutubeId(url);
  if (!id) return null;
  return {
    src: `https://www.youtube.com/embed/${id}`,
    title: "YouTube video player",
    allow:
      "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share",
  };
}
