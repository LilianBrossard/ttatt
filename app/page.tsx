import { hygraphQuery } from "@/lib/hygraph";
import SectionObserver from "../components/SectionObserver";
import Projects from "../components/section/Projets";
import Accueil from "../components/section/Accueil";
import Agenda from "../components/section/Agenda";
import Contact from "../components/section/Contact";
import Footer from "../components/section/Footer";

const GET_INFOS = `
  query GetInfos {
    informationsGenerals {
      presentation
    }
  }
`;

export default async function Home() {
  const data = await hygraphQuery<{
    informationsGenerals: { presentation: string }[];
  }>(GET_INFOS);
  const presentation = data.informationsGenerals?.[0]?.presentation || "";

  return (
    <main className="flex flex-col w-full text-foreground">
      <h1 className="sr-only">TTATT</h1>

      <SectionObserver
        id="accueil"
        className=" min-h-screen flex flex-col justify-center items-center overflow-hidden bg-radial-[at_25%_25%] from-background/70 to-primary bg-primary shadow-lg shadow-background"
      >
        <Accueil presentation={presentation} />
      </SectionObserver>

      <SectionObserver
        id="projects"
        className=" min-h-screen flex flex-col justify-center items-center overflow-hidden bg-background shadow-lg shadow-background"
      >
        <Projects />
      </SectionObserver>

      <SectionObserver
        id="agenda"
        className="h-screen w-full flex flex-col overflow-hidden bg-radial-[at_75%_75%] from-background/70 to-primary bg-primary shadow-lg shadow-background"
      >
        <Agenda />
      </SectionObserver>

      <SectionObserver
        id="contact"
        className="h-[80vh] flex flex-col justify-center items-center overflow-hidden bg-radial-[at_50%_50%] from-background/70 to-primary bg-primary shadow-lg shadow-background"
      >
        <Contact />
      </SectionObserver>
      <div className="h-[20vh] flex flex-col justify-center items-center overflow-hidden bg-foreground shadow-lg shadow-background text-background">
        <Footer />
      </div>
    </main>
  );
}
