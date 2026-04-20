import type { Metadata } from "next";
import { DynaPuff, Lato } from "next/font/google";
import "./globals.css";
import { SectionProvider } from "../components/SectionContext";
import Nav from "../components/section/Nav";

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
      className={`${dynaPuff.variable} ${lato.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full flex flex-col md:flex-row selection:bg-(--primary) selection:text-(--background)">
        <SectionProvider>
          <Nav />
          <div className="flex-1 lg:ml-[25vw] w-full min-h-screen relative flex flex-col">
            {children}
          </div>
        </SectionProvider>
      </body>
    </html>
  );
}
