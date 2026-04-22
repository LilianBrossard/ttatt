import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Mail, ExternalLink, Shield } from "lucide-react";

interface FooterProps {
  legalInfo?: {
    mail?: string;
    telephone?: string;
    responsableDePublication?: string;
    rna?: string;
    adresse?: string;
  };
}

export default function Footer({ legalInfo }: FooterProps) {
  const COMPANY_NAME = "TTATT";
  const EMAIL = legalInfo?.mail || "djeb56@gmail.com";
  const ADDRESS = legalInfo?.adresse || "[Adresse de l'entreprise]";
  const PHONE = legalInfo?.telephone || "[Numéro de téléphone]";
  const RNA = legalInfo?.rna || "[Numéro RNA]";
  const DIRECTOR = legalInfo?.responsableDePublication || "Jérôme BRONDEL";
  const HOST_NAME = "Vercel Inc.";
  const HOST_ADDRESS =
    "440 N Barranca Avenue #4133 Covina, CA 91723 United States";

  return (
    <footer className="w-full h-full flex flex-col justify-center items-center py-6 px-4 sm:px-8">
      <div className="flex flex-col md:flex-row justify-between items-center w-full max-w-6xl gap-6">
        {/* Email & Copyright */}
        <div className="flex flex-col items-center md:items-start gap-2">
          <a
            href={`mailto:${EMAIL}`}
            className="flex items-center gap-2 text-xl font-bold hover:text-primary transition-colors duration-300"
          >
            <Mail size={22} />
            {EMAIL}
          </a>
        </div>

        {/* Links & Legal */}
        <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-10 text-sm font-semibold text-background/80">
          <Dialog>
            <DialogTrigger className="flex items-center gap-2 hover:text-primary transition-colors outline-none cursor-pointer group">
              <Shield
                size={18}
                className="group-hover:scale-110 transition-transform"
              />
              Mentions Légales
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto bg-background text-foreground border-border/50">
              <DialogHeader className="mb-4">
                <DialogTitle className="text-3xl font-bold text-primary mb-2 font-heading">
                  Mentions Légales
                </DialogTitle>
                <DialogDescription className="sr-only">
                  Détails des mentions légales, éditeur, hébergement et
                  propriété intellectuelle.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6 text-base text-foreground/80 text-left">
                <div className="space-y-2">
                  <h3 className="font-bold text-xl text-foreground flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm">
                      1
                    </span>
                    Éditeur du site
                  </h3>
                  <div className="pl-8 space-y-1 bg-muted/30 p-4 rounded-xl">
                    <p>
                      Ce site est édité par :{" "}
                      <strong className="text-foreground">
                        {COMPANY_NAME}
                      </strong>
                    </p>
                    <p>Adresse : {ADDRESS}</p>
                    <p>
                      Email :{" "}
                      <a
                        href={`mailto:${EMAIL}`}
                        className="text-primary hover:underline font-medium"
                      >
                        {EMAIL}
                      </a>
                    </p>
                    <p>Téléphone : {PHONE}</p>
                    <p>RNA : {RNA}</p>
                    <p>Directeur de la publication : {DIRECTOR}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="font-bold text-xl text-foreground flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm">
                      2
                    </span>
                    Hébergement
                  </h3>
                  <div className="pl-8 space-y-1 bg-muted/30 p-4 rounded-xl">
                    <p>
                      Le site est hébergé par :{" "}
                      <strong className="text-foreground">{HOST_NAME}</strong>
                    </p>
                    <p>Adresse : {HOST_ADDRESS}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="font-bold text-xl text-foreground flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm">
                      3
                    </span>
                    Propriété intellectuelle
                  </h3>
                  <div className="pl-8 bg-muted/30 p-4 rounded-xl">
                    <p>
                      L'ensemble de ce site relève de la législation française
                      et internationale sur le droit d'auteur et la propriété
                      intellectuelle. Tous les droits de reproduction sont
                      réservés.
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="font-bold text-xl text-foreground flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm">
                      4
                    </span>
                    Données personnelles
                  </h3>
                  <div className="pl-8 bg-muted/30 p-4 rounded-xl">
                    <p>Aucune données personnelles ne sont collectées.</p>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <a
          href="https://lilian-brossard.vercel.app"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 hover:text-primary transition-colors group px-4 py-2 rounded-full bg-background/10 hover:bg-background/20"
        >
          Développé par{" "}
          <span className="text-background font-bold group-hover:text-primary transition-colors">
            Lilian Brossard
          </span>
          <ExternalLink
            size={16}
            className="group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform"
          />
        </a>
      </div>
    </footer>
  );
}
