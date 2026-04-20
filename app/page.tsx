import SectionObserver from "../components/SectionObserver";
import Projects from "../components/section/Projets";

export default function Home() {
  return (
    <main className="flex flex-col w-full text-(--foreground)">
      <h1 className="sr-only">TTATT</h1>

      <SectionObserver
        id="accueil"
        className="min-h-screen flex flex-col justify-center items-center relative py-12 px-8"
      >
        {/* Placeholder background layer */}
        <div className="absolute inset-0 bg-(--background-secondary)/30 -z-10" />
        <h2 className="text-5xl lg:text-7xl font-(family-name:--font-dynaPuff) font-bold mb-6 text-(--secondary)">
          Accueil
        </h2>
        <p className="text-xl max-w-2xl text-center">
          Bienvenue dans l'univers de TTATT. Scrollez vers le bas pour
          d&eacute;couvrir les autres sections.
        </p>
      </SectionObserver>

      <SectionObserver
        id="projects"
        className="min-h-screen flex flex-col justify-center items-center py-12 px-8 bg-(--background)"
      >
        <Projects />
      </SectionObserver>

      <SectionObserver
        id="agenda"
        className="min-h-screen flex flex-col justify-center items-center py-12 px-8 bg-(--background-secondary)"
      >
        <h2 className="text-5xl lg:text-7xl font-(family-name:--font-dynaPuff) font-bold mb-6 text-(--primary)">
          Agenda
        </h2>
        <p className="text-xl max-w-2xl text-center">
          D&eacute;couvrez les dates de nos prochains rassemblements.
        </p>
      </SectionObserver>

      <SectionObserver
        id="logistic"
        className="min-h-screen flex flex-col justify-center items-center py-12 px-8 bg-(--background)"
      >
        <h2 className="text-5xl lg:text-7xl font-(family-name:--font-dynaPuff) font-bold mb-6 text-(--secondary)">
          Logistic
        </h2>
        <p className="text-xl max-w-2xl text-center">
          Tout ce dont vous avez besoin de savoir pour venir et participer.
        </p>
      </SectionObserver>

      <SectionObserver
        id="contact"
        className="min-h-[120vh] flex flex-col justify-start items-center py-32 px-8 bg-(--background-secondary)"
      >
        <h2 className="text-5xl lg:text-7xl font-(family-name:--font-dynaPuff) font-bold mb-6 text-(--accent)">
          Contact
        </h2>
        <p className="text-xl max-w-2xl text-center">
          Laissez-nous un message ou rejoignez-nous sur r&eacute;seaux.
        </p>
      </SectionObserver>
    </main>
  );
}
