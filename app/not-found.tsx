import Link from "next/link";
import { ArrowLeft, ShieldAlert } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[80vh] w-full px-4 text-center relative z-10">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10 bg-radial-[at_50%_50%] from-background/70 via-background/60 to-background/20 bg-primary opacity-80" />

      <div className="bg-background/30 backdrop-blur-xl p-10 md:p-16 rounded-[2rem] border border-background shadow-2xl flex flex-col items-center animate-in fade-in zoom-in duration-500">
        <div className="w-24 h-24 rounded-full bg-background flex items-center justify-center mb-6 shadow-inner border border-background">
          <ShieldAlert size={48} className="text-foreground drop-shadow-md" />
        </div>

        <h1 className="text-6xl md:text-9xl font-extrabold font-heading tracking-tight text-foreground drop-shadow-lg mb-2">
          404
        </h1>

        <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-4">
          Page introuvable
        </h2>

        <p className="text-lg md:text-xl text-foreground max-w-md mb-10 font-medium">
          Oups ! Le chemin que vous avez emprunté semble mener nulle part.
        </p>

        <Link
          href="/"
          className="flex items-center gap-3 px-8 py-4 bg-white text-primary rounded-2xl font-bold hover:scale-105 active:scale-95 transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_40px_rgba(255,255,255,0.4)] group"
        >
          <ArrowLeft
            size={22}
            className="group-hover:-translate-x-1 transition-transform"
          />
          Retour à l'accueil
        </Link>
      </div>
    </div>
  );
}
