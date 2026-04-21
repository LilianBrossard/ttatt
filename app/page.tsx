import SectionObserver from "../components/SectionObserver";
import Projects from "../components/section/Projets";
import Accueil from "../components/section/Accueil";
import Agenda from "../components/section/Agenda";
import Logistic from "../components/section/Logistic";
import Contact from "../components/section/Contact";
import Footer from "../components/section/Footer";

export default function Home() {
  return (
    <main className="flex flex-col w-full text-foreground">
      <h1 className="sr-only">TTATT</h1>

      <SectionObserver
        id="accueil"
        className=" min-h-screen flex flex-col justify-center items-center overflow-hidden bg-radial-[at_25%_25%] from-background/70 to-primary bg-primary shadow-lg shadow-background"
      >
        <Accueil />
      </SectionObserver>

      <SectionObserver
        id="projects"
        className=" min-h-screen flex flex-col justify-center items-center overflow-hidden bg-background shadow-lg shadow-background"
      >
        <Projects />
      </SectionObserver>

      <SectionObserver
        id="agenda"
        className=" min-h-screen flex flex-col justify-center items-center overflow-hidden bg-radial-[at_75%_75%] from-background/70 to-primary bg-primary shadow-lg shadow-background"
      >
        <Agenda />
      </SectionObserver>

      <SectionObserver
        id="logistic"
        className=" min-h-screen flex flex-col justify-center items-center overflow-hidden bg-background shadow-lg shadow-background"
      >
        <Logistic />
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
