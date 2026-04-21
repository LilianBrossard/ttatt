import type { Metadata } from "next";
import { DynaPuff, Lato, Geist } from "next/font/google";
import "./globals.css";
import { SectionProvider } from "../components/SectionContext";
import Nav from "../components/section/Nav";
import SnapScroller from "../components/SnapScroller";
import { cn } from "@/lib/utils";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={cn("h-full", "antialiased", "scroll-smooth", dynaPuff.variable, lato.variable, "font-sans", geist.variable)}
    >
      <body className="min-h-full flex flex-col selection:bg-(--primary) selection:text-(--background)">
        <SectionProvider>
          <Nav />
          <SnapScroller />
          <div className="flex-1 w-full min-h-screen relative flex flex-col">
            {children}
          </div>
        </SectionProvider>
      </body>
    </html>
  );
}
