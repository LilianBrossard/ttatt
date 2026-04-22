import type { Metadata } from "next";
import { DynaPuff, Lato, Geist } from "next/font/google";
import "./globals.css";
import { SectionProvider } from "../components/SectionContext";
import Nav from "../components/section/Nav";
import SnapScroller from "../components/SnapScroller";
import { cn } from "@/lib/utils";
import { hygraphQuery } from "@/lib/hygraph";

const GET_LAYOUT_INFOS = `
  query GetLayoutInfos {
    informationsGenerals {
      lienYoutube
    }
  }
`;

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const dynaPuff = DynaPuff({
  variable: "--font-dynaPuff",
  subsets: ["latin"],
});

const lato = Lato({
  variable: "--font-lato",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TTATT",
  description:
    "TTATT, musique, art, culture, association, festival, événement, spectacle, concert, famille, tout public, tous âges, tous publics, tout le monde",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const data = await hygraphQuery<{
    informationsGenerals: { lienYoutube: string }[];
  }>(GET_LAYOUT_INFOS);

  const youtubeUrl = data.informationsGenerals?.[0]?.lienYoutube || "https://www.youtube.com/@TTATT";
  return (
    <html
      lang="fr"
      className={cn("h-full", "antialiased", "scroll-smooth", dynaPuff.variable, lato.variable, "font-sans", geist.variable)}
    >
      <body className="min-h-full flex flex-col selection:bg-(--primary) selection:text-(--background)">
        <SectionProvider>
          <Nav youtubeUrl={youtubeUrl} />
          <SnapScroller />
          <div className="flex-1 w-full min-h-screen relative flex flex-col">
            {children}
          </div>
        </SectionProvider>
      </body>
    </html>
  );
}
